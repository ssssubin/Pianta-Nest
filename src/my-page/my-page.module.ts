import { Module } from "@nestjs/common";
import { MyPageService } from "./my-page.service";
import { MyPageController } from "./my-page.controller";
import { MySqlService } from "src/my-sql/my-sql.service";

@Module({
   providers: [MyPageService, MySqlService],
   controllers: [MyPageController],
})
export class MyPageModule {}
