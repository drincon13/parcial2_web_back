import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlbumModule } from './album/album.module';
import { TrackModule } from './track/track.module';
import { PerformerModule } from './performer/performer.module';
import { PerformerAlbumModule } from './performer-album/performer-album.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumEntity } from './album/album.entity';
import { TrackEntity } from './track/track.entity';
import { PerformerEntity } from './performer/performer.entity';

@Module({
  imports: [AlbumModule, TrackModule, PerformerModule, PerformerAlbumModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Dalerica1',
      database: 'Album',
      entities: [
        AlbumEntity,
        TrackEntity,
        PerformerEntity
      ],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
