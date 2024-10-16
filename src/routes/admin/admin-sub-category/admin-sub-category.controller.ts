import { Body, Controller, Post } from "@nestjs/common";
import {
   ApiBadRequestResponse,
   ApiCookieAuth,
   ApiCreatedResponse,
   ApiForbiddenResponse,
   ApiInternalServerErrorResponse,
   ApiNotFoundResponse,
   ApiOperation,
   ApiTags,
   ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { createSubCategoryDto } from "../dto/create-sub-category.dto";
import { AdminSubCategoryService } from "./admin-sub-category.service";

@ApiTags("카테고리 API")
@ApiCookieAuth("adminCookies")
@Controller("admin/subCategories")
export class AdminSubCategoryController {
   constructor(private subCategoryService: AdminSubCategoryService) {}

   // 소분류 카테고리 생성
   @Post()
   @ApiOperation({ summary: "소분류 카테고리 생성 API" })
   @ApiCreatedResponse({
      description: "소분류 카테고리 생성",
      example: { err: null, data: { subCategoryName: "장미", subCategoryNumber: 101, mainCategoryNumber: 1 } },
   })
   @ApiBadRequestResponse({
      description: "Bad Request",
      example: {
         err: "소분류 카테고리 번호는 정수여야 합니다. | 소분류 카테고리 번호는 3자리 숫자여야 합니다.| 소분류 카테고리명은 문자열이어야 합니다. | 소분류 카테고리명은 빈 값이 아니어야 합니다. | 대분류 카테고리 번호는 정수여야 합니다. | 대분류 카테고리 번호는 1자리 숫자여야 합니다. | 이미 존재하는 소분류 카테고리 번호입니다. | 이미 존재하는 소분류 카테고리명입니다.",
         date: null,
      },
   })
   @ApiUnauthorizedResponse({
      description: "UnAuthorized",
      example: {
         err: "토큰이 만료되었습니다. 다시 로그인해주세요. | 유효하지 않거나 손상된 토큰입니다. 다시 로그인해주세요.",
         data: null,
      },
   })
   @ApiForbiddenResponse({ description: "Forbidden", example: { err: "관리자가 아닙니다.", data: null } })
   @ApiNotFoundResponse({
      description: "Not Found",
      example: { err: "존재하지 않는 대분류 카테고리입니다.", data: null },
   })
   @ApiInternalServerErrorResponse({ description: "Internal Server Error" })
   async createSubCategory(@Body() subCategoryData: createSubCategoryDto) {
      return this.subCategoryService.createSubCategory(subCategoryData);
   }
}
