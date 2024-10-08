import { IsNumber, IsNumberString, Length } from "class-validator";

export class signInGuestDto {
   @IsNumber()
   @Length(10, 10, { message: "주문번호는 10자리 숫자여야합니다." })
   readonly orderNumber: number;
   @IsNumberString()
   @Length(4, 4, { message: "비밀번호는 4자리 숫자이어야 합니다." })
   readonly password: string;
}
