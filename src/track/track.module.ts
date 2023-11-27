import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackEntity } from './track.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackController } from './track.controller';

@Module({
  providers: [TrackService],
  imports: [TypeOrmModule.forFeature([TrackEntity])],
  controllers: [TrackController]
})
export class TrackModule {}
