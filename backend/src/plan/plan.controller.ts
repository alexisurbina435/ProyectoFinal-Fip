import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Post,
  Patch,
} from '@nestjs/common';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { Plan } from './entities/plan.entity';

@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Get()
  async getAllPlans(): Promise<Plan[]> {
    return this.planService.getAllPlans();
  }

  @Get(':id')
  async getPlanById(@Param('id', ParseIntPipe) id: number): Promise<Plan> {
    return this.planService.getPlanById(id);
  }

  @Post()
  async createPlan(@Body() createPlanDto: CreatePlanDto): Promise<Plan> {
    try {
      return await this.planService.createPlan(createPlanDto);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Patch(':id')
  async updatePlan(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePlanDto: UpdatePlanDto,
  ): Promise<Plan> {
    return this.planService.updatePlan(id, updatePlanDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePlan(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.planService.deletePlan(id);
  }
}
