import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumEntity } from './album.entity';
import { AlbumController } from './album.controller';


@Module({
  providers: [AlbumService],
  imports: [TypeOrmModule.forFeature([AlbumEntity])],
  controllers: [AlbumController]
})
export class AlbumModule {}
