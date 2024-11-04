import { Module } from "@nestjs/common";
import { AccountController } from "./account/account.controller";
import { AccountService } from "./account/account.service";
import { JwtModule } from "@nestjs/jwt";
import { MySqlService } from "src/data/my-sql/my-sql.service";
import { MyPageController } from "./my-page/my-page.controller";
import { MyPageService } from "./my-page/my-page.service";
import { OrderController } from "./order/order.controller";
import { OrderService } from "./order/order.service";
import { ProductController } from "./product/product.controller";
import { ProductService } from "./product/product.service";

@Module({
   imports: [JwtModule],
   controllers: [AccountController, MyPageController, OrderController, ProductController],
   providers: [AccountService, MyPageService, MySqlService, OrderService, ProductService],
})
export class UserModule {}
