import { Controller, Get, Param } from "@nestjs/common";
import {
   ApiInternalServerErrorResponse,
   ApiNotFoundResponse,
   ApiOkResponse,
   ApiOperation,
   ApiTags,
} from "@nestjs/swagger";
import { ProductService } from "./product.service";

@ApiTags("상품 API")
@Controller()
export class ProductController {
   constructor(private productService: ProductService) {}
   @Get("product/:productNumber")
   @ApiOperation({ summary: "상품 상세 조회 API" })
   @ApiOkResponse({
      description: "상품 상세 조회",
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
   @ApiNotFoundResponse({ description: "Not Found", example: { err: "요청하신 상품을 찾을 수 없습니다.", data: null } })
   @ApiInternalServerErrorResponse({
      description: "Internal Server Error",
      example: { err: "서버 오류입니다. 잠시 후 다시 이용해주세요.", data: null },
   })
   async getProduct(@Param("productNumber") productNumber: number) {
      return await this.productService.getProduct(productNumber);
   }

   @Get("products/:categoryNumber")
   @ApiOperation({ summary: "대분류 카테고리별 상품 조회 API" })
   @ApiOkResponse({
      description: "대분류 카테고리별 상품 조회",
      example: {
         err: null,
         data: [
            { number: 1234567890, name: "개장미", price: 5000 },
            { number: 1234567891, name: "미스터 링컨", price: 25000 },
         ],
      },
   })
   @ApiNotFoundResponse({
      description: "Not Found",
      example: { err: "존재하지 않는 대분류 카테고리입니다.", data: null },
   })
   @ApiInternalServerErrorResponse({
      description: "Internal Server Error",
      example: { err: "서버 오류입니다. 잠시 후 다시 이용해주세요.", data: null },
   })
   async getProductByCategory(@Param("categoryNumber") category: number) {
      return await this.productService.getProductByCategory(category);
   }
}
