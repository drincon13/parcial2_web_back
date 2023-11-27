/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { PerformerEntity } from './performer.entity';
import { PerformerService } from './performer.service';
import { faker } from '@faker-js/faker';
import { BusinessLogicException } from '../shared/errors/business-errors';

describe('PerformerService', () => {
  let service: PerformerService;
  let repository: Repository<PerformerEntity>;
  let performersList: PerformerEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PerformerService],
    }).compile();

    service = module.get<PerformerService>(PerformerService);
    repository = module.get<Repository<PerformerEntity>>(
      getRepositoryToken(PerformerEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    performersList = [];
    for(let i = 0; i < 5; i++){
        const Performer: PerformerEntity = await repository.save({
        name: faker.company.name(),
        description: faker.lorem.sentence(),
        image: faker.lorem.sentence(),
        albums: undefined})
        performersList.push(Performer);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create deberia retornar un Performer', async () => {
    const Performer: PerformerEntity = {
      id: faker.string.uuid(),
      name: faker.lorem.sentence(),
      description: faker.lorem.sentence(),
      image: faker.lorem.sentence(),
      albums: undefined,
    };

    const newPerformer: PerformerEntity = await service.create(Performer);
    expect(newPerformer).not.toBeNull();

    const storedPerformer: PerformerEntity = await repository.findOne({
      where: { id: newPerformer.id },
    });
    expect(Performer.name).toEqual(storedPerformer.name);
    expect(Performer.description).toEqual(storedPerformer.description);
    expect(Performer.image).toEqual(storedPerformer.image);
    expect(Performer.albums).toEqual(storedPerformer.albums);
  });

  it('La descripción del performer debe tener como máximo 100 caracteres.', async () => {
    const PerformerWithEmptyDescription: PerformerEntity = {
      name: faker.lorem.sentence(),
      description: faker.lorem.words(101),
      image: faker.lorem.sentence(),
      albums: [],
      id: faker.string.uuid(),
    };

    await expect(
      service.create(PerformerWithEmptyDescription),
    ).rejects.toHaveProperty(
      'message',
      'La descripción del performer debe tener como máximo 100 caracteres.',
    );
  });

  //prueba findAll
  it('findAll debería retornar todas las Performers', async () => {
    const Performers: PerformerEntity[] = await service.findAll();
    expect(Performers).not.toBeNull();
    expect(Performers).toHaveLength(performersList.length);
  });

  //prueba findOne
  it('findOne debería retornar una Performer por su id', async () => {
    const storedPerformer: PerformerEntity = performersList[0];
    const Performer: PerformerEntity = await service.findOne(storedPerformer.id);
    expect(Performer).not.toBeNull();
    expect(Performer.id).toEqual(storedPerformer.id);
    expect(Performer.name).toEqual(storedPerformer.name);
    expect(Performer.description).toEqual(storedPerformer.description);
    expect(Performer.image).toEqual(storedPerformer.image);
    expect(Performer.albums).toEqual(storedPerformer.albums)
  });

  //prueba findOne: Performer no existente
  it('findOne debería lanzar una excepción sobre el Performer invalido', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'El Performer con el id especificado no existe',
    );
  });
});