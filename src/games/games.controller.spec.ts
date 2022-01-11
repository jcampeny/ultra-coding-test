import { Test, TestingModule } from '@nestjs/testing';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';
import { Publisher } from '../publishers/entities/publisher.entity';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';

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
  ...createGameA,
  id: 'abc',
  publisher,
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

describe('GamesController', () => {
  let controller: GamesController;
  let service: GamesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GamesController],
      providers: [
        GamesService,
        {
          provide: GamesService,
          useValue: {
            create: jest.fn().mockImplementation(() => Promise.resolve(gameA)),
            findAll: jest
              .fn()
              .mockImplementation(() => Promise.resolve(allGames)),
            findOne: jest.fn().mockImplementation(() => Promise.resolve(gameA)),
            update: jest
              .fn()
              .mockImplementation(() =>
                Promise.resolve({ ...gameA, ...updateGameA }),
              ),
            remove: jest.fn(),
            findPublisher: jest
              .fn()
              .mockImplementation(() => Promise.resolve(publisher)),
          },
        },
      ],
    }).compile();

    controller = module.get<GamesController>(GamesController);
    service = module.get<GamesService>(GamesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new game', async () => {
      expect(await controller.create(createGameA)).toBe(gameA);
      expect(service.create).toHaveBeenCalledWith(createGameA);
    });
  });

  describe('findAll', () => {
    it('should find all games', async () => {
      expect(await controller.findAll()).toBe(allGames);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should find a game', async () => {
      expect(await controller.findOne(gameA.id)).toBe(gameA);
      expect(service.findOne).toHaveBeenCalledWith(gameA.id);
    });
  });

  describe('update', () => {
    it('should update a game', async () => {
      expect(await controller.update(gameA.id, updateGameA)).toEqual({
        ...gameA,
        ...updateGameA,
      });
      expect(service.update).toHaveBeenCalledWith(gameA.id, updateGameA);
    });
  });

  describe('remove', () => {
    it('should remove an existing game', async () => {
      await controller.remove(gameA.id);

      expect(service.remove).toHaveBeenCalledWith(gameA.id);
    });
  });

  describe('findPublisher', () => {
    it('should should find the game and return the publisher', async () => {
      expect(await controller.findPublisher(gameA.id)).toBe(publisher);
      expect(service.findPublisher).toHaveBeenCalledWith(gameA.id);
    });
  });
});
