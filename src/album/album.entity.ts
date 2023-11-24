/* eslint-disable prettier/prettier */
import { PerformerEntity } from '../performer/performer.entity';
import { TrackEntity } from '../track/track.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AlbumEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  cover: string;

  @Column()
  releaseDate: Date;

  @OneToMany(() => TrackEntity, track => track.album)
  tracks: AlbumEntity[];

  @ManyToMany(() => PerformerEntity, (performer) => performer.albums)
  @JoinTable()
  performers: PerformerEntity[];
}
