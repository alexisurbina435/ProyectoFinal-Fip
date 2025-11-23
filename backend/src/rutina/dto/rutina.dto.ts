import { PartialType } from "@nestjs/mapped-types";
import { CreateRutinaDto } from "./crateRutina.dto";

export class RutinaDto extends PartialType(CreateRutinaDto){}