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
@Controller("product")
export class ProductController {
   constructor(private productService: ProductService) {}
   @Get(":productNumber")
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
      return this.productService.getProduct(productNumber);
   }
}
