import { Body, Controller, Post, Req, Res } from "@nestjs/common";
import { createUserDto } from "src/account/dto/create-user.dto";
import { AccountService } from "./account.service";
import { Request, Response } from "express";
import { signInUserDto } from "src/account/dto/sign-in-user.dto";
import { signInGuestDto } from "./dto/sign-in-guest.dto";

@Controller()
export class AccountController {
   constructor(private readonly accountService: AccountService) {}

   // 회원가입
   @Post("sign-up")
   async signUp(@Body() userData: createUserDto) {
      return await this.accountService.createUser(userData);
   }

   // 이메일 중복 체크
   @Post("sign-up/check-email")
   async checkEmail(@Body() userData: signInUserDto) {
      return await this.accountService.checkEmail(userData.email);
   }

   // 회원 로그인
   @Post("sign-in")
   async signIn(@Res({ passthrough: true }) res: Response, @Body() userData: signInUserDto) {
      return await this.accountService.signIn(res, userData);
   }

   // 비회원 로그인
   @Post("guest/sign-in")
   async guestSignIn(@Res({ passthrough: true }) res: Response, @Body() guestData: signInGuestDto) {
      return await this.accountService.guestSignIn(res, guestData);
   }

   @Post("check-password")
   async checkPassword(@Res({ passthrough: true }) res: Response, @Body() password: { password: string }) {
      return await this.accountService.checkPassword(res, password.password);
   }

   // 로그아웃
   @Post("sign-out")
   async signOut(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
      return await this.accountService.signOut(req, res);
   }
}
