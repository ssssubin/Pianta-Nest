import { PartialType } from "@nestjs/swagger";
import { createSubCategoryDto } from "./create-sub-category.dto";

export class updateSubCategoryDto extends PartialType(createSubCategoryDto) {}
