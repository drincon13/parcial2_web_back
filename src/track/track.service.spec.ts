/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { TrackEntity } from './track.entity';
import { TrackService } from './track.service';
import { faker } from '@faker-js/faker';
import { BusinessLogicException } from '../shared/errors/business-errors';

describe('TrackService', () => {
  let service: TrackService;
  let repository: Repository<TrackEntity>;
  let TracksList: TrackEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TrackService],
    }).compile();

    service = module.get<TrackService>(TrackService);
    repository = module.get<Repository<TrackEntity>>(
      getRepositoryToken(TrackEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    TracksList = [];

    for (let i = 0; i < 5; i++) {
      const Track: TrackEntity = await repository.save({
        name: faker.company.name(),
        duration: faker.number.int(),
        album: undefined,
      });
      TracksList.push(Track);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create deberia retornar un Track', async () => {
    const Track: TrackEntity = {
      id: faker.string.uuid(),
      name: faker.lorem.sentence(),
      duration: faker.number.int(),
      album: undefined,
    };

    const newTrack: TrackEntity = await service.create(Track);
    expect(newTrack).not.toBeNull();

    const storedTrack: TrackEntity = await repository.findOne({
      where: { id: newTrack.id },
    });
    expect(Track.name).toEqual(storedTrack.name);
    expect(Track.duration).toEqual(storedTrack.duration);
  });

  it('La duración del track debe ser un número positivo.', async () => {
    const TrackWithEmptyDescription: TrackEntity = {
      name: faker.lorem.sentence(),
      duration: -1,
      album: undefined,
      id: faker.string.uuid(),
    };

    await expect(
      service.create(TrackWithEmptyDescription),
    ).rejects.toHaveProperty(
      'message',
      'La duración del track debe ser un número positivo.',
    );
  });

  //prueba findAll
  it('findAll debería retornar todas las Tracks', async () => {
    const Tracks: TrackEntity[] = await service.findAll();
    expect(Tracks).not.toBeNull();
    expect(Tracks).toHaveLength(TracksList.length);
  });

  //prueba findOne
  it('findOne debería retornar una Track por su id', async () => {
    const storedTrack: TrackEntity = TracksList[0];
    const Track: TrackEntity = await service.findOne(storedTrack.id);
    expect(Track).not.toBeNull();
    expect(Track.id).toEqual(storedTrack.id);
    expect(Track.name).toEqual(storedTrack.name);
    expect(Track.duration).toEqual(storedTrack.duration);
    expect(Track.album).toEqual(storedTrack.album);
  });

  //prueba findOne: Track no existente
  it('findOne debería lanzar una excepción sobre el Track invalido', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'El Track con el id especificado no existe',
    );
  });
});
