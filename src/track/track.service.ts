/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TrackEntity } from './track.entity';
import { InjectRepository } from '@nestjs/typeorm/dist';
import {
  BusinessLogicException,
  BusinessError,
} from '../shared/errors/business-errors';
@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(TrackEntity)
    private readonly TrackRepository: Repository<TrackEntity>,
  ) {}

  async findAll(): Promise<TrackEntity[]> {
    return await this.TrackRepository.find({});
  }

  async findOne(id: string): Promise<TrackEntity> {
    const Track: TrackEntity = await this.TrackRepository.findOne({
      where: { id },
    });

    if (!Track)
      throw new BusinessLogicException(
        'El Track con el id especificado no existe',
        BusinessError.NOT_FOUND,
      );

    return Track;
  }

  async create(track: TrackEntity): Promise<TrackEntity> {

    if (!track.album) {
      throw new Error('El álbum al que se va a asociar el track no existe.');
    }

    if (track.duration <= 0) {
      throw new Error('La duración del track debe ser un número positivo.');
    }

    return await this.TrackRepository.save(track);
  }
}
