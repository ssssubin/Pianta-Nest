import { IsNumber, IsString, Length } from "class-validator";

export class createCategoryDto {
   @Length(1, 1, { message: "대분류 카테고리는 1자리입니다." })
   @IsNumber({}, { message: "대분류 카테고리는 숫자입니다." })
   readonly number: number;

   @IsString({ message: "대분류 카테고리 이름은 문자열이어야 합니다." })
   readonly name: string;
}
