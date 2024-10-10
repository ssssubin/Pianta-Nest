import { ForbiddenException, Injectable, NotFoundException, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { MySqlService } from "src/my-sql/my-sql.service";

@Injectable()
export class MyPageService {
   constructor(private mysqlService: MySqlService) {}
   async getMyPage(@Req() req: Request, @Res() res: Response) {
      try {
         const { adminCookies } = req.cookies;

         // 관리자인 경우
         if (adminCookies) {
            throw new ForbiddenException("접근 권한이 없습니다.");
         }

         const sql = `SELECT * FROM users WHERE email = ?`;
         const params = [res.locals.user.email];
         const foundUser = await this.mysqlService.query(sql, params);

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
}
