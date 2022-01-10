import { Test, TestingModule } from '@nestjs/testing';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';

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

  describe('findAll', () => {
    it('should find all games', async () => {
      await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
    });
  });
});
