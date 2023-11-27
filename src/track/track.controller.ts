import { Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Post,
    UseInterceptors, } from '@nestjs/common';
import { TrackService } from './track.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { TrackEntity } from './track.entity';
import { plainToInstance } from 'class-transformer';
import { TrackDto } from './track.dto';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('tracks')
export class TrackController {

    constructor(private readonly TrackService: TrackService) {}

    @Get()
  async findAll() {
    return await this.TrackService.findAll();
  }

  @Get(':TrackId')
  async findOne(@Param('TrackId') TrackId: string) {
    return await this.TrackService.findOne(TrackId);
  }

  @Post()
  async create(@Body() trackDto: TrackDto) {
    const track: TrackEntity = plainToInstance(TrackEntity, trackDto);
    return await this.TrackService.create(track);
  }

}
