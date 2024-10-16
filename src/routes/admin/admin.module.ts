import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AdminCategoryController } from "./admin-category/admin-category.controller";
import { AdminCategoryService } from "./admin-category/admin-category.service";
import { MySqlService } from "src/data/my-sql/my-sql.service";
import { AdminSubCategoryService } from "./admin-sub-category/admin-sub-category.service";
import { AdminSubCategoryController } from "./admin-sub-category/admin-sub-category.controller";

@Module({
   imports: [JwtModule],
   providers: [AdminCategoryService, MySqlService, AdminSubCategoryService],
   controllers: [AdminCategoryController, AdminSubCategoryController],
})
export class AdminModule {}
