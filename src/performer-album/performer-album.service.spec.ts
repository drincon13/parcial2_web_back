/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { PerformerEntity } from '../performer/Performer.entity';
import { Repository } from 'typeorm';
import { PerformerAlbumService } from './Performer-Album.service';
import { AlbumEntity } from '../album/Album.entity';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('PerformerAlbumService', () => {
  let service: PerformerAlbumService;
  let PerformerRepository: Repository<PerformerEntity>;
  let AlbumRepository: Repository<AlbumEntity>;
  let Album: AlbumEntity;
  let PerformersList: PerformerEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PerformerAlbumService],
    }).compile();

    service = module.get<PerformerAlbumService>(PerformerAlbumService);

    PerformerRepository = module.get<Repository<PerformerEntity>>(
      getRepositoryToken(PerformerEntity),
    );

    AlbumRepository = module.get<Repository<AlbumEntity>>(
      getRepositoryToken(AlbumEntity),
    );

    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //poblar db
  const seedDatabase = async () => {
    PerformerRepository.clear();
    AlbumRepository.clear();

    PerformersList = [];
    for (let i = 0; i < 5; i++) {
      const performer: PerformerEntity = await PerformerRepository.save({
        id: faker.string.uuid(),
        name: faker.lorem.sentence(),       
        image: faker.lorem.sentence(),
        description: faker.lorem.sentence(),
        albums: undefined,
      });
      PerformersList.push(performer);
    }

    Album = await AlbumRepository.save({
      id: faker.string.uuid(),
      name: faker.lorem.sentence(),
      cover: faker.lorem.sentence(),
      releaseDate: faker.date.recent(),
      description: faker.lorem.sentence(),
      performers: undefined,
      tracks: undefined,
    });
  };

  //prueba de addAlbumPerformer
  it('addPerformerAlbum debería agregar un performer a un Album', async () => {
    const newPerformer: PerformerEntity = await PerformerRepository.save({
      id: faker.string.uuid(),
      name: faker.lorem.sentence(),
      description: faker.lorem.sentence(),
      image: faker.lorem.sentence(),
      albums: undefined,
    });

    const newAlbum: AlbumEntity = await AlbumRepository.save({
      id: faker.string.uuid(),
      name: faker.lorem.sentence(),
      cover: faker.lorem.sentence(),
      releaseDate: faker.date.recent(),
      description: faker.lorem.sentence(),
      performers: undefined,
      tracks: undefined,
    });


    const result: AlbumEntity = await service.addPerformerToAlbum(
      newAlbum.id,
      newPerformer.id,
    );

    expect(result.performers.length).toBe(1);
    expect(result.performers[0]).not.toBeNull();
    expect(result.performers[0].name).toBe(newPerformer.name);
    expect(result.performers[0].image).toBe(newPerformer.image);
  });

  // prueba Performer to album
  it('addPerformerToAlbum debería lanzar una excepción por Performer invalido', async () => {
    const newPerformer: PerformerEntity = await PerformerRepository.save({
      id: faker.string.uuid(),
      name: faker.lorem.sentence(),
      description: faker.lorem.sentence(),
      image: faker.lorem.sentence(),
      albums: undefined,
    });

    await expect(() =>
      service.addPerformerToAlbum('0', newPerformer.id),
    ).rejects.toHaveProperty(
      'message',
      'El álbum con el ID especificado no existe',
    );
  });
});
