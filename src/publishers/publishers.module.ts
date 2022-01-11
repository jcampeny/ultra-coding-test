import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PublishersRepository } from './publishers.repository';
import { Publisher } from './entities/publisher.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Publisher, PublishersRepository])],
  controllers: [],
  providers: [],
})
export class PublishersModule {}
