import { ForbiddenException, Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class IsAuthenticatedMiddleware implements NestMiddleware {
   constructor(private jwtService: JwtService) {}
   async use(req: Request, res: Response, next: NextFunction) {
      const { userCookies } = req.cookies;

      if (!userCookies) {
         throw new ForbiddenException("인증되지 않은 사용자입니다.");
      }

      let token = userCookies;
      const jwt = await this.jwtService.verifyAsync(token, { secret: process.env.USER_JWT_SECRET_KEY }).catch((e) => {
         if (e) {
            if (e.name === "TokenExpiredError") {
               res.clearCookie("userCookies");
               throw new UnauthorizedException("토큰이 만료되었습니다. 다시 로그인해주세요.");
            }

            if (e.name === "JsonWebTokenError") {
               res.clearCookie("userCookies");
               throw new UnauthorizedException("유효하지 않거나 손상된 토큰입니다. 다시 로그인해주세요.");
            }
         }
      });

      res.locals.user = jwt;
      next();
   }
}
