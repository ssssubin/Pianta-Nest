import { Injectable } from "@nestjs/common";
import { customAlphabet } from "nanoid";
import { MySqlService } from "src/data/my-sql/my-sql.service";

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
}
