import { Controller, Get, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { MyPageService } from "./my-page.service";

@Controller("my-page")
export class MyPageController {
   constructor(private mypageService: MyPageService) {}
   @Get()
   async getMyPage(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
      return await this.mypageService.getMyPage(req, res);
   }
}
