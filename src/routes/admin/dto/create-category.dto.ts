import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString, Max, Min } from "class-validator";

export class createCategoryDto {
   @ApiProperty({ description: "대분류 카테고리 번호" })
   @IsInt({ message: "대분류 카테고리 번호는 정수입니다." })
   @Min(1, { message: "대분류 카테고리 번호는 1자리 숫자여야 합니다." })
   @Max(9, { message: "대분류 카테고리 번호는 1자리 숫자여야 합니다." })
   readonly number: number;

   @ApiProperty({ description: "대분류 카테고리 이름" })
   @IsNotEmpty({ message: "대분류 카테고리명은 빈 값이 아니어야 합니다." })
   @IsString({ message: "대분류 카테고리 이름은 문자열이어야 합니다." })
   readonly name: string;
}
