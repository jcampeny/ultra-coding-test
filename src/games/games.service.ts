import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { GamesRepository } from './games.repository';
import { Game } from './entities/game.entity';
import { PublishersRepository } from '../publishers/publishers.repository';
import { Publisher } from '../publishers/entities/publisher.entity';

@Injectable()
export class GamesService {
  constructor(
    private readonly gamesRepository: GamesRepository,
    private readonly publisherRepository: PublishersRepository,
  ) {}

  async create(createGameDto: CreateGameDto): Promise<Game> {
    const publisher = await this.findPublisherOrFail(createGameDto.publisherId);

    return this.gamesRepository.createGame(createGameDto, publisher);
  }

  findAll(): Promise<Game[]> {
    return this.gamesRepository.find();
  }

  findOne(id: string): Promise<Game> {
    return this.findGameOrFail(id);
  }

  async update(id: string, updateGameDto: UpdateGameDto): Promise<Game> {
    const game = await this.findGameOrFail(id);
    const { publisherId } = updateGameDto;

    if (publisherId && publisherId !== game.publisher.id) {
      game.publisher = await this.findPublisherOrFail(publisherId);
    }

    return this.gamesRepository.save({ ...game, ...updateGameDto });
  }

  async remove(id: string): Promise<void> {
    const game = await this.findGameOrFail(id);

    await this.gamesRepository.delete(game.id);
  }

  async findPublisher(id: string): Promise<Publisher> {
    const game = await this.findGameOrFail(id);

    return game.publisher;
  }

  private async findGameOrFail(id: string): Promise<Game> {
    try {
      return await this.gamesRepository.findOneOrFail(id);
    } catch (e) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  private async findPublisherOrFail(id: string): Promise<Publisher> {
    try {
      return await this.publisherRepository.findOneOrFail(id);
    } catch (e) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }
}
