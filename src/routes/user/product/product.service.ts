import { Injectable, NotFoundException } from "@nestjs/common";
import { MySqlService } from "src/data/my-sql/my-sql.service";

@Injectable()
export class ProductService {
   constructor(private mysqlService: MySqlService) {}
   // 상품 상세 조회
   async getProduct(productNumber: number) {
      try {
         const sql = `SELECT * FROM products WHERE number = ?`;
         const params = [productNumber];
         const foundProduct = await this.mysqlService.query(sql, params);

         if (foundProduct[0] === undefined) {
            throw new NotFoundException("요청하신 상품을 찾을 수 없습니다.");
         }

         const { number, name, price, information, origin, category_number, sub_category_number } = foundProduct[0];

         return {
            err: null,
            data: {
               number,
               name,
               price,
               information,
               origin,
               categoryNumber: category_number,
               subCategoryNumber: sub_category_number,
            },
         };
      } catch (e) {
         throw e;
      }
   }
}
