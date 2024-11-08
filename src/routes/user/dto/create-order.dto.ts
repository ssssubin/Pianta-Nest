import { ApiProperty, OmitType } from "@nestjs/swagger";
import { productDto } from "./product.dto";
import { createUserDto } from "./create-user.dto";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";

export class userOrderDto extends OmitType(createUserDto, ["password", "confirmPassword", "agreement"] as const) {}
export class guestOrderDto extends OmitType(createUserDto, ["agreement"] as const) {}

export class createUserOrderDto {
   @ApiProperty({ description: "구매하려는 상품들" })
   @ValidateNested({ each: true })
   @Type(() => productDto)
   readonly products: productDto[];

   @ApiProperty({ description: "주문하려는 회원 정보" })
   @ValidateNested()
   @Type(() => userOrderDto)
   readonly information: userOrderDto;
}

export class createGuestOrderDto {
   @ApiProperty({ description: "구매하려는 상품들" })
   @ValidateNested({ each: true })
   @Type(() => productDto)
   readonly products: productDto[];

   @ApiProperty({ description: "주문하려는 비회원 정보" })
   @ValidateNested()
   @Type(() => guestOrderDto)
   readonly information: guestOrderDto;
}
