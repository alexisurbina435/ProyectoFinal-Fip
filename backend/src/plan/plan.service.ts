import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan } from './entities/plan.entity';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
  ) {}

  async getAllPlans(): Promise<Plan[]> {
    return this.planRepository.find();
  }

  async getPlanById(id: number): Promise<Plan> {
    const plan = await this.planRepository.findOne({
      where: { id_plan: id },
    });
    if (!plan) {
      throw new NotFoundException(`Plan con id ${id} no encontrado`);
    }
    return plan;
  }

  async createPlan(createPlanDto: CreatePlanDto): Promise<Plan> {
    try {
      const plan = this.planRepository.create(createPlanDto);
      return await this.planRepository.save(plan);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updatePlan(id: number, updatePlanDto: UpdatePlanDto): Promise<Plan> {
    const result = await this.planRepository.update(
      { id_plan: id },
      updatePlanDto,
    );
    if (!result.affected) {
      throw new NotFoundException(`Plan con id ${id} no encontrado`);
    }
    return this.getPlanById(id);
  }

  async deletePlan(id: number): Promise<boolean> {
    const result = await this.planRepository.delete({ id_plan: id });
    if (!result.affected) {
      throw new NotFoundException(`Plan con id ${id} no encontrado`);
    }
    return true;
  }
}
