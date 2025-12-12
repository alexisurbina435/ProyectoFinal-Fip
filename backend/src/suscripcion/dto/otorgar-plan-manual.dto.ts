import { IsInt, IsPositive, IsOptional, Min } from 'class-validator';

export class OtorgarPlanManualDto {
  @IsInt()
  @IsPositive()
  id_usuario: number;

  @IsInt()
  @IsPositive()
  id_plan: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  @Min(1)
  mesesContratados?: number;
}
