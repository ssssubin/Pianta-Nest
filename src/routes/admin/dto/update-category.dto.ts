import { PartialType } from "@nestjs/mapped-types";
import { createCategoryDto } from "./create-category.dto";

export class updateCategoryDto extends PartialType(createCategoryDto) {}
