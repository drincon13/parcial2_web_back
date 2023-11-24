/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AlbumEntity } from './album.entity';
import { AlbumService } from './album.service';
import { faker } from '@faker-js/faker';
import { BusinessLogicException } from '../shared/errors/business-errors';
;

describe('AlbumService', () => {
  let service: AlbumService;
  let repository: Repository<AlbumEntity>;
  let albumsList: AlbumEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AlbumService],
    }).compile();

    service = module.get<AlbumService>(AlbumService);
    repository = module.get<Repository<AlbumEntity>>(
      getRepositoryToken(AlbumEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    albumsList = [];
    for (let i = 0; i < 5; i++) {
      const album: AlbumEntity = await repository.save({
        name: faker.lorem.sentence(),
        cover: faker.lorem.sentence(),
        releaseDate: faker.date.past(),
        description: faker.lorem.sentence(),
      });
      albumsList.push(album);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create deberia retornar un album', async () => {
    const album: AlbumEntity = {
      id: faker.datatype.uuid(),
      name: faker.lorem.sentence(),
      cover: faker.lorem.sentence(),
      releaseDate: faker.date.past(),
      description: faker.lorem.sentence(),
      performers: [],
      tracks: [],
    };

    const newAlbum: AlbumEntity = await service.create(album);
    expect(newAlbum).not.toBeNull();

    const storedAlbum: AlbumEntity = await repository.findOne({
      where: { id: newAlbum.id },
    });
    expect(album.name).toEqual(storedAlbum.name);
    expect(album.cover).toEqual(storedAlbum.cover);
    expect(album.releaseDate).toEqual(storedAlbum.releaseDate);
    expect(album.description).toEqual(storedAlbum.description);
  });

  it('create debería lanzar una excepción con la descripción vacía', async () => {
    const albumWithEmptyDescription: AlbumEntity = {
      name: faker.lorem.sentence(),
      cover: faker.lorem.sentence(),
      releaseDate: faker.date.past(),
      description: '',
      performers: [],
      tracks: [],
      id: faker.datatype.uuid(),
    };

    await expect(service.create(albumWithEmptyDescription)).rejects.toHaveProperty("message", "La descripción no debería estar vacía.");
  });
});