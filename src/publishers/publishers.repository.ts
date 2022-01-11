import { EntityRepository, Repository } from 'typeorm';
import { Publisher } from './entities/publisher.entity';

@EntityRepository(Publisher)
export class PublishersRepository extends Repository<Publisher> {}
