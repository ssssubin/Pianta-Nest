import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { customAlphabet } from "nanoid";
import { MySqlService } from "src/data/my-sql/my-sql.service";
import { createGuestOrderDto, createUserOrderDto } from "../dto/create-order.dto";
import * as bcrypt from "bcrypt";
import { orderState } from "./order-state";
import { JwtService } from "@nestjs/jwt";
import { Request, Response } from "express";
import * as nodemailer from "nodemailer";

@Injectable()
export class OrderService {
   private readonly numbers = "123456789";
   private readonly nanoid = customAlphabet(this.numbers, 10);
   private transport;

   constructor(
      private mysqlService: MySqlService,
      private jwtService: JwtService,
   ) {
      this.transport = nodemailer.createTransport({
         host: "smtp.gmail.com",
         port: 587,
         auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
         },
      });
   }

   // 주문번호 생성
   generateRandomNumber() {
      return this.nanoid();
   }

   // 비회원 주문 dto인지 확인
   isCreatedGuestOrderDto(obj: any) {
      // 유저 정보에 비밀번호 없으면 회원
      return obj.password === undefined ? false : true;
   }

   // 토큰 확인
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

   // 주문 생성 api(비회원)
   async createGuestOrder(res: Response, req: Request, data: createGuestOrderDto) {
      try {
         const { adminCookies } = req.cookies;
         // 관리자인 경우
         if (adminCookies) {
            throw new ForbiddenException("접근 권한이 없습니다.");
         }

         const { email, name, postNumber, address, detailAddress, phoneNumber, password, confirmPassword } =
            data.information;
         const guestSql = `SELECT COUNT(*) as count FROM users WHERE email = ?`;
         const guestParams = [email];
         const foundEmail = await this.mysqlService.query(guestSql, guestParams);

         // 주문 작성 시 입력한 이메일이 회원 db에 존재하는 경우
         if (foundEmail[0].count !== 0) {
            throw new BadRequestException("이미 가입된 회원입니다. 로그인 후 사용해주세요.");
         }

         // 비밀번호 불일치 판단
         if (password !== confirmPassword) {
            throw new BadRequestException("비밀번호가 일치하지 않습니다.");
         }

         const hashPassword = await bcrypt.hash(password, 10);
         const newAddress = `${postNumber} ${address} ${detailAddress}`;
         const number = this.generateRandomNumber();
         const orderSql = `INSERT INTO orders(number, email, name, address, phone_number, products, order_state) VALUES(?,?,?,?,?,?,?)`;

         const orderParams = [number, email, name, newAddress, phoneNumber, data.products, orderState.COMPLETED];
         const registerGuestSql = "INSERT INTO guests VALUES(?,?,?,?,?)";
         const registerGuestParams = [number, email, name, hashPassword, phoneNumber];

         // 주문서 db 저장 및 비회원 db 등록
         await Promise.all([
            this.mysqlService.query(orderSql, orderParams),
            this.mysqlService.query(registerGuestSql, registerGuestParams),
         ]);

         await this.transport.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: `[Pianta] ${name}님에게 보내는 주문번호`,
            text: `회원님의 주문번호는 ${number}입니다.`,
         });

         const guestToken = await this.jwtService.signAsync(
            { email, phoneNumber },
            { secret: process.env.GUEST_JWT_SECRET_KEY },
         );

         res.cookie("guestCookies", guestToken, { httpOnly: true });
         return { err: null, data: { orderNumber: number, message: "주문 완료되었습니다." } };
      } catch (e) {
         throw e;
      }
   }

   // 주문 생성 api(회원)
   async createUserOrder(res: Response, req: Request, data: createUserOrderDto) {
      try {
         const { userCookies, adminCookies } = req.cookies;
         // 관리자인 경우
         if (adminCookies) {
            throw new ForbiddenException("접근 권한이 없습니다.");
         }

         // 유저 쿠키 검증
         const decoded = await this.verifyToken(res, userCookies, process.env.USER_JWT_SECRET_KEY);
         const { email, name, postNumber, address, detailAddress, phoneNumber } = data.information;
         // 로그인한 이메일과 주문 정보에 입력된 이메일이 다른 경우
         if (decoded.email !== email) {
            throw new BadRequestException("가입한 이메일로만 주문이 가능합니다.");
         }

         const orderNumber = this.generateRandomNumber();
         const newAddress = `${postNumber} ${address} ${detailAddress}`;
         const userOrderSql = `INSERT INTO orders(number, email, name, address, phone_number, products, order_state) VALUES(?,?,?,?,?,?,?)`;
         const userOrderParams = [
            orderNumber,
            email,
            name,
            newAddress,
            phoneNumber,
            data.products,
            orderState.COMPLETED,
         ];
         await this.mysqlService.query(userOrderSql, userOrderParams);

         return { err: null, data: { orderNumber, message: "주문 완료되었습니다." } };
      } catch (e) {
         throw e;
      }
   }

   // 주문 조회
   async getOrders(res: Response, req: Request) {
      try {
         const { guestCookies, userCookies, adminCookies } = req.cookies;
         // 관리자인 경우
         if (adminCookies) {
            throw new ForbiddenException("접근 권한이 없습니다.");
         }

         const decoded = guestCookies
            ? await this.verifyToken(res, guestCookies, process.env.GUEST_JWT_SECRET_KEY)
            : await this.verifyToken(res, userCookies, process.env.USER_JWT_SECRET_KEY);

         const orderSql = `SELECT * FROM orders WHERE email = ?`;
         const orderParams = [decoded.email];
         const foundOrder = await this.mysqlService.query(orderSql, orderParams);
         if (foundOrder[0] === undefined) {
            return { err: null, data: { message: "주문 내역이 존재하지 않습니다." } };
         }

         return { err: null, data: foundOrder };
      } catch (e) {
         throw e;
      }
   }
}
