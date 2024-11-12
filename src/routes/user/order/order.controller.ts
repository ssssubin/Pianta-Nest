import { BadRequestException, Body, Controller, Get, Param, Post, Query, Req, Res } from "@nestjs/common";
import { OrderService } from "./order.service";
import {
   ApiBadRequestResponse,
   ApiBody,
   ApiCreatedResponse,
   ApiInternalServerErrorResponse,
   ApiOkResponse,
   ApiOperation,
   ApiTags,
   ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { createGuestOrderDto, createUserOrderDto, guestOrderDto } from "../dto/create-order.dto";
import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

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
            products: [{ name: "string", price: 0 }],
            information: {
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
      let dtoInstance;

      dtoInstance =
         isUser === false ? plainToInstance(createUserOrderDto, data) : plainToInstance(createGuestOrderDto, data);

      // dto 오류 발생 시
      const errors = await validate(dtoInstance);
      if (errors.length > 0) {
         const targets = errors.map((target) => target.children);
         throw new BadRequestException(targets[0].map((item) => item.children)[0].map((item) => item.constraints));
      }

      if (isUser === false) {
         return await this.orderService.createUserOrder(res, req, data as createUserOrderDto);
      } else {
         return await this.orderService.createGuestOrder(res, req, data as createGuestOrderDto);
      }
   }

   @Get()
   @ApiOperation({ summary: "주문 조회 API" })
   @ApiOkResponse({
      description: "주문 조회",
      example: {
         err: null,
         data: { number: 1234567891, date: "2023-02-14", products: [{ productName: "상품1", productPrice: 2000 }] },
      },
   })
   @ApiUnauthorizedResponse({
      description: "UnAuthorized",
      example: { err: "인증되지 않은 사용자입니다.", data: null },
   })
   @ApiInternalServerErrorResponse({
      description: "Internal Server Error",
      example: { err: "서버 오류입니다. 잠시 후 다시 이용해주세요.", data: null },
   })
   async getOrders(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
      return await this.orderService.getOrders(res, req);
   }
}
