import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { Game } from './entities/game.entity';
import { GamesRepository } from './games.repository';
import { PublishersRepository } from '../publishers/publishers.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Game, GamesRepository, PublishersRepository]),
  ],
  controllers: [GamesController],
  providers: [GamesService],
})
export class GamesModule {}
