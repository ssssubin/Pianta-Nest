import { ApiProperty, OmitType, PickType } from "@nestjs/swagger";
import { createUserDto } from "./create-user.dto";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { createProductDto } from "src/routes/admin/dto/create-product.dto";

export class userOrderDto extends OmitType(createUserDto, ["password", "confirmPassword", "agreement"] as const) {}
export class guestOrderDto extends OmitType(createUserDto, ["agreement"] as const) {}
export class productDto extends PickType(createProductDto, ["name", "price"] as const) {}

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
