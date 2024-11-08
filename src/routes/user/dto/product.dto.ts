import { PickType } from "@nestjs/swagger";
import { createProductDto } from "src/routes/admin/dto/create-product.dto";

export class productDto extends PickType(createProductDto, ["name", "price"] as const) {}
