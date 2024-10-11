import { Body, Controller, Get, Put, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { MyPageService } from "./my-page.service";
import { signInUserDto } from "src/account/dto/sign-in-user.dto";

@Controller("my-page")
export class MyPageController {
   constructor(private mypageService: MyPageService) {}
   @Get() // 마이페이지 조회
   async getMyPage(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
      return await this.mypageService.getMyPage(req, res);
   }

   @Put() // 마이페이지 수정
   async updateMyPage(@Res({ passthrough: true }) res: Response, @Body() updateData: signInUserDto) {
      const { newJwtToken, data } = await this.mypageService.updateMyPage(res, updateData);
      res.cookie("userCookies", newJwtToken, { httpOnly: true });
      return { err: null, data };
   }
}
