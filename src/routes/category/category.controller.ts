import { Controller, Get } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("카테고리 API")
@Controller("categories")
export class CategoryController {
   constructor(private categoryService: CategoryService) {}
   // 전체 카테고리 조회
   @Get()
   @ApiOperation({ description: "전체 카테고리 조회 API" })
   @ApiOkResponse({
      description: "카테고리 조회",
      example: {
         err: null,
         data: [{ categoryNumber: 1, categoryName: "꽃", subCategoryNumber: 101, subCategoryName: "장미" }],
      },
   })
   @ApiInternalServerErrorResponse({ description: "Internal Server Error" })
   async getCategories() {
      return await this.categoryService.getCategories();
   }
}
