import { Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { ArgumentsHost } from "@nestjs/common/interfaces";
import { Response } from "express";

@Catch()
export class httpExceptionFilter implements ExceptionFilter {
   private readonly logger = new Logger(httpExceptionFilter.name);
   catch(exception: unknown, host: ArgumentsHost) {
      const ctx = host.switchToHttp(); // HTTP 응답 및 요청 가져오도록 전환
      const res = ctx.getResponse<Response>(); // Express의 response 가져옴

      // exception이 HTTPException인 경우 status 코드 가져옴
      // 아닐 경우 500
      const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

      // 서버 내부 오류인 경우
      if (status === 500) {
         const stackTrace = exception instanceof Error ? exception.stack.split("\n") : ["No available"];
         this.logger.error({
            err: exception instanceof HttpException ? exception.getResponse() : "Non HttpExcpetion",
            stack: stackTrace,
         });
      }

      const errResponse =
         exception instanceof HttpException ? exception.getResponse() : "서버 오류입니다. 잠시 후 다시 이용해주세요.";

      // 에러메시지 타입이 object인 경우 message만 가져옴
      const err = typeof errResponse === "object" ? (errResponse as any).message : errResponse;
      // 상태 코드, 에러 메시지 보냄
      res.status(status).json({ err, data: null });
   }
}
