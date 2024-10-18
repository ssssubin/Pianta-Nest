import { MiddlewareConsumer, Module, NestModule, OnModuleInit } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MySqlModule } from "./data/my-sql/my-sql.module";
import { ConfigModule } from "@nestjs/config";
import { MySqlService } from "./data/my-sql/my-sql.service";
import { IsAuthenticatedMiddleware } from "./middleware/is-authenticated.middleware";
import { JwtModule } from "@nestjs/jwt";
import { IsAuthenticatedAdminMiddleware } from "./middleware/is-authenticated-admin.middleware";
import { AdminModule } from "./routes/admin/admin.module";
import { CategoryController } from "./routes/category/category.controller";
import { CategoryService } from "./routes/category/category.service";
import { UserModule } from "./routes/user/user.module";

@Module({
   imports: [
      UserModule,
      MySqlModule,
      // isGlobal: 전역 모듈로 선언
      ConfigModule.forRoot({ envFilePath: ".env", isGlobal: true }),
      JwtModule.registerAsync({
         useFactory: async () => ({
            secret: process.env.USER_JWT_SECRET_KEY,
            signOptions: { expiresIn: "1h" },
            global: true,
         }),
      }),
      AdminModule,
   ],
   controllers: [AppController, CategoryController],
   providers: [AppService, CategoryService],
})
export class AppModule implements OnModuleInit, NestModule {
   constructor(private readonly mysqlService: MySqlService) {}
   async onModuleInit() {
      // 서버 시작 시 테이블 생성
      await Promise.all([
         this.mysqlService.createUserTable(),
         this.mysqlService.createGuestTable(),
         this.mysqlService.createCategoryTable(),
         this.mysqlService.createSubCategoryTable(),
      ]);
   }
   configure(consumer: MiddlewareConsumer) {
      consumer.apply(IsAuthenticatedMiddleware).forRoutes("my-page", "check-password");
      consumer.apply(IsAuthenticatedAdminMiddleware).forRoutes("admin");
   }
}
