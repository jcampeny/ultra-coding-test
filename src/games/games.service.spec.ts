import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';

import { GamesService } from './games.service';
import { Game } from './entities/game.entity';
import { GamesRepository } from './games.repository';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';

const createGameA: CreateGameDto = {
  title: 'God of wars 17',
  price: 78,
  publisher: 'Ultra Gaming',
  tags: ['god', 'of', 'wars'],
  releaseDate: '2022-01-25',
};

const updateGameA: UpdateGameDto = {
  price: 5,
};

const gameA: Game = {
  id: 'abc',
  ...createGameA,
};

const gameB: Game = {
  id: 'abc',
  title: 'FIFA 2028',
  price: 67,
  publisher: 'Ultra Gaming',
  tags: ['football', 'fifa', '2028'],
  releaseDate: '2022-01-27',
};

const allGames: Game[] = [gameA, gameB];

describe('GamesService', () => {
  let service: GamesService;
  let repository: Repository<Game>;

  function findOrFailShouldReject(r: GamesRepository) {
    r.findOneOrFail = jest.fn().mockImplementation(() => {
      throw new Error();
    });
  }

  async function expectToThrowNotFound(
    onServiceCall: () => void,
  ): Promise<void> {
    await expect(onServiceCall).rejects.toThrow(
      new HttpException('Not found', HttpStatus.NOT_FOUND),
    );
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GamesService,
        {
          provide: GamesRepository,
          useValue: {
            save: jest.fn().mockImplementation(() => Promise.resolve(gameA)),
            find: jest.fn().mockImplementation(() => Promise.resolve(allGames)),
            findOneOrFail: jest
              .fn()
              .mockImplementation(() => Promise.resolve(gameA)),
            delete: jest.fn().mockImplementation(),
          },
        },
      ],
    }).compile();

    service = module.get<GamesService>(GamesService);
    repository = module.get<GamesRepository>(GamesRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should new game', async () => {
      expect(await service.create(createGameA)).toBe(gameA);
      expect(repository.save).toHaveBeenCalledWith(createGameA);
    });
  });

  describe('findAll', () => {
    it('should return an array of games', async () => {
      expect(await service.findAll()).toBe(allGames);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should find a game', async () => {
      expect(await service.findOne(gameA.id)).toBe(gameA);
      expect(repository.findOneOrFail).toHaveBeenCalledWith(gameA.id);
    });

    it('should throw an error when game does not found', async () => {
      findOrFailShouldReject(repository);

      await expectToThrowNotFound(() => service.findOne('whatever-id'));
    });
  });

  describe('update', () => {
    it('should update a game', async () => {
      expect(await service.update(gameA.id, updateGameA)).toBe(gameA);
      expect(repository.findOneOrFail).toHaveBeenCalledWith(gameA.id);
      expect(repository.save).toHaveBeenCalledWith({
        ...gameA,
        ...updateGameA,
      });
    });

    it('should throw an error when game does not found', async () => {
      findOrFailShouldReject(repository);

      await expectToThrowNotFound(() =>
        service.update('whatever-id', updateGameA),
      );
    });
  });

  describe('remove', () => {
    it('should remove an existing game', async () => {
      await service.remove(gameA.id);

      expect(repository.delete).toHaveBeenCalledWith(gameA.id);
    });

    it('should throw an error when game does not found', async () => {
      findOrFailShouldReject(repository);

      await expectToThrowNotFound(() => service.remove('whatever-id'));
    });
  });
});
