/* eslint-disable prettier/prettier */
import { AlbumEntity } from '../album/Album.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PerformerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  image: string;

  @ManyToMany(() => AlbumEntity, (album) => album.performers)
  @JoinTable()
  albums: AlbumEntity[];
}
