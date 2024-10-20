import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { customAlphabet } from "nanoid";
import { MySqlService } from "src/data/my-sql/my-sql.service";
import { createProductDto } from "../dto/create-product.dto";

@Injectable()
export class AdminProductService {
   constructor(private mysqlService: MySqlService) {}

   private numbers = "123456789";
   private nanoid = customAlphabet(this.numbers, 4);

   generateNumericOrderNumber() {
      return this.nanoid();
   }

   async getProducts() {
      try {
         const sql = `SELECT p.*, categoryName, subCategoryName from products as p inner join
         (SELECT c.number as categoryNumber, c.name as categoryName, s.number as subCategoryNumber, s.name as subCategoryName 
         FROM categories as c left join subcategories as s 
         on c.number = s.main_category_number) as category
         on p.category_number = category.categoryNumber and
         p.sub_category_number= category.subCategoryNumber`;

         const products = await this.mysqlService.query(sql);

         return { err: null, data: products };
      } catch (e) {
         throw e;
      }
   }

   async createProduct(productData: createProductDto) {
      try {
         const foundCategorySql = `SELECT COUNT(*) as count FROM categories WHERE name = ?`;
         const foundCategoryParams = [productData.categoryName];
         const foundCategory = await this.mysqlService.query(foundCategorySql, foundCategoryParams);

         if (foundCategory[0].count === 0) {
            throw new BadRequestException("존재하지 않는 대분류 카테고리입니다.");
         }

         const foundSubCategorySql = `SELECT number, main_category_number FROM subcategories WHERE name = ?`;
         const foundSubCategoryParams = [productData.subCategoryName];
         const foundSubCategory = await this.mysqlService.query(foundSubCategorySql, foundSubCategoryParams);

         if (foundSubCategory[0] === undefined) {
            throw new BadRequestException("존재하지 않는 소분류 카테고리입니다.");
         }

         // 상품 번호 = 업로드 날짜 + 랜덤 4자리 숫자
         const productNumber = Date.now() + this.generateNumericOrderNumber();
         // 상품 추가
         const sql = `INSERT INTO products VALUES (?,?,?,?,?,?,?)`;
         const params = [
            productNumber,
            productData.name,
            productData.price,
            productData.information,
            productData.origin,
            foundSubCategory[0].main_category_number,
            foundSubCategory[0].number,
         ];
         await this.mysqlService.query(sql, params);

         return {
            err: null,
            data: {
               number: params[0],
               name: params[1],
               price: params[2],
               information: params[3],
               origin: params[4],
               categoryNumber: params[5],
               subCategoryNumber: params[6],
            },
         };
      } catch (e) {
         throw e;
      }
   }

   async updateProduct(product: number, updateData: createProductDto) {
      const foundProductSql = `SELECT COUNT(*) as count FROM products WHERE number = ?`;
      const foundProductParams = [product];
      const foundProduct = await this.mysqlService.query(foundProductSql, foundProductParams);
      if (foundProduct[0].count === 0) {
         throw new NotFoundException("존재하지 않는 상품입니다.");
      }

      const foundCategorySql = `SELECT COUNT(*) as count FROM categories WHERE name = ?`;
      const foundCategoryParams = [updateData.categoryName];
      const foundCategory = await this.mysqlService.query(foundCategorySql, foundCategoryParams);

      if (foundCategory[0].count === 0) {
         throw new BadRequestException("존재하지 않는 대분류 카테고리입니다.");
      }

      const foundSubCategorySql = `SELECT number, main_category_number FROM subcategories WHERE name = ?`;
      const foundSubCategoryParams = [updateData.subCategoryName];
      const foundSubCategory = await this.mysqlService.query(foundSubCategorySql, foundSubCategoryParams);

      if (foundSubCategory[0] === undefined) {
         throw new BadRequestException("존재하지 않는 소분류 카테고리입니다.");
      }

      const updateSql = `UPDATE products SET name = ?, price =?, information = ?, origin = ?, category_number =?, sub_category_number =? WHERE number = ?`;
      const updateParams = [
         updateData.name,
         updateData.price,
         updateData.information,
         updateData.origin,
         foundSubCategory[0].main_category_number,
         foundSubCategory[0].number,
         product,
      ];

      await this.mysqlService.query(updateSql, updateParams);

      return {
         err: null,
         data: {
            number: product,
            name: updateParams[0],
            price: updateParams[1],
            information: updateParams[2],
            origin: updateParams[3],
            categoryNumber: updateParams[4],
            subCategoryNumber: updateParams[5],
         },
      };
   }
}
