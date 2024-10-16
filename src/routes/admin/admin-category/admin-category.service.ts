import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { createCategoryDto } from "../dto/create-category.dto";
import { MySqlService } from "src/data/my-sql/my-sql.service";
import { updateCategoryDto } from "../dto/update-category.dto";
import { Response } from "express";

@Injectable()
export class AdminCategoryService {
   constructor(private mysqlService: MySqlService) {}
   async createCategory(category: createCategoryDto) {
      try {
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
            throw new BadRequestException("이미 존재하는 대분류 카테고리명입니다");
         }

         // 새로운 카테고리 생성
         const createSql = `INSERT INTO categories VALUES(?, ?)`;
         const createParams = [category.number, category.name];
         await this.mysqlService.query(createSql, createParams);
         return { err: null, data: { categoryNumber: category.number, categoryName: category.name } };
      } catch (e) {
         throw e;
      }
   }

   async updateCategory(category: number, categoryName: updateCategoryDto) {
      try {
         const numberSql = `SELECT count(*) as count FROM categories WHERE number = ?`;
         const numberParams = [category];
         const foundCategoryNumber = await this.mysqlService.query(numberSql, numberParams);
         if (foundCategoryNumber[0].count === 0) {
            throw new NotFoundException("존재하지 않는 대분류 카테고리입니다.");
         }

         const nameSql = `SELECT count(*) as count FROM categories WHERE name = ?`;
         const nameParams = [categoryName.name];
         const foundCategoryName = await this.mysqlService.query(nameSql, nameParams);
         if (foundCategoryName[0].count !== 0) {
            throw new BadRequestException("이미 존재하는 대분류 카테고리명입니다.");
         }

         const updateSql = `UPDATE categories SET name = ? WHERE number= ?`;
         const updateParams = [categoryName.name, category];
         await this.mysqlService.query(updateSql, updateParams);
         return { err: null, data: { categoryNumber: category, categoryName: categoryName.name } };
      } catch (e) {
         throw e;
      }
   }

   async deleteCategory(res: Response, category: number) {
      try {
         const sql = `SELECT COUNT(*) as count FROM categories WHERE number = ?`;
         const params = [category];
         const foundCategory = await this.mysqlService.query(sql, params);
         if (foundCategory[0].count === 0) {
            throw new NotFoundException("존재하지 않는 대분류 카테고리입니다.");
         }

         const deleteSql = `DELETE FROM categories WHERE number = ?`;
         await this.mysqlService.query(deleteSql, params);
         res.status(204);
         return;
      } catch (e) {
         throw e;
      }
   }
}
