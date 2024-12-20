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

   // 대분류 카테고리별 상품조회
   async getProductByCategory(category: number) {
      try {
         const categorySql = `SELECT COUNT(*) as count FROM categories WHERE number = ?`;
         const categoryParams = [category];
         // 대분류 카테고리가 존재하지 않을 경우
         const foundCategory = await this.mysqlService.query(categorySql, categoryParams);
         if (foundCategory[0].count === 0) {
            throw new NotFoundException("존재하지 않는 대분류 카테고리입니다.");
         }

         const productSql = `SELECT * FROM products WHERE category_number = ?`;
         const foundProducts = await this.mysqlService.query(productSql, categoryParams);
         const data = Object.values(foundProducts).map((product) => {
            return { number: product.number, name: product.name, price: product.price };
         });

         return { err: null, data };
      } catch (e) {
         throw e;
      }
   }

   async getProductBySubCategory(category: number, subCategory: number) {
      try {
         const categorySql = `SELECT COUNT(*) as count FROM categories WHERE number = ?`;
         const categoryParams = [category];
         const foundCategory = await this.mysqlService.query(categorySql, categoryParams);
         // 대분류 카테고리가 존재하지 않을 경우
         if (foundCategory[0].count === 0) {
            throw new NotFoundException("존재하지 않는 대분류 카테고리입니다.");
         }

         const subCategorySql = `SELECT name, main_category_number FROM subcategories WHERE number = ?`;
         const subCategoryParams = [subCategory];
         const foundSubCategory = await this.mysqlService.query(subCategorySql, subCategoryParams);
         // 소분류 카테고리가 존재하지 않을 경우
         if (foundSubCategory[0] === undefined) {
            throw new NotFoundException("존재하지 않는 소분류 카테고리입니다.");
         }

         // 대분류 카테고리에 소분류 카테고리가 존재하지 않는 경우
         if (foundSubCategory[0].main_category_number !== category) {
            throw new NotFoundException("대분류 카테고리에 존재하지 않는 소분류 카테고리입니다.");
         }

         const productSql = `SELECT * FROM products WHERE category_number= ? and sub_category_number = ?`;
         const foundProduct = await this.mysqlService.query(productSql, [category, subCategory]);
         const products = Object.values(foundProduct).map((product) => {
            return { name: product.name, price: product.price };
         });
         return { err: null, data: { subCategoryName: foundSubCategory[0].name, products } };
      } catch (e) {
         throw e;
      }
   }
}
