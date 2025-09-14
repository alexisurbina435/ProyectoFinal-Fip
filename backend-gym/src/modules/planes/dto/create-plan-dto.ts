/* eslint-disable prettier/prettier */
import { IsIn, IsNumber, IsOptional, IsString, Min } from "class-validator"
import { PlanType } from "src/entities/plan.entity"

export class CreatePlanDto {
 @IsIn( [PlanType.BASIC, PlanType.PREMIUM, PlanType.STANDARD] )
  type: PlanType;
  
  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(1)
  duracionEnDias: number;
}