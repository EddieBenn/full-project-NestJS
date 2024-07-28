import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @CreateDateColumn()
  public created_at?: Date | string;

  @UpdateDateColumn()
  public updated_at?: Date | string;

  @Column({ default: null, nullable: true })
  public deleted_at?: Date;
}
