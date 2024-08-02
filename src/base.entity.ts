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

export enum RolesEnum {
  USER = 'user',
  AGENT = 'agent',
  ADMIN = 'admin',
}

export interface IPagination {
  totalRows: number;
  perPage: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
}

export interface IReqUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city: string;
  role: string;
  apple_id: string;
}

export enum ADMIN_ROLES {
  ADMIN = 'admin',
  AGENT = 'agent',
}
