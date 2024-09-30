import { Body, Controller, Post } from "@nestjs/common";
import { createUserDto } from "src/dto/create-user.dto";
import { AccountService } from "./account.service";

@Controller()
export class AccountController {
   constructor(private readonly accountService: AccountService) {}

   @Post("sign-up")
   async signUp(@Body() userData: createUserDto) {
      return await this.accountService.createUser(userData);
   }
}
