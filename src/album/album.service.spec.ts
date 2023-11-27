/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AlbumEntity } from './album.entity';
import { AlbumService } from './album.service';
import { faker } from '@faker-js/faker';
import { BusinessLogicException } from '../shared/errors/business-errors';
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
      id: faker.string.uuid(),
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
      id: faker.string.uuid(),
    };

    await expect(
      service.create(albumWithEmptyDescription),
    ).rejects.toHaveProperty(
      'message',
      'La descripción del álbum es obligatoria.',
    );
  });

  //prueba findAll
  it('findAll debería retornar todas las Albums', async () => {
    const Albums: AlbumEntity[] = await service.findAll();
    expect(Albums).not.toBeNull();
    expect(Albums).toHaveLength(albumsList.length);
  });

  //prueba findOne
  it('findOne debería retornar una Album por su id', async () => {
    const storedAlbum: AlbumEntity = albumsList[0];
    const Album: AlbumEntity = await service.findOne(storedAlbum.id);
    expect(Album).not.toBeNull();
    expect(Album.id).toEqual(storedAlbum.id);
    expect(Album.name).toEqual(storedAlbum.name);
    expect(Album.description).toEqual(storedAlbum.description);
    expect(Album.cover).toEqual(storedAlbum.cover);
    expect(Album.releaseDate).toEqual(storedAlbum.releaseDate);
    expect(Album.tracks).toEqual(storedAlbum.tracks);
    expect(Album.performers).toEqual(storedAlbum.performers);
  });

  //prueba findOne: Album no existente
  it('findOne debería lanzar una excepción sobre el Album invalido', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'El Album con el id especificado no existe',
    );
  });

  //prueba delete
  it('delete debería eliminar un Album', async () => {
    const Album: AlbumEntity = albumsList[0];
    await service.delete(Album.id);
    const deletedAlbum: AlbumEntity = await repository.findOne({
      where: { id: Album.id },
    });
    expect(deletedAlbum).toBeNull();
  });

  //prueba delete - Album no existente
  it('delete debería lanzar una excepción por Album invalido', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'El álbum con el ID especificado no existe',
    );
  });
});
