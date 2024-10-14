import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { createUserDto } from "src/account/dto/create-user.dto";
import { MySqlService } from "src/data/my-sql/my-sql.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { signInUserDto } from "src/account/dto/sign-in-user.dto";
import { signInGuestDto } from "./dto/sign-in-guest.dto";
import { Request, Response } from "express";

@Injectable()
export class AccountService {
   // 의존성 주입
   constructor(
      private readonly mysqlService: MySqlService,
      private jwtService: JwtService,
   ) {}
   async createUser(userData: createUserDto) {
      try {
         const sql = `INSERT INTO users(email, name, password, address, phone_number) VALUES (?,?,?,?,?)`;
         const hashPassword = await bcrypt.hash(userData.password, 10);
         const address = userData.postNumber + " " + userData.address + " " + userData.detailAddress;
         const params = [userData.email, userData.name, hashPassword, address, userData.phoneNumber];

         // 가입된 이메일이 존재하는 경우
         await this.checkEmail(userData.email);

         // 비밀번호 일치 여부
         if (userData.password !== userData.confirmPassword) {
            throw new BadRequestException("비밀번호가 일치하지 않습니다.");
         }

         // 이용약관 동의를 안 한 경우
         if (userData.agreement === false) {
            throw new BadRequestException("이용 약관에 동의가 필요합니다.");
         }

         await this.mysqlService.query(sql, params);

         return {
            err: null,
            data: {
               email: userData.email,
               name: userData.name,
               phoneNumber: userData.phoneNumber,
               address: [userData.postNumber, userData.address, userData.detailAddress],
            },
         };
      } catch (e) {
         throw e;
      }
   }

   async checkEmail(email: string) {
      try {
         const foundEmail = await this.mysqlService.findUser(email);
         if (foundEmail[0] !== undefined) {
            throw new BadRequestException("이미 존재하는 이메일입니다.");
         }

         return { err: null, data: email };
      } catch (e) {
         throw e;
      }
   }

   async signIn(res: Response, userData: signInUserDto) {
      try {
         const foundUser = await this.mysqlService.findUser(userData.email);
         const isPassword = await bcrypt.compare(userData.password, foundUser[0].password);
         // 이메일 불일치 or 패스워드 불일치 or 탈퇴한 회원인 경우
         if (foundUser[0] === undefined || isPassword === false || foundUser[0].is_user === 0) {
            throw new BadRequestException("이메일이나 비밀번호가 일치하지 않습니다.");
         }

         const jwtToken = await this.jwtService.signAsync(
            {
               email: foundUser[0].email,
               phoneNumber: foundUser[0].phone_number,
            },
            { secret: process.env.USER_JWT_SECRET_KEY },
         );

         // 관리자인 경우
         if (foundUser[0].is_admin) {
            res.status(200).cookie("adminCookies", jwtToken, { httpOnly: true });
            return { err: null, data: { isAdmin: true, message: "로그인에 성공하셨습니다. 환영합니다." } };
         }
         // 유저인 경우
         res.status(200).cookie("userCookies", jwtToken, { httpOnly: true });
         return { err: null, data: { isAdmin: false, message: "로그인에 성공하셨습니다. 환영합니다." } };
      } catch (e) {
         throw e;
      }
   }

   async guestSignIn(res: Response, guestData: signInGuestDto) {
      try {
         const sql = `SELECT * FROM guests WHERE order_number = ?;`;
         const params = [guestData.orderNumber];
         const foundGuest = await this.mysqlService.query(sql, params);
         const isPassword = await bcrypt.compare(guestData.password, foundGuest[0].password);
         if (foundGuest[0] === undefined || isPassword === false) {
            throw new BadRequestException("주문번호나 비밀번호가 일치하지 않습니다.");
         }

         const jwtToken = await this.jwtService.signAsync(
            {
               email: foundGuest[0].email,
               phone_number: foundGuest[0].phone_number,
            },
            { secret: process.env.GUEST_JWT_SECRET_KEY },
         );
         res.status(200).cookie("guestCookies", jwtToken, { httpOnly: true });
         return { err: null, message: "인증 성공하였습니다." };
      } catch (e) {
         throw e;
      }
   }

   async checkPassword(res: Response, password: string) {
      try {
         const foundUser = await this.mysqlService.findUser(res.locals.user.email);
         if (foundUser[0] === undefined) {
            throw new NotFoundException("사용자를 찾을 수 없습니다.");
         }

         const isPasswordCorrect = await bcrypt.compare(password, foundUser[0].password);
         if (isPasswordCorrect === false) {
            throw new UnauthorizedException("비밀번호가 일치하지 않습니다. 비밀번호를 다시 입력해주세요.");
         }

         // update_lock -> fasle로 변경
         const sql = `UPDATE users SET update_lock = ?`;
         const params = [false];
         await this.mysqlService.query(sql, params);
         res.statusCode = 200;
         return { err: null, data: { message: "비밀번호 재확인 완료되었습니다." } };
      } catch (e) {
         throw e;
      }
   }

   async signOut(req: Request, res: Response) {
      try {
         const { userCookies, guestCookies, adminCookies } = req.cookies;
         if (userCookies) {
            res.status(200).clearCookie("userCookies");
            return { err: null, data: "성공적으로 로그아웃 되었습니다." };
         }

         if (guestCookies) {
            res.status(200).clearCookie("guestCookies");
            return { err: null, data: "성공적으로 로그아웃 되었습니다." };
         }

         if (adminCookies) {
            res.status(200).clearCookie("adminCookies");
            return { err: null, data: "성공적으로 로그아웃 되었습니다." };
         }
      } catch (e) {
         throw e;
      }
   }
}
