import { BadRequestException, Injectable } from "@nestjs/common";
import { createCategoryDto } from "../dto/create-category.dto";
import { MySqlService } from "src/data/my-sql/my-sql.service";

@Injectable()
export class AdminCategoryService {
   constructor(private mysqlService: MySqlService) {}
   async createCategory(category: createCategoryDto) {
      const numberSql = `SELECT count(*) as count FROM categories WHERE number= ?`;
      const numberParams = [category.number];
      // 대분류 카테고리 번호가 db에 존재하는 경우
      const foundCategory = await this.mysqlService.query(numberSql, numberParams);
      if (foundCategory[0].count !== 0) {
         throw new BadRequestException("이미 존재하는 대분류 카테고리 번호입니다.");
      }

      const nameSql = `SELECT count(*) as count FROM categories WHERE name= ?`;
      const nameParams = [category.name];
      const foundCategoryName = await this.mysqlService.query(nameSql, nameParams);
      // 대분류 카테고리 이름이 db에 존재하는 경우
      if (foundCategoryName[0].count !== 0) {
         throw new BadRequestException("이미 존재하는 대분류 카테고리 이름입니다.");
      }

      // 새로운 카테고리 생성
      const createSql = `INSERT INTO categories VALUES(?, ?)`;
      const createParams = [category.number, category.name];
      await this.mysqlService.query(createSql, createParams);
      return { err: null, data: { categoryNumber: category.number, categoryName: category.name } };
   }
}
