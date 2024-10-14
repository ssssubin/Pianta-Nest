import { Body, Controller, Get, Put, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { MyPageService } from "./my-page.service";
import { signInUserDto } from "src/account/dto/sign-in-user.dto";

@Controller("my-page")
export class MyPageController {
   constructor(private mypageService: MyPageService) {}
   // 마이페이지 조회
   @Get()
   async getMyPage(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
      return await this.mypageService.getMyPage(req, res);
   }
   // 마이페이지 수정
   @Put()
   async updateMyPage(@Res({ passthrough: true }) res: Response, @Body() updateData: signInUserDto) {
      return await this.mypageService.updateMyPage(res, updateData);
   }
   // 회원 탈퇴
   @Put("/withdrawal")
   async withdrawal(@Res({ passthrough: true }) res: Response) {
      return await this.mypageService.withdrawalUser(res);
   }
}
