/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AlbumEntity } from './album.entity';
import { InjectRepository } from '@nestjs/typeorm/dist';
import {
  BusinessLogicException,
  BusinessError,
} from '../shared/errors/business-errors';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(AlbumEntity)
    private readonly AlbumRepository: Repository<AlbumEntity>,
  ) {}

  async findAll(): Promise<AlbumEntity[]> {
    return await this.AlbumRepository.find({});
  }

  async findOne(id: string): Promise<AlbumEntity> {
    const Album: AlbumEntity = await this.AlbumRepository.findOne({
      where: { id },
    });

    if (!Album)
      throw new BusinessLogicException(
        'El Album con el id especificado no existe',
        BusinessError.NOT_FOUND,
      );

    return Album;
  }

  async create(album: AlbumEntity): Promise<AlbumEntity> {
    if (!album.name) {
      throw new Error('El nombre del álbum es obligatorio.');
    }

    if (!album.description) {
        throw new Error('La descripción del álbum es obligatoria.');
      }

    return await this.AlbumRepository.save(album);
  }

  async delete(id: string): Promise<AlbumEntity> {
    const album = await this.AlbumRepository.findOne({ where: { id }, relations: ['tracks'] });
  
    if (!album) {
      throw new BusinessLogicException('El álbum con el ID especificado no existe', BusinessError.NOT_FOUND);
    }
  
    if (album.tracks && album.tracks.length > 0) {
      throw new BusinessLogicException('No se puede eliminar el álbum porque tiene tracks asociados', BusinessError.INVALID_OPERATION);
    }
  
    return await this.AlbumRepository.remove(album);
  }
}
