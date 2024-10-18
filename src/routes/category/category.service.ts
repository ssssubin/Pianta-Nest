import { Injectable } from "@nestjs/common";
import { MySqlService } from "src/data/my-sql/my-sql.service";

@Injectable()
export class CategoryService {
   constructor(private mySqlService: MySqlService) {}
   async getCategories() {
      const sql = `SELECT c.number as categoryNumber, c.name as categoryName, s.number as subCategoryNumber, s.name as subCategoryName FROM categories as c left join subcategories as s on c.number = s.main_category_number`;
      const foundCategories = await this.mySqlService.query(sql, []);
      return { err: null, data: foundCategories };
   }
}
