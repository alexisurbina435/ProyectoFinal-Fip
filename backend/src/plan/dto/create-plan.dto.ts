import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export type PlanNombre = 'basic' | 'standard' | 'premium';

const PLAN_NOMBRE_VALUES: readonly PlanNombre[] = [
  'basic',
  'standard',
  'premium',
] as const;

export class CreatePlanDto {
  @IsIn(PLAN_NOMBRE_VALUES)
  nombre: PlanNombre;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  precio: number;

  @IsOptional()
  @IsString()
  descripcion?: string | null;
}