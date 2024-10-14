import { Body, Controller, Post } from "@nestjs/common";
import { createCategoryDto } from "../dto/create-category.dto";
import { AdminCategoryService } from "./admin-category.service";

@Controller("admin/category")
export class AdminCategoryController {
   constructor(private adminCategoryService: AdminCategoryService) {}
   // 대분류 카테고리 생성
   @Post()
   async createCategory(@Body() category: createCategoryDto) {
      return await this.adminCategoryService.createCategory(category);
   }
}
