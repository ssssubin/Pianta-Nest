import { Module } from "@nestjs/common";
import { AccountService } from "./account.service";
import { AccountController } from "./account.controller";
import { MySqlService } from "src/data/my-sql/my-sql.service";
import { JwtModule } from "@nestjs/jwt";

@Module({
   imports: [JwtModule],
   providers: [AccountService, MySqlService], // accountService와 mysqlService 등록
   controllers: [AccountController],
})
export class AccountModule {}
