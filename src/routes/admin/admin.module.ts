import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AdminCategoryController } from "./admin-category/admin-category.controller";
import { AdminCategoryService } from "./admin-category/admin-category.service";
import { MySqlService } from "src/data/my-sql/my-sql.service";
import { AdminSubCategoryService } from "./admin-sub-category/admin-sub-category.service";
import { AdminSubCategoryController } from "./admin-sub-category/admin-sub-category.controller";
import { AdminProductController } from './admin-product/admin-product.controller';
import { AdminProductService } from './admin-product/admin-product.service';

@Module({
   imports: [JwtModule],
   providers: [AdminCategoryService, MySqlService, AdminSubCategoryService, AdminProductService],
   controllers: [AdminCategoryController, AdminSubCategoryController, AdminProductController],
})
export class AdminModule {}
