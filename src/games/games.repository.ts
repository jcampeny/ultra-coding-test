import { EntityRepository, LessThanOrEqual, Repository } from 'typeorm';
import { Game } from './entities/game.entity';
import { CreateGameDto } from './dto/create-game.dto';
import { Publisher } from '../publishers/entities/publisher.entity';

@EntityRepository(Game)
export class GamesRepository extends Repository<Game> {
  async createGame(
    createGameDto: CreateGameDto,
    publisher: Publisher,
  ): Promise<Game> {
    const game = new Game();

    game.title = createGameDto.title;
    game.price = createGameDto.price;
    game.publisher = publisher;
    game.tags = createGameDto.tags;
    game.releaseDate = createGameDto.releaseDate;

    await this.save(game);

    return game;
  }

  async findWithReleaseOlderThan(fromDate: Date): Promise<Game[]> {
    return this.find({
      where: {
        releaseDate: LessThanOrEqual(fromDate),
      },
    });
  }
}
