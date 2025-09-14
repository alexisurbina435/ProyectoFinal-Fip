/* eslint-disable prettier/prettier */
import { PlanType } from "src/entities/plan.entity";

export class UpdatePlanDto {
  type?: PlanType;
  price?: number;
  description?: string;
  duracionEnDias?: number;
}