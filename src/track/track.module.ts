import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackEntity } from './track.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [TrackService],
  imports: [TypeOrmModule.forFeature([TrackEntity])]
})
export class TrackModule {}
