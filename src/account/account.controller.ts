import { Body, Controller, Post, Req, Res } from "@nestjs/common";
import { createUserDto } from "src/account/dto/create-user.dto";
import { AccountService } from "./account.service";
import { Request, Response } from "express";
import { signInUserDto } from "src/account/dto/sign-in-user.dto";
import { signInGuestDto } from "./dto/sign-in-guest.dto";
import {
   ApiBadRequestResponse,
   ApiBody,
   ApiCookieAuth,
   ApiCreatedResponse,
   ApiForbiddenResponse,
   ApiInternalServerErrorResponse,
   ApiNotFoundResponse,
   ApiOperation,
   ApiResponse,
   ApiTags,
   ApiUnauthorizedResponse,
} from "@nestjs/swagger";

@ApiTags("회원가입/로그인")
@Controller()
export class AccountController {
   constructor(private readonly accountService: AccountService) {}

   // 회원가입
   @Post("sign-up")
   @ApiOperation({ summary: "회원가입 API" })
   @ApiCreatedResponse({
      description: "회원 생성",
      example: {
         err: null,
         data: {
            email: "test@test.com",
            name: "김철수",
            phoneNumber: "01012341234",
            address: ["12345", "서울시 광진구", "105동 201호"],
         },
      },
   })
   @ApiBadRequestResponse({
      description: "Bad Request",
      example: {
         err: "올바른 이메일 형식이 아닙니다. | 이메일은 빈 값이 아니어야 합니다. | 이메일은 문자열이어야 합니다. | 비밀번호는 8글자 이상이어야 합니다. | 비밀번호는 문자열이어야 합니다. | 비밀번호는 영문자, 숫자, 특수문자를 모두 포함하여야 합니다. | 주소는 빈 값이 아니어야 합니다. | 주소는 문자열이어야 합니다. | 올바르지 않은 전화번호입니다. | 이용 약관에 동의가 필요합니다.",
         data: null,
      },
   })
   @ApiInternalServerErrorResponse({ description: "Internal Server Error" })
   async signUp(@Body() userData: createUserDto) {
      return await this.accountService.createUser(userData);
   }

   // 이메일 중복 체크
   @Post("sign-up/check-email")
   @ApiOperation({ summary: "이메일 중복 체크 API" })
   @ApiBody({ schema: { example: { email: "string" } } })
   @ApiResponse({
      status: 200,
      description: "이메일 중복 체크 확인 완료",
      example: { err: null, data: { email: "test@test.com" } },
   })
   @ApiBadRequestResponse({
      description: "Bad Request",
      example: {
         err: "올바른 이메일 형식이 아닙니다. | 이메일은 빈 값이 아니어야 합니다. | 이메일은 문자열이어야 합니다. | 이미 존재하는 이메일입니다.",
         data: null,
      },
   })
   @ApiInternalServerErrorResponse({ description: "Internal Server Error" })
   async checkEmail(@Body() userData: signInUserDto) {
      return await this.accountService.checkEmail(userData.email);
   }

   // 회원 로그인
   @Post("sign-in")
   @ApiOperation({ summary: "회원 로그인 API" })
   @ApiBody({ schema: { example: { email: "string", password: "string" } } })
   @ApiResponse({
      status: 200,
      description: "로그인 성공",
      example: { err: null, data: { isAdmin: true, message: "로그인에 성공하셨습니다." } },
   })
   @ApiBadRequestResponse({
      description: "Bad Request",
      example: {
         err: "올바른 이메일 형식이 아닙니다. | 이메일은 빈 값이 아니어야 합니다. | 이메일은 문자열이어야 합니다. | 비밀번호는 8글자 이상이어야 합니다. | 비밀번호는 문자열이어야 합니다. | 비밀번호는 영문자, 숫자, 특수문자를 모두 포함하여야 합니다. | 이메일이나 비밀번호가 일치하지 않습니다.",
         data: null,
      },
   })
   @ApiInternalServerErrorResponse({ description: "Internal Server Error" })
   async signIn(@Res({ passthrough: true }) res: Response, @Body() userData: signInUserDto) {
      return await this.accountService.signIn(res, userData);
   }

   // 비회원 로그인
   @Post("guest/sign-in")
   @ApiOperation({ summary: "비회원 API" })
   @ApiBody({ schema: { example: { orderNumber: "number", password: "string" } } })
   @ApiResponse({
      status: 200,
      description: "로그인 성공",
      example: { err: null, data: { isAdmin: true, message: "로그인에 성공하셨습니다." } },
   })
   @ApiBadRequestResponse({
      description: "Bad Request",
      example: {
         err: "주문번호는 10자리 숫자여야합니다. | 비밀번호는 4자리 숫자이어야 합니다. | 주문번호나 비밀번호가 일치하지 않습니다.",
         data: null,
      },
   })
   @ApiInternalServerErrorResponse({ description: "Internal Server Error" })
   async guestSignIn(@Res({ passthrough: true }) res: Response, @Body() guestData: signInGuestDto) {
      return await this.accountService.guestSignIn(res, guestData);
   }

   @ApiCookieAuth("userCookies")
   @ApiTags("마이페이지 API")
   @Post("check-password")
   @ApiOperation({ summary: "비밀번호 재확인 API" })
   @ApiBody({ schema: { example: { password: "string" } } })
   @ApiResponse({
      status: 200,
      description: "비밀번호 재확인 성공",
      example: { err: null, data: { message: "비밀번호 재확인 완료되었습니다." } },
   })
   @ApiBadRequestResponse({
      description: "Bad Request",
      example: {
         err: "비밀번호는 8글자 이상이어야 합니다. | 비밀번호는 문자열이어야 합니다. | 비밀번호는 영문자, 숫자, 특수문자를 모두 포함하여야 합니다. | 비밀번호가 일치하지 않습니다. 비밀번호를 다시 입력해주세요.",
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
   @ApiNotFoundResponse({ description: "Not Found", example: { err: "사용자를 찾을 수 없습니다.", data: null } })
   @ApiInternalServerErrorResponse({ description: "Internal Server Error" })
   async checkPassword(@Res({ passthrough: true }) res: Response, @Body() password: { password: string }) {
      return await this.accountService.checkPassword(res, password.password);
   }

   // 로그아웃
   @ApiCookieAuth("guestCookies")
   @ApiCookieAuth("adminCookies")
   @ApiCookieAuth("userCookies")
   @Post("sign-out")
   @ApiOperation({ summary: "로그아웃 API" })
   @ApiResponse({
      status: 200,
      description: "로그아웃 성공",
      example: { err: null, data: "성공적으로 로그아웃 되었습니다." },
   })
   @ApiUnauthorizedResponse({
      description: "UnAuthorized",
      example: {
         err: "토큰이 만료되었습니다. 다시 로그인해주세요. | 유효하지 않거나 손상된 토큰입니다. 다시 로그인해주세요. | 로그인된 사용자가 아닙니다.",
         data: null,
      },
   })
   @ApiForbiddenResponse({ description: "Forbidden", example: { err: "인증되지 않은 사용자입니다.", data: null } })
   @ApiInternalServerErrorResponse({ description: "Internal Server Error" })
   async signOut(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
      return await this.accountService.signOut(req, res);
   }
}
