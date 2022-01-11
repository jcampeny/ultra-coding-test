import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';

import { GamesService } from './games.service';
import { Game } from './entities/game.entity';
import { GamesRepository } from './games.repository';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Publisher } from '../publishers/entities/publisher.entity';
import { PublishersRepository } from '../publishers/publishers.repository';

const publisher: Publisher = {
  id: 'abc',
  name: 'Ultra Gaming',
  siret: 123,
  phone: '1234',
};

const createGameA: CreateGameDto = {
  title: 'God of wars 17',
  price: 78,
  publisherId: publisher.id,
  tags: ['god', 'of', 'wars'],
  releaseDate: '2022-01-25',
};

const updateGameA: UpdateGameDto = {
  price: 5,
};

const gameA: Game = {
  id: 'abc',
  publisher,
  ...createGameA,
};

const gameB: Game = {
  id: 'abc',
  title: 'FIFA 2028',
  price: 67,
  publisher,
  tags: ['football', 'fifa', '2028'],
  releaseDate: '2022-01-27',
};

const allGames: Game[] = [gameA, gameB];

describe('GamesService', () => {
  let service: GamesService;
  let gamesRepository: GamesRepository;
  let publishersRepository: PublishersRepository;

  function findOrFailShouldReject(r: Repository<any>) {
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
            createGame: jest
              .fn()
              .mockImplementation(() => Promise.resolve(gameA)),
            find: jest.fn().mockImplementation(() => Promise.resolve(allGames)),
            findOneOrFail: jest
              .fn()
              .mockImplementation(() => Promise.resolve(gameA)),
            save: jest.fn().mockImplementation(() => Promise.resolve(gameA)),
            delete: jest.fn().mockImplementation(),
          },
        },
        {
          provide: PublishersRepository,
          useValue: {
            findOneOrFail: jest
              .fn()
              .mockImplementation(() => Promise.resolve(publisher)),
          },
        },
      ],
    }).compile();

    service = module.get<GamesService>(GamesService);
    gamesRepository = module.get<GamesRepository>(GamesRepository);
    publishersRepository =
      module.get<PublishersRepository>(PublishersRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create new game', async () => {
      expect(await service.create(createGameA)).toBe(gameA);
      expect(gamesRepository.createGame).toHaveBeenCalledWith(
        createGameA,
        publisher,
      );
    });

    it('should throw error when publisher does not found', async () => {
      findOrFailShouldReject(publishersRepository);

      await expectToThrowNotFound(() => service.create(createGameA));
    });
  });

  describe('findAll', () => {
    it('should return an array of games', async () => {
      expect(await service.findAll()).toBe(allGames);
      expect(gamesRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should find a game', async () => {
      expect(await service.findOne(gameA.id)).toBe(gameA);
      expect(gamesRepository.findOneOrFail).toHaveBeenCalledWith(gameA.id);
    });

    it('should throw an error when game does not found', async () => {
      findOrFailShouldReject(gamesRepository);

      await expectToThrowNotFound(() => service.findOne('whatever-id'));
    });
  });

  describe('update', () => {
    it('should update a game', async () => {
      expect(await service.update(gameA.id, updateGameA)).toBe(gameA);
      expect(gamesRepository.findOneOrFail).toHaveBeenCalledWith(gameA.id);
      expect(publishersRepository.findOneOrFail).not.toBeCalled();
      expect(gamesRepository.save).toHaveBeenCalledWith({
        ...gameA,
        ...updateGameA,
      });
    });

    it('should update the publisher', async () => {
      const newPublisherId = 'other-publisher-id';
      const updatePublisher: UpdateGameDto = {
        ...updateGameA,
        publisherId: newPublisherId,
      };

      expect(await service.update(gameA.id, updatePublisher)).toBe(gameA);
      expect(gamesRepository.findOneOrFail).toHaveBeenCalledWith(gameA.id);
      expect(publishersRepository.findOneOrFail).toHaveBeenCalledWith(
        newPublisherId,
      );
      expect(gamesRepository.save).toHaveBeenCalledWith({
        ...gameA,
        ...updatePublisher,
      });
    });

    it('should throw an error when game does not found', async () => {
      findOrFailShouldReject(gamesRepository);

      await expectToThrowNotFound(() =>
        service.update('whatever-id', updateGameA),
      );
    });

    it('should throw error when publisher does not found', async () => {
      findOrFailShouldReject(publishersRepository);

      await expectToThrowNotFound(() =>
        service.update('whatever-id', {
          ...updateGameA,
          publisherId: 'not-found-id',
        }),
      );
    });
  });

  describe('remove', () => {
    it('should remove an existing game', async () => {
      await service.remove(gameA.id);

      expect(gamesRepository.delete).toHaveBeenCalledWith(gameA.id);
    });

    it('should throw an error when game does not found', async () => {
      findOrFailShouldReject(gamesRepository);

      await expectToThrowNotFound(() => service.remove('whatever-id'));
    });
  });

  describe('findPublisher', () => {
    it('should should find the game and return the publisher', async () => {
      expect(await service.findPublisher(gameA.id)).toBe(publisher);
      expect(gamesRepository.findOneOrFail).toHaveBeenCalledWith(gameA.id);
    });

    it('should throw an error when game does not found', async () => {
      findOrFailShouldReject(gamesRepository);

      await expectToThrowNotFound(() => service.findOne('whatever-id'));
    });
  });
});
