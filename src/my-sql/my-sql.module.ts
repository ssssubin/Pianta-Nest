import { Module } from "@nestjs/common";
import { MySqlService } from "./my-sql.service";
import { MySqlController } from './my-sql.controller';

@Module({
   providers: [MySqlService],
   exports: [MySqlService],
   controllers: [MySqlController],
})
export class MySqlModule {}
