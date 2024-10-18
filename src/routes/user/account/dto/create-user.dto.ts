import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsMobilePhone, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class createUserDto {
   @ApiProperty({ description: "사용자 이메일" })
   @IsEmail({}, { message: "올바른 이메일 형식이 아닙니다." })
   readonly email: string;

   @ApiProperty({ description: "사용자 이름" })
   @IsNotEmpty({ message: "이름은 빈 값이 아니어야 합니다." })
   @IsString({ message: "이름은 문자열이어야 합니다." })
   readonly name: string;

   @ApiProperty({ description: "사용자 비밀번호" })
   @MinLength(8, { message: "비밀번호는 8글자 이상이어야 합니다." })
   @IsString({ message: "비밀번호는 문자열이어야 합니다." })
   @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
      message: "비밀번호는 영문자, 숫자, 특수문자를 모두 포함하여야 합니다.",
   })
   readonly password: string;

   @ApiProperty({ description: "비밀번호 확인" })
   @IsNotEmpty({ message: "비밀번호는 빈 값이 아니어야 합니다." })
   @IsString({ message: "비밀번호는 문자열이어야 합니다." })
   readonly confirmPassword: string;

   @ApiProperty({ description: "사용자 우편번호" })
   @IsNotEmpty({ message: "주소는 빈 값이 아니어야 합니다." })
   @IsString({ message: "주소는 문자열이어야 합니다." })
   readonly postNumber: string;

   @ApiProperty({ description: "사용자 주소" })
   @IsNotEmpty({ message: "주소는 빈 값이 아니어야 합니다." })
   @IsString({ message: "주소는 문자열이어야 합니다." })
   readonly address: string;

   @ApiProperty({ description: "사용자 상세 주소" })
   @IsNotEmpty({ message: "주소는 빈 값이 아니어야 합니다." })
   @IsString({ message: "주소는 문자열이어야 합니다." })
   readonly detailAddress: string;

   @ApiProperty({ description: "사용자 핸드폰 번호" })
   @IsMobilePhone("ko-KR", {}, { message: "올바르지 않은 전화번호입니다." })
   readonly phoneNumber: string;

   @ApiProperty({ description: "이용 약관 체크 여부" })
   @IsBoolean({ message: "이용 약관에 동의가 필요합니다." })
   readonly agreement: boolean;
}
