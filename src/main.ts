import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { httpExceptionFilter } from "./filter/http-exception.filter";

async function bootstrap() {
   const app = await NestFactory.create(AppModule);
   app.setGlobalPrefix("/api"); // 모든 경로에 /api 붙이기 위함
   app.useGlobalFilters(new httpExceptionFilter());
   // swagger 설정
   const config = new DocumentBuilder()
      .setTitle("Pianta API 문서")
      .setDescription("식물 판매 사이트 API 문서")
      .setVersion("1.0.0")
      .addCookieAuth("userCookies")
      .addCookieAuth("adminCookies")
      .addCookieAuth("guestCookies")
      .build();
   const document = SwaggerModule.createDocument(app, config);
   SwaggerModule.setup("api-docs", app, document);

   app.useGlobalPipes(
      new ValidationPipe({
         whitelist: true,
         forbidNonWhitelisted: true,
         transform: true,
      }),
   );
   app.use(cookieParser());
   await app.listen(3000);
}
bootstrap();
