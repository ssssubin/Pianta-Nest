import { Body, Controller, Post } from "@nestjs/common";
import { createCategoryDto } from "../dto/create-category.dto";
import { AdminCategoryService } from "./admin-category.service";
import {
   ApiBadRequestResponse,
   ApiCookieAuth,
   ApiCreatedResponse,
   ApiForbiddenResponse,
   ApiInternalServerErrorResponse,
   ApiOperation,
   ApiTags,
   ApiUnauthorizedResponse,
} from "@nestjs/swagger";
@ApiCookieAuth("adminCookies")
@ApiTags("카테고리 API")
@Controller("admin/category")
export class AdminCategoryController {
   constructor(private adminCategoryService: AdminCategoryService) {}
   // 대분류 카테고리 생성
   @Post()
   @ApiOperation({ summary: "대분류 카테고리 생성 API" })
   @ApiCreatedResponse({
      description: "대분류 카테고리 생성",
      example: { err: null, data: { categoryNumber: 1, categoryName: "꽃" } },
   })
   @ApiBadRequestResponse({
      description: "Bad Request",
      example: {
         err: "대분류 카테고리는 1자리입니다. | 대분류 카테고리는 숫자입니다. | 대분류 카테고리 이름은 문자열이어야 합니다. | 이미 존재하는 대분류 카테고리 번호입니다. | 이미 존재하는 대분류 카테고리 이름입니다.",
         data: null,
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
   @ApiInternalServerErrorResponse({ description: "Internal Server Error" })
   async createCategory(@Body() category: createCategoryDto) {
      return await this.adminCategoryService.createCategory(category);
   }
}
