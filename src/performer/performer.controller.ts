import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { PerformerService } from './performer.service';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { PerformerEntity } from './performer.entity';
import { PerformerDto } from './performer.dto';
import { plainToInstance } from 'class-transformer';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('performers')
export class PerformerController {
  constructor(private readonly PerformerService: PerformerService) {}

  @Get()
  async findAll() {
    return await this.PerformerService.findAll();
  }

  @Get(':PerformerId')
  async findOne(@Param('PerformerId') PerformerId: string) {
    return await this.PerformerService.findOne(PerformerId);
  }

  @Post()
  async create(@Body() performerDto: PerformerDto) {
    const Performer: PerformerEntity = plainToInstance(
      PerformerEntity,
      performerDto,
    );
    return await this.PerformerService.create(Performer);
  }
}
