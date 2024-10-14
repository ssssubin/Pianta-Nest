import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AdminCategoryController } from "./admin-category/admin-category.controller";
import { AdminCategoryService } from "./admin-category/admin-category.service";
import { MySqlService } from "src/data/my-sql/my-sql.service";

@Module({
   imports: [JwtModule],
   providers: [AdminCategoryService, MySqlService],
   controllers: [AdminCategoryController],
})
export class AdminModule {}
