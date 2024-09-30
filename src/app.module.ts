import { Module, OnModuleInit } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AccountModule } from "./account/account.module";
import { MySqlModule } from "./my-sql/my-sql.module";
import { ConfigModule } from "@nestjs/config";
import { MySqlService } from "./my-sql/my-sql.service";

@Module({
   imports: [
      AccountModule,
      MySqlModule,
      // isGlobal: 전역 모듈로 선언
      ConfigModule.forRoot({ envFilePath: ".env", isGlobal: true }),
   ],
   controllers: [AppController],
   providers: [AppService],
})
export class AppModule implements OnModuleInit {
   constructor(private readonly mysqlService: MySqlService) {}
   async onModuleInit() {
      // 서버 시작 시 테이블 생성
      await this.mysqlService.createUserTable();
   }
}
