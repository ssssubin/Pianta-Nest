import { Injectable } from "@nestjs/common";
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
         const params = [userData.email, userData.name, hashPassword, userData.address, userData.phone_number];
         const [postNumber, address, detailAddress] = userData.address.split(" ");

         await this.mysqlService.query(sql, params);

         return {
            err: null,
            data: {
               email: userData.email,
               name: userData.name,
               phoneNumber: userData.phone_number,
               address: [postNumber, address, detailAddress],
            },
         };
      } catch (e) {
         throw e;
      }
   }
}
