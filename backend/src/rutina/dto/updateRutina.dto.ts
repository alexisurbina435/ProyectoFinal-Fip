import { PartialType } from "@nestjs/mapped-types";
import { CreateRutinaDto } from "./crateRutina.dto";

export class UpdateRutinaDto extends PartialType(CreateRutinaDto){}