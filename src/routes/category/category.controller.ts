import { Controller, Get } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("카테고리 API")
@Controller("categories")
export class CategoryController {
   constructor(private categoryService: CategoryService) {}
   // 전체 카테고리 조회
   @Get()
   @ApiOperation({ summary: "전체 카테고리 조회 API" })
   @ApiOkResponse({
      description: "카테고리 조회",
      example: {
         err: null,
         data: [{ categoryNumber: 1, categoryName: "꽃", subCategoryNumber: 101, subCategoryName: "장미" }],
      },
   })
   @ApiInternalServerErrorResponse({
      description: "Internal Server Error",
      example: { err: "서버 오류입니다. 잠시 후 다시 이용해주세요.", data: null },
   })
   async getCategories() {
      return await this.categoryService.getCategories();
   }
}
