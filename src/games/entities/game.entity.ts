import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  price: number;

  @Column()
  publisher: string;

  @Column('simple-array')
  tags: string[];

  @Column('datetime')
  releaseDate: string;
}
