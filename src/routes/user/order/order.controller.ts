import { Body, Controller, Post, Req, Res } from "@nestjs/common";
import { OrderService } from "./order.service";
import {
   ApiBadRequestResponse,
   ApiBody,
   ApiCreatedResponse,
   ApiInternalServerErrorResponse,
   ApiOperation,
   ApiTags,
} from "@nestjs/swagger";
import { createGuestOrderDto, createUserOrderDto, guestOrderDto } from "../dto/create-order.dto";
import { Request, Response } from "express";

@ApiTags("주문 API")
@Controller("orders")
export class OrderController {
   constructor(private orderService: OrderService) {}
   @Post()
   @ApiOperation({ summary: "주문 생성 API" })
   @ApiBody({
      description: "주문 정보",
      schema: {
         example: {
            data: {
               products: [{ name: "string", price: "string" }],
               userInformation: {
                  email: "string",
                  name: "string",
                  password: "string",
                  confirmPassword: "string",
                  postNumber: "string",
                  address: "string",
                  detailAddress: "string",
                  phoneNumber: "string",
               },
            },
         },
      },
   })
   @ApiCreatedResponse({
      description: "주문 생성",
      example: {
         err: null,
         data: {
            orderNumber: 1234546745213,
            message: "주문 완료되었습니다.",
         },
      },
   })
   @ApiBadRequestResponse({
      description: "Bad Request",
      example: {
         err: "존재하지 않는 상품입니다. | 이메일은 문자열이며 빈 값이 아니어야 합니다 | 이메일은 문자열이며 빈 값이 아니어야 합니다 | 이메일 형식과 맞지 않습니다. | 이미 존재하는 이메일입니다. |전화번호는 문자열이며 빈 값이 아니어야 하고 11자리이어야 합니다 | 우편번호는 문자열이며 빈 값이 아니어야 합니다. | 도로명 주소는 문자열이며 빈 값이 아니어야 합니다 | 상세 주소는 문자열이며 빈 값이 아니어야 합니다. | 비밀번호는 4자리 숫자이어야 합니다 | 입력하신 비밀번호와 일치하지 않습니다",
         data: null,
      },
   })
   @ApiInternalServerErrorResponse({
      description: "Internal Server Error",
      example: { err: "서버 오류입니다. 잠시 후 다시 이용해주세요.", data: null },
   })
   async createOrder(
      @Res({ passthrough: true }) res: Response,
      @Req() req: Request,
      @Body() data: createUserOrderDto | createGuestOrderDto,
   ) {
      const isUser = this.orderService.isCreatedGuestOrderDto(data.information);

      return await this.orderService.createOrder(res, req, data);
   }
}
