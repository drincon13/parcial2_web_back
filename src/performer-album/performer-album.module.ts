import { Module } from '@nestjs/common';
import { PerformerAlbumService } from './performer-album.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerformerEntity } from 'src/performer/performer.entity';
import { AlbumEntity } from 'src/album/album.entity';

@Module({
  providers: [PerformerAlbumService],
  imports: [TypeOrmModule.forFeature([PerformerEntity, AlbumEntity])]
})
export class PerformerAlbumModule {}
