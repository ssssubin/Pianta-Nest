import { Module } from "@nestjs/common";
import { AccountService } from "./account.service";
import { AccountController } from "./account.controller";
import { MySqlService } from "src/my-sql/my-sql.service";

@Module({
   providers: [AccountService, MySqlService], // accountService와 mysqlService 등록
   controllers: [AccountController],
})
export class AccountModule {}
