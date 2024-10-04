import { Body, Controller, Post, Res } from "@nestjs/common";
import { createUserDto } from "src/account/dto/create-user.dto";
import { AccountService } from "./account.service";
import { Response } from "express";
import { signInUserDto } from "src/account/dto/sign-in-user.dto";

@Controller()
export class AccountController {
   constructor(private readonly accountService: AccountService) {}

   @Post("sign-up")
   async signUp(@Body() userData: createUserDto) {
      return await this.accountService.createUser(userData);
   }

   @Post("sign-up/check-email")
   async checkEmail(@Body() userData: signInUserDto) {
      return await this.accountService.checkEmail(userData.email);
   }

   @Post("sign-in")
   async signIn(@Res({ passthrough: true }) res: Response, @Body() userData: signInUserDto) {
      const { jwtToken, isAdmin } = await this.accountService.signIn(userData);
      if (isAdmin) {
         res.cookie("adminCookies", jwtToken, { httpOnly: true });
         return { err: null, data: { isAdmin: true, message: "로그인에 성공하셨습니다. 환영합니다." } };
      }
      res.cookie("userCookies", jwtToken, { httpOnly: true });
      return { err: null, data: { isAdmin: false, message: "로그인에 성공하셨습니다. 환영합니다." } };
   }
}
