import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { MySqlService } from "src/data/my-sql/my-sql.service";
import { createSubCategoryDto } from "../dto/create-sub-category.dto";
import { updateSubCategoryDto } from "../dto/update-sub-category.dto";

@Injectable()
export class AdminSubCategoryService {
   constructor(private mySqlService: MySqlService) {}
   async createSubCategory(subCategoryData: createSubCategoryDto) {
      try {
         const categorySql = `SELECT COUNT(*) as count FROM categories WHERE number = ?`;
         const categoryParams = [subCategoryData.mainCategoryNumber];
         const foundCategory = await this.mySqlService.query(categorySql, categoryParams);
         // 대분류 카테고리 번호 db 존재 여부 확인
         if (foundCategory[0].count === 0) {
            throw new NotFoundException("존재하지 않는 대분류 카테고리입니다.");
         }

         const subCategorySql = `SELECT COUNT(*) as count FROM subcategories WHERE number = ?`;
         const subCategoryParams = [subCategoryData.number];
         const foundSubCategory = await this.mySqlService.query(subCategorySql, subCategoryParams);
         // 소분류 카테고리 번호 db 존재 여부 확인
         if (foundSubCategory[0].count !== 0) {
            throw new BadRequestException("이미 존재하는 소분류 카테고리 번호입니다.");
         }

         const subCategoryNameSql = `SELECT COUNT(*) as count FROM subcategories WHERE name = ?`;
         const subCategoryNameParams = [subCategoryData.name];
         const foundSubCategoryName = await this.mySqlService.query(subCategoryNameSql, subCategoryNameParams);
         // 소분류 카테고리명 db 존재 여부 확인
         if (foundSubCategoryName[0].count !== 0) {
            throw new BadRequestException("이미 존재하는 소분류 카테고리명입니다.");
         }

         const createSql = `INSERT INTO subcategories VALUES (?, ?, ?)`;
         const createParams = [subCategoryData.number, subCategoryData.name, subCategoryData.mainCategoryNumber];
         await this.mySqlService.query(createSql, createParams);
         return {
            err: null,
            data: {
               subCategoryName: subCategoryData.name,
               subCategoryNumber: subCategoryData.number,
               mainCategoryNumber: subCategoryData.mainCategoryNumber,
            },
         };
      } catch (e) {
         throw e;
      }
   }

   async updateSubCategory(subCategory: number, subCategoryName: updateSubCategoryDto) {
      try {
         const subCategorySql = `SELECT COUNT(*) as count FROM subcategories WHERE number = ?`;
         const subCategoryParams = [subCategory];
         const foundSubCategory = await this.mySqlService.query(subCategorySql, subCategoryParams);
         // 소분류 카테고리 db 존재 여부
         if (foundSubCategory[0].count === 0) {
            throw new NotFoundException("존재하지 않는 소분류 카테고리입니다.");
         }

         const subCategoryNameSql = `SELECT COUNT(*) as count FROM subcategories WHERE name = ?`;
         const subCategoryNameParmas = [subCategoryName.name];
         const foundSubCategoryName = await this.mySqlService.query(subCategoryNameSql, subCategoryNameParmas);
         if (foundSubCategoryName[0].count !== 0) {
            throw new BadRequestException("이미 존재하는 소분류 카테고리명입니다.");
         }

         const updateSql = `UPDATE subcategories SET name = ? WHERE number = ?`;
         const updateParams = [subCategoryName.name, subCategory];
         await this.mySqlService.query(updateSql, updateParams);
         return { err: null, data: { subCategoryName: subCategoryName.name } };
      } catch (e) {
         throw e;
      }
   }
}
