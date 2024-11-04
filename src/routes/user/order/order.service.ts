import {
   BadRequestException,
   ForbiddenException,
   Injectable,
   InternalServerErrorException,
   UnauthorizedException,
} from "@nestjs/common";
import { customAlphabet } from "nanoid";
import { MySqlService } from "src/data/my-sql/my-sql.service";
import { createGuestOrderDto } from "../dto/create-order.dto";
import * as bcrypt from "bcrypt";
import { createUserDto } from "../dto/create-user.dto";
import { orderState } from "./order-state";
import { JwtService } from "@nestjs/jwt";
import { Request, Response } from "express";

@Injectable()
export class OrderService {
   private readonly numbers = "123456789";
   private readonly nanoid = customAlphabet(this.numbers, 10);
   constructor(
      private mysqlService: MySqlService,
      private jwtService: JwtService,
   ) {}

   // 주문번호 생성
   generateRandomNumber() {
      return this.nanoid();
   }

   async verifyToken(res: Response, token, secretKey: string) {
      try {
         return this.jwtService.verify(token, { secret: secretKey });
      } catch (e: any) {
         if (e.name === "TokenExpiredError") {
            res.clearCookie("userCookies");
            throw new UnauthorizedException("토큰이 만료되었습니다. 다시 로그인해주세요.");
         }

         if (e.name === "JsonWebTokenError") {
            res.clearCookie("userCookies");
            throw new UnauthorizedException("유효하지 않거나 손상된 토큰입니다. 다시 로그인해주세요.");
         }
         throw e;
      }
   }

   async createOrder(res: Response, req: Request, data: createUserDto | createGuestOrderDto) {
      try {
         const { userCookies, adminCookies } = req.cookies;

         // 관리자인 경우
         if (adminCookies) {
            throw new ForbiddenException("접근 권한이 없습니다.");
         }

         // 비회원 정보일 경우
         if (data instanceof createGuestOrderDto) {
            const { email, name, password, confirmPassword, postNumber, address, detailAddress, phoneNumber } =
               data.guestInformation;
            const guestSql = `SELECT COUNT(*) as count FROM guest WHERE email = ?`;
            const guestParams = [email];
            const foundEmail = this.mysqlService.query(guestSql, guestParams);
            // 주문 작성 시 입력한 이메일이 회원 db에 존재하는 경우
            if (foundEmail[0].count !== 0) {
               throw new BadRequestException("이미 존재하는 이메일입니다.");
            }

            // 비밀번호 불일치 판단
            if (password !== confirmPassword) {
               throw new BadRequestException("비밀번호가 일치하지 않습니다.");
            }

            const hashPassword = await bcrypt.hash(password, 10);
            const newAddress = `${postNumber} ${address} ${detailAddress}`;
            const number = this.generateRandomNumber();
            const orderSql = `INSERT INTO orders(number, email, name, address, phone_number, products, order_state) VALUES(?,?,?,?,?,?,?)`;
            console.log(data.products);
            const orderParams = [number, email, name, newAddress, phoneNumber, ...data.products, orderState.COMPLETED];
            const registerGuestSql = "INSERT INTO VALUES(?,?,?,?,?)";
            const registerGuestParams = [number, email, name, hashPassword, phoneNumber];

            const err = await Promise.all([
               this.mysqlService.query(orderSql, orderParams),
               this.mysqlService.query(registerGuestSql, registerGuestParams),
            ]);

            // 주문 생성 및 비회원 생성 과정에서 오류가 발생했을 경우
            if (err.every((err) => err === undefined) === false) {
               throw new InternalServerErrorException(
                  "데이터를 등록하는 과정에서 오류가 발생했습니다. 잠시 후 다시 이용해주세요.",
               );
            }

            const guestToken = await this.jwtService.signAsync(
               { email, phoneNumber },
               { secret: process.env.GUEST_JWT_SECRET_KEY },
            );

            res.cookie("guestCookies", guestToken, { httpOnly: true });
            return { err: null, data: { orderNumber: number, message: "주문 완료되었습니다." } };
         }
      } catch (e) {
         throw e;
      }
   }
}
