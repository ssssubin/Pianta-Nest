import { BadRequestException, Injectable } from "@nestjs/common";
import { createUserDto } from "src/dto/create-user.dto";
import { MySqlService } from "src/my-sql/my-sql.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class AccountService {
   // 의존성 주입
   constructor(private readonly mysqlService: MySqlService) {}
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
}
