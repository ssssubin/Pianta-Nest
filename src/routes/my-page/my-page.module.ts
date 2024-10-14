import { Module } from "@nestjs/common";
import { MyPageService } from "./my-page.service";
import { MyPageController } from "./my-page.controller";
import { MySqlService } from "src/data/my-sql/my-sql.service";
import { JwtModule } from "@nestjs/jwt";

@Module({
   imports: [JwtModule],
   providers: [MyPageService, MySqlService],
   controllers: [MyPageController],
})
export class MyPageModule {}
