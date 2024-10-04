import { IsBoolean, IsEmail, IsMobilePhone, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class createUserDto {
   @IsEmail({}, { message: "올바른 이메일 형식이 아닙니다." })
   readonly email: string;

   @IsNotEmpty({ message: "이름은 빈 값이 아니어야 합니다." })
   @IsString({ message: "이름은 문자열이어야 합니다." })
   readonly name: string;

   @MinLength(8, { message: "비밀번호는 8글자 이상이어야 합니다." })
   @IsString({ message: "비밀번호는 문자열이어야 합니다." })
   @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
      message: "비밀번호는 영문자, 숫자, 특수문자를 모두 포함하여야 합니다.",
   })
   readonly password: string;

   @IsNotEmpty({ message: "비밀번호는 빈 값이 아니어야 합니다." })
   @IsString({ message: "비밀번호는 문자열이어야 합니다." })
   readonly confirmPassword: string;

   @IsNotEmpty({ message: "주소는 빈 값이 아니어야 합니다." })
   @IsString({ message: "주소는 문자열이어야 합니다." })
   readonly postNumber: string;

   @IsNotEmpty({ message: "주소는 빈 값이 아니어야 합니다." })
   @IsString({ message: "주소는 문자열이어야 합니다." })
   readonly address: string;

   @IsNotEmpty({ message: "주소는 빈 값이 아니어야 합니다." })
   @IsString({ message: "주소는 문자열이어야 합니다." })
   readonly detailAddress: string;

   @IsMobilePhone("ko-KR", {}, { message: "올바르지 않은 전화번호입니다." })
   readonly phoneNumber: string;

   @IsBoolean()
   readonly agreement: boolean;
}
