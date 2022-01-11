import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Publisher } from '../../publishers/entities/publisher.entity';

@Entity()
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  price: number;

  @ManyToOne(() => Publisher, { eager: true })
  publisher: Publisher;

  @Column('simple-array')
  tags: string[];

  @Column('datetime')
  releaseDate: string;
}
