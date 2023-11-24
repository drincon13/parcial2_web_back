/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PerformerEntity } from './performer.entity';
import { InjectRepository } from '@nestjs/typeorm/dist';
import {
  BusinessLogicException,
  BusinessError,
} from '../shared/errors/business-errors';

@Injectable()
export class PerformerService {
  AlbumRepository: any;
  constructor(
    @InjectRepository(PerformerEntity)
    private readonly PerformerRepository: Repository<PerformerEntity>,
  ) {}

  async findAll(): Promise<PerformerEntity[]> {
    return await this.PerformerRepository.find({});
  }

  async findOne(id: string): Promise<PerformerEntity> {
    const Performer: PerformerEntity = await this.PerformerRepository.findOne({
      where: { id },
    });

    if (!Performer)
      throw new BusinessLogicException(
        'El Performer con el id especificado no existe',
        BusinessError.NOT_FOUND,
      );

    return Performer;
  }

  async create(performer: PerformerEntity): Promise<PerformerEntity> {
    if (performer.description && performer.description.length > 100) {
      throw new Error('La descripción del performer debe tener como máximo 100 caracteres.');
    }
  
    return await this.PerformerRepository.save(performer);
  }
  
}
