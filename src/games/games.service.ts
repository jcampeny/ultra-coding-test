import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { GamesRepository } from './games.repository';
import { Game } from './entities/game.entity';

@Injectable()
export class GamesService {
  constructor(private readonly gamesRepository: GamesRepository) {}

  create(createGameDto: CreateGameDto): Promise<Game> {
    return this.gamesRepository.save(createGameDto);
  }

  findAll(): Promise<Game[]> {
    return this.gamesRepository.find();
  }

  findOne(id: string): Promise<Game> {
    return this.findGameOrFail(id);
  }

  async update(id: string, updateGameDto: UpdateGameDto): Promise<Game> {
    const game = await this.findGameOrFail(id);

    return this.gamesRepository.save({ ...game, ...updateGameDto });
  }

  async remove(id: string): Promise<void> {
    const game = await this.findGameOrFail(id);

    await this.gamesRepository.delete(game.id);
  }

  private async findGameOrFail(id: string): Promise<Game> {
    try {
      return this.gamesRepository.findOneOrFail(id);
    } catch (e) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }
}
