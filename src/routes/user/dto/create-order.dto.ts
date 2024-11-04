import { ApiProperty, OmitType } from "@nestjs/swagger";
import { productDto } from "./product.dto";
import { createUserDto } from "./create-user.dto";

export class createUserOrderDto {
   @ApiProperty({ description: "구매하려는 상품들" })
   readonly products: productDto[];
   @ApiProperty({ description: "주문하려는 회원 정보" })
   readonly userInformation: userOrderDto;
}

export class createGuestOrderDto {
   @ApiProperty({ description: "구매하려는 상품들" })
   readonly products: productDto[];
   @ApiProperty({ description: "주문하려는 비회원 정보" })
   readonly guestInformation: guestOrderDto;
}

export class userOrderDto extends OmitType(createUserDto, ["password", "confirmPassword", "agreement"] as const) {}
export class guestOrderDto extends OmitType(createUserDto, ["agreement"] as const) {}
