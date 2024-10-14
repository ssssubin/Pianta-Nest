import { ForbiddenException, Injectable, NestMiddleware } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class IsAuthenticatedAdminMiddleware implements NestMiddleware {
   constructor(private jwtService: JwtService) {}
   async use(req: Request, res: Response, next: NextFunction) {
      const { adminCookies } = req.cookies;
      if (!adminCookies) {
         throw new ForbiddenException("관리자가 아닙니다.");
      }
      let token = adminCookies;
      const jwt = await this.jwtService.verify(token, { secret: process.env.USER_JWT_SECRET_KEY });
      console.log(jwt);
      next();
   }
}
