import { Body, Controller, Get, Put, Req, Res } from "@nestjs/common";
import { Response } from "express";
import { MyPageService } from "./my-page.service";
import { signInUserDto } from "src/routes/user/dto/sign-in-user.dto";
import {
   ApiBadRequestResponse,
   ApiBody,
   ApiCookieAuth,
   ApiForbiddenResponse,
   ApiInternalServerErrorResponse,
   ApiNotFoundResponse,
   ApiOperation,
   ApiPreconditionFailedResponse,
   ApiResponse,
   ApiTags,
   ApiUnauthorizedResponse,
} from "@nestjs/swagger";

@ApiTags("마이페이지 API")
@ApiCookieAuth("userCookies")
@Controller("my-page")
export class MyPageController {
   constructor(private mypageService: MyPageService) {}
   // 마이페이지 조회
   @Get()
   @ApiOperation({ summary: "마이페이지 조회 API" })
   @ApiResponse({
      status: 200,
      description: "마이페이지 조회 성공",
      example: {
         err: null,
         data: {
            name: "김철수",
            email: "test@test.com",
            address: "12345 서울시 광진구 105동 201호",
            phoneNumber: "01012341234",
         },
      },
   })
   @ApiUnauthorizedResponse({
      description: "UnAuthorized",
      example: {
         err: "토큰이 만료되었습니다. 다시 로그인해주세요. | 유효하지 않거나 손상된 토큰입니다. 다시 로그인해주세요.",
         data: null,
      },
   })
   @ApiForbiddenResponse({
      description: "Forbidden",
      example: { err: "인증되지 않은 사용자입니다.", data: null },
   })
   @ApiNotFoundResponse({
      description: "Not Found",
      example: {
         err: "해당 유저를 찾을 수 없습니다.",
         data: null,
      },
   })
   @ApiInternalServerErrorResponse({
      description: "Internal Server Error",
      example: { err: "서버 오류입니다. 잠시 후 다시 이용해주세요.", data: null },
   })
   async getMyPage(@Res({ passthrough: true }) res: Response) {
      return await this.mypageService.getMyPage(res);
   }
   // 마이페이지 수정
   @Put()
   @ApiOperation({ summary: "마이페이지 수정 API" })
   @ApiBody({
      schema: {
         example: {
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
   })
   @ApiResponse({
      status: 200,
      description: "마이페이지 수정 성공",
      example: {
         err: null,
         data: {
            email: "test@test.com",
            name: "김철수",
            address: "12345 서울시 광진구 105동 201호",
            phoneNumber: "01012341234",
         },
      },
   })
   @ApiBadRequestResponse({
      description: "Bad Request",
      example: {
         err: "올바른 이메일 형식이 아닙니다. | 이메일은 빈 값이 아니어야 합니다. | 이메일은 문자열이어야 합니다. | 비밀번호는 8글자 이상이어야 합니다. | 비밀번호는 문자열이어야 합니다. | 비밀번호는 영문자, 숫자, 특수문자를 모두 포함하여야 합니다. | 주소는 빈 값이 아니어야 합니다. | 주소는 문자열이어야 합니다. | 올바르지 않은 전화번호입니다. | 비밀번호가 일치하지 않습니다.",
         data: null,
      },
   })
   @ApiUnauthorizedResponse({
      description: "UnAuthorized",
      example: {
         err: "토큰이 만료되었습니다. 다시 로그인해주세요. | 유효하지 않거나 손상된 토큰입니다. 다시 로그인해주세요.",
         data: null,
      },
   })
   @ApiForbiddenResponse({ description: "Forbidden", example: { err: "인증되지 않은 사용자입니다.", data: null } })
   @ApiNotFoundResponse({
      description: "Not Found",
      example: {
         err: "해당 유저를 찾을 수 없습니다.",
         data: null,
      },
   })
   @ApiPreconditionFailedResponse({
      description: "Precondition Failed",
      example: { err: "비밀번호를 재확인해야 합니다.", data: null },
   })
   @ApiInternalServerErrorResponse({
      description: "Internal Server Error",
      example: { err: "서버 오류입니다. 잠시 후 다시 이용해주세요.", data: null },
   })
   async updateMyPage(@Res({ passthrough: true }) res: Response, @Body() updateData: signInUserDto) {
      return await this.mypageService.updateMyPage(res, updateData);
   }
   // 회원 탈퇴
   @Put("/withdrawal")
   @ApiOperation({ summary: "회원 탈퇴 API" })
   @ApiResponse({
      status: 200,
      description: "회원 탈퇴 성공",
      example: { err: null, data: { message: "탈퇴되었습니다." } },
   })
   @ApiUnauthorizedResponse({
      description: "UnAuthorized",
      example: {
         err: "토큰이 만료되었습니다. 다시 로그인해주세요. | 유효하지 않거나 손상된 토큰입니다. 다시 로그인해주세요.",
         data: null,
      },
   })
   @ApiForbiddenResponse({ description: "Forbidden", example: { err: "인증되지 않은 사용자입니다.", data: null } })
   @ApiNotFoundResponse({
      description: "Not Found",
      example: {
         err: "해당 유저를 찾을 수 없습니다.",
         data: null,
      },
   })
   @ApiInternalServerErrorResponse({
      description: "Internal Server Error",
      example: { err: "서버 오류입니다. 잠시 후 다시 이용해주세요.", data: null },
   })
   async withdrawal(@Res({ passthrough: true }) res: Response) {
      return await this.mypageService.withdrawalUser(res);
   }
}
