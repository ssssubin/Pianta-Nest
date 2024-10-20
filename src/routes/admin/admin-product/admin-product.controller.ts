import { Body, Controller, Delete, Get, Param, Post, Put, Res } from "@nestjs/common";
import {
   ApiBadRequestResponse,
   ApiCookieAuth,
   ApiCreatedResponse,
   ApiForbiddenResponse,
   ApiInternalServerErrorResponse,
   ApiNoContentResponse,
   ApiNotFoundResponse,
   ApiOkResponse,
   ApiOperation,
   ApiTags,
   ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { AdminProductService } from "./admin-product.service";
import { createProductDto } from "../dto/create-product.dto";
import { Response } from "express";

@ApiTags("상품 API")
@ApiCookieAuth("adminCookies")
@Controller("admin/products")
export class AdminProductController {
   constructor(private productService: AdminProductService) {}

   // 전체 상품 조회
   @Get()
   @ApiOperation({ summary: "상품 조회 API" })
   @ApiOkResponse({
      description: "상품 조회",
      example: {
         err: null,
         data: [
            {
               number: 20241020123,
               name: "장미꽃",
               price: 5000,
               information: "빨간 장미",
               origin: "한국",
               category_number: 1,
               sub_category_number: 101,
               categoryName: "꽃",
               subCategoryName: "장미",
            },
         ],
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
   async getProducts() {
      return await this.productService.getProducts();
   }

   // 상품 생성
   @Post()
   @ApiOperation({ summary: "상품 생성 API" })
   @ApiCreatedResponse({
      description: "상품 생성",
      example: {
         err: null,
         data: {
            number: "17294115786087126",
            name: "test",
            price: 100000,
            information: "test",
            origin: "test",
            categoryNumber: 1,
            subCategoryNumber: 101,
         },
      },
   })
   @ApiBadRequestResponse({
      description: "Bad Request",
      example: {
         err: "상품명은 문자열이어야 합니다. | 상품명은 빈 값이 아니어야 합니다. | 가격은 정수여야 합니다. | 가격은 양수여야 합니다. | 상품 정보는 문자열이어야 합니다. | 원산지는 문자열이어야 합니다. | 대분류 카테고리명은 문자열이어야 합니다. | 대분류 카테고리명은 빈 값이 아니어야 합니다. | 소분류 카테고리명은 문자열이어야 합니다. | 소분류 카테고리명은 빈 값이 아니어야 합니다. | 존재하지 않는 대분류 카테고리입니다. | 존재하지 않는 소분류 카테고리입니다.",
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
   async createProduct(@Body() productData: createProductDto) {
      return await this.productService.createProduct(productData);
   }

   // 상품 수정
   @ApiOperation({ summary: "상품 수정 API" })
   @Put(":productNumber")
   @ApiOkResponse({
      description: "상품 수정",
      example: {
         err: null,
         data: {
            number: "17294115786087126",
            name: "test",
            price: 100000,
            information: "test",
            origin: "test",
            categoryNumber: 1,
            subCategoryNumber: 101,
         },
      },
   })
   @ApiBadRequestResponse({
      description: "Bad Request",
      example: {
         err: "상품명은 문자열이어야 합니다. | 상품명은 빈 값이 아니어야 합니다. | 가격은 정수여야 합니다. | 가격은 양수여야 합니다. | 상품 정보는 문자열이어야 합니다. | 원산지는 문자열이어야 합니다. | 대분류 카테고리명은 문자열이어야 합니다. | 대분류 카테고리명은 빈 값이 아니어야 합니다. | 소분류 카테고리명은 문자열이어야 합니다. | 소분류 카테고리명은 빈 값이 아니어야 합니다. | 존재하지 않는 대분류 카테고리입니다. | 존재하지 않는 소분류 카테고리입니다.",
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
   @ApiNotFoundResponse({ description: "Not Found", example: { err: "존재하지 않는 상품입니다.", data: null } })
   @ApiInternalServerErrorResponse({ description: "Internal Server Error" })
   async updateProduct(@Param("productNumber") product: bigint, @Body() updateData: createProductDto) {
      return await this.productService.updateProduct(product, updateData);
   }

   // 상품 삭제
   @ApiOperation({ summary: "상품 삭제 API" })
   @Delete(":productNumber")
   @ApiNoContentResponse({ description: "상품 삭제" })
   @ApiUnauthorizedResponse({
      description: "UnAuthorized",
      example: {
         err: "토큰이 만료되었습니다. 다시 로그인해주세요. | 유효하지 않거나 손상된 토큰입니다. 다시 로그인해주세요.",
         data: null,
      },
   })
   @ApiForbiddenResponse({ description: "Forbidden", example: { err: "관리자가 아닙니다.", data: null } })
   @ApiNotFoundResponse({ description: "Not Found", example: { err: "존재하지 않는 상품입니다.", data: null } })
   @ApiInternalServerErrorResponse({ description: "Internal Server Error" })
   async deleteProduct(@Res({ passthrough: true }) res: Response, @Param("productNumber") product: bigint) {
      return await this.productService.deleteProduct(res, product);
   }
}
