import { Controller, Get } from "@nestjs/common";
import { ApiCookieAuth, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AdminProductService } from "./admin-product.service";

@ApiTags("상품 API")
@ApiCookieAuth("adminCookies")
@Controller("admin/products")
export class AdminProductController {
   constructor(private productService: AdminProductService) {}
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
   @ApiInternalServerErrorResponse({ description: "Internal Server Error" })
   async getProducts() {
      return await this.productService.getProducts();
   }
}
