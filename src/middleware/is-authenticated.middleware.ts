import { ForbiddenException, Injectable, NestMiddleware } from "@nestjs/common";
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
      const jwt = await this.jwtService.verifyAsync(token, { secret: process.env.USER_JWT_SECRET_KEY });
      res.locals.user = jwt;
      next();
   }
}
