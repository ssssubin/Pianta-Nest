import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString, Min } from "class-validator";

export class createProductDto {
   @ApiProperty({ description: "상품명" })
   @IsString({ message: "상품명은 문자열이어야 합니다." })
   @IsNotEmpty({ message: "상품명은 빈 값이 아니어야 합니다." })
   readonly name: string;

   @ApiProperty({ description: "가격" })
   @IsInt({ message: "가격은 정수여야 합니다." })
   @Min(0, { message: "가격은 양수여야 합니다." })
   readonly price: number;

   @ApiProperty({ description: "상품 정보" })
   @IsString({ message: "상품 정보는 문자열이어야 합니다." })
   readonly information?: string;

   @ApiProperty({ description: "원산지" })
   @IsString({ message: "원산지는 문자열이어야 합니다." })
   readonly origin?: string;

   @ApiProperty({ description: "대분류 카테고리명" })
   @IsString({ message: "대분류 카테고리명은 문자열이어야 합니다." })
   @IsNotEmpty({ message: "대분류 카테고리명은 빈 값이 아니어야 합니다." })
   readonly categoryName: string;

   @ApiProperty({ description: "소분류 카테고리명" })
   @IsString({ message: "소분류 카테고리명은 문자열이어야 합니다." })
   @IsNotEmpty({ message: "소분류 카테고리명은 빈 값이 아니어야 합니다." })
   readonly subCategoryName: string;
}
