import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AlbumEntity } from '../album/album.entity';
import { PerformerEntity } from '../performer/performer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class PerformerAlbumService {
  constructor(
    @InjectRepository(AlbumEntity)
    private readonly albumRepository: Repository<AlbumEntity>,
    @InjectRepository(PerformerEntity)
    private readonly performerRepository: Repository<PerformerEntity>,
  ) {}

  async addPerformerToAlbum(albumId: string, performerId: string): Promise<AlbumEntity> {
    const performer: PerformerEntity = await this.performerRepository.findOne({ where: { id: performerId } });
    if (!performer) {
      throw new BusinessLogicException('El performer con el ID especificado no existe', BusinessError.NOT_FOUND);
    }
  
    const album: AlbumEntity = await this.albumRepository.findOne({ where: { id: albumId }, relations: ['performers'] });
    if (!album) {
      throw new BusinessLogicException('El álbum con el ID especificado no existe', BusinessError.NOT_FOUND);
    }
  
    if (album.performers && album.performers.length >= 3) {
      throw new BusinessLogicException('El álbum ya tiene el máximo número de performers asociados', BusinessError.INVALID_OPERATION);
    }
  
    const performerExistsInAlbum = album.performers.some((p) => p.id === performerId);
    if (performerExistsInAlbum) {
      throw new BusinessLogicException('El performer ya está asociado a este álbum', BusinessError.INVALID_OPERATION);
    }
  
    album.performers = [...album.performers, performer];
  
    return await this.albumRepository.save(album);

  }
  
}

