import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { HttpException, HttpStatus, INestApplication } from '@nestjs/common';
import { GamesService } from '../src/games/games.service';
import { Publisher } from '../src/publishers/entities/publisher.entity';
import { Game } from '../src/games/entities/game.entity';
import { AppModule } from '../src/app.module';

const publisher: Publisher = {
  id: 'abc',
  name: 'Ultra Gaming',
  siret: 123,
  phone: '1234',
};

const aGame: Game = {
  id: 'abc',
  title: 'God of wars 17',
  price: 78,
  publisher,
  tags: ['god', 'of', 'wars'],
  releaseDate: '2022-01-25',
};

const allGames: Game[] = [aGame, { ...aGame, id: 'abc' }];

describe('Games', () => {
  let app: INestApplication;
  let service: GamesService;

  function shouldThrowNotFoundException() {
    return jest.fn().mockImplementation(() => {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    });
  }

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(GamesService)
      .useValue({
        create: () => Promise.resolve(aGame),
        findAll: () => Promise.resolve(allGames),
        findOne: () => Promise.resolve(aGame),
        update: () => Promise.resolve(aGame),
        remove: () => Promise.resolve(),
        findPublisher: () => Promise.resolve(publisher),
      })
      .compile();

    service = moduleRef.get<GamesService>(GamesService);
    app = moduleRef.createNestApplication();

    await app.init();
  });

  describe('POST /games', () => {
    it('should response 201 with the new game', () => {
      return request(app.getHttpServer())
        .post('/games')
        .expect(201)
        .expect(aGame);
    });

    it('should response 404 when publisher is not found', () => {
      service.create = shouldThrowNotFoundException();

      return request(app.getHttpServer())
        .post('/games')
        .expect(404)
        .expect({ statusCode: 404, message: 'Not found' });
    });
  });

  describe('GET /games', () => {
    it('should response 200 with all games', () => {
      return request(app.getHttpServer())
        .get('/games')
        .expect(200)
        .expect(allGames);
    });
  });

  describe('GET /games/:id', () => {
    it('should response 200 with the game', () => {
      return request(app.getHttpServer())
        .get(`/games/${aGame.id}`)
        .expect(200)
        .expect(aGame);
    });

    it('should response 404 when game is not found', () => {
      service.findOne = shouldThrowNotFoundException();

      return request(app.getHttpServer())
        .get(`/games/whatever-id`)
        .expect(404)
        .expect({ statusCode: 404, message: 'Not found' });
    });
  });

  describe('PATCH /games/:id', () => {
    it('should response 200 with the updated game', () => {
      return request(app.getHttpServer())
        .patch(`/games/${aGame.id}`)
        .expect(200)
        .expect(aGame);
    });

    it('should response 404 when game or publisher is not found', () => {
      service.update = shouldThrowNotFoundException();

      return request(app.getHttpServer())
        .get(`/games/whatever-id`)
        .expect(404)
        .expect({ statusCode: 404, message: 'Not found' });
    });
  });

  describe('DELETE /games/:id', () => {
    it('should response 200 on deleted game', () => {
      return request(app.getHttpServer())
        .delete(`/games/${aGame.id}`)
        .expect(200)
        .expect({});
    });

    it('should response 404 when game or publisher is not found', () => {
      service.remove = shouldThrowNotFoundException();

      return request(app.getHttpServer())
        .get(`/games/whatever-id`)
        .expect(404)
        .expect({ statusCode: 404, message: 'Not found' });
    });
  });

  describe('GET /games/:id/publisher', () => {
    it('should response 200 with the publisher', () => {
      return request(app.getHttpServer())
        .get(`/games/${aGame.id}/publisher`)
        .expect(200)
        .expect(publisher);
    });

    it('should response 404 when game is not found', () => {
      service.findPublisher = shouldThrowNotFoundException();

      return request(app.getHttpServer())
        .get(`/games/whatever-id/publisher`)
        .expect(404)
        .expect({ statusCode: 404, message: 'Not found' });
    });
  });

  afterAll(async () => await app.close());
});
