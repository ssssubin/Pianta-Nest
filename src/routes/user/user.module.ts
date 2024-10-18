import { Module } from "@nestjs/common";
import { AccountController } from "./account/account.controller";
import { AccountService } from "./account/account.service";
import { JwtModule } from "@nestjs/jwt";
import { MySqlService } from "src/data/my-sql/my-sql.service";
import { MyPageController } from "./my-page/my-page.controller";
import { MyPageService } from "./my-page/my-page.service";

@Module({
   imports: [JwtModule],
   controllers: [AccountController, MyPageController],
   providers: [AccountService, MyPageService, MySqlService],
})
export class UserModule {}
