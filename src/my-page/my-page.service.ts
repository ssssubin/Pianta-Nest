import { ForbiddenException, Injectable, NotFoundException, PreconditionFailedException } from "@nestjs/common";
import { Request, Response } from "express";
import { MySqlService } from "src/my-sql/my-sql.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { signInUserDto } from "src/account/dto/sign-in-user.dto";
@Injectable()
export class MyPageService {
   constructor(
      private mysqlService: MySqlService,
      private jwtService: JwtService,
   ) {}
   // 마이페이지 조회
   async getMyPage(req: Request, res: Response) {
      try {
         const { adminCookies } = req.cookies;

         // 관리자인 경우
         if (adminCookies) {
            throw new ForbiddenException("접근 권한이 없습니다.");
         }

         const foundUser = await this.mysqlService.findUser(res.locals.user.email);

         if (foundUser[0] === undefined) {
            throw new NotFoundException("해당 유저를 찾을 수 없습니다.");
         }

         return {
            err: null,
            data: {
               name: foundUser[0].name,
               email: foundUser[0].email,
               address: foundUser[0].address,
               phoneNumber: foundUser[0].phone_number,
            },
         };
      } catch (e) {
         throw e;
      }
   }

   // 마이페이지 수정
   async updateMyPage(res: Response, updateData: signInUserDto) {
      try {
         const foundUser = await this.mysqlService.findUser(res.locals.user.email);
         // 유저가 존재하지 않는 경우
         if (foundUser[0] === undefined) {
            throw new NotFoundException("해당 유저를 찾을 수 없습니다.");
         }

         // 비밀번호 재확인 안 했을 경우
         if (foundUser[0].update_lock === 1) {
            throw new PreconditionFailedException("비밀번호를 재확인해야 합니다.");
         }

         const hashPassword = await bcrypt.hash(updateData.password, 10);
         const address = updateData.postNumber + " " + updateData.address + " " + updateData.detailAddress;
         const sql = `UPDATE users 
         SET email = ?, name = ?, password =?, address = ?, phone_number = ?, update_lock = ?
         WHERE email = ?`;
         const params = [
            updateData.email,
            updateData.name,
            hashPassword,
            address,
            updateData.phoneNumber,
            true,
            foundUser[0].email,
         ];
         await this.mysqlService.query(sql, params);

         const newJwtToken = await this.jwtService.signAsync(
            {
               email: updateData.email,
               phone_number: updateData.phoneNumber,
            },
            { secret: process.env.USER_JWT_SECRET_KEY },
         );

         res.cookie("userCookies", newJwtToken, { httpOnly: true });
         return {
            err: null,
            data: {
               email: updateData.email,
               name: updateData.name,
               address,
               phoneNumber: updateData.phoneNumber,
            },
         };
      } catch (e) {
         throw e;
      }
   }

   // 회원 탈퇴
   async withdrawalUser(res: Response) {
      try {
         const foundUser = await this.mysqlService.findUser(res.locals.user.email);
         if (foundUser === undefined) {
            throw new NotFoundException("유저를 찾을 수 없습니다.");
         }

         const sql = `UPDATE users SET is_user = ? WHERE email = ?`;
         const params = [false, foundUser[0].email];
         await this.mysqlService.query(sql, params);
         res.clearCookie("userCookies");
         return { err: null, data: { message: "탈퇴되었습니다." } };
      } catch (e) {
         throw e;
      }
   }
}
