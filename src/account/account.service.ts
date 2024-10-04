import { BadRequestException, Injectable } from "@nestjs/common";
import { createUserDto } from "src/account/dto/create-user.dto";
import { MySqlService } from "src/my-sql/my-sql.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { signInUserDto } from "src/account/dto/sign-in-user.dto";
import { ConfigService } from "@nestjs/config";

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

   async signIn(userData: signInUserDto): Promise<{ jwtToken: string; isAdmin: boolean }> {
      try {
         const foundUser = await this.mysqlService.findUser(userData.email);
         const isPassword = await bcrypt.compare(userData.password, foundUser[0].password);
         // 이메일 불일치 or 패스워드 불일치 or 탈퇴한 회원인 경우
         if (foundUser[0] === undefined || isPassword === false || foundUser[0].isUser === false) {
            throw new BadRequestException("이메일이나 비밀번호가 일치하지 않습니다.");
         }

         const jwtToken = await this.jwtService.signAsync({
            email: foundUser[0].email,
            phoneNumber: foundUser[0].phone_number,
         });

         return { jwtToken, isAdmin: foundUser[0].is_admin };
      } catch (e) {
         throw e;
      }
   }
}
