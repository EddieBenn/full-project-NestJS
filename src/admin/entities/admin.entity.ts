import { BeforeInsert, Column, Entity, OneToMany, Unique } from 'typeorm';
import { BaseEntity, RolesEnum } from '../../base.entity';
import { Exclude } from 'class-transformer';
import { GenderEnum } from 'src/users/dto/create-user.dto';
import { Agents } from 'src/agents/entities/agent.entity';

@Unique(['email'])
@Unique(['phone'])
@Entity({ name: 'admin', schema: 'rental_service' })
export class Admin extends BaseEntity {
  @BeforeInsert()
  fieldsToModify() {
    this.city = this.city.toLowerCase();
    this.gender = this.gender.toLowerCase();
  }
  @Column({ nullable: false, type: 'varchar' })
  first_name: string;

  @Column({ nullable: false, type: 'varchar' })
  last_name: string;

  @Column({ nullable: false, type: 'varchar' })
  email: string;

  @Column({ nullable: false, type: 'varchar' })
  phone: string;

  @Exclude() // Exclude this field from response
  @Column({ nullable: false, type: 'varchar' })
  password: string;

  @Column({ nullable: false, type: 'varchar' })
  city: string;

  @Column({
    nullable: false,
    type: 'varchar',
    enum: [GenderEnum.MALE, GenderEnum.FEMALE],
  })
  gender: string;

  @Column({
    nullable: false,
    type: 'varchar',
    enum: [RolesEnum.ADMIN],
    default: RolesEnum.ADMIN
  })
  role: string;

  @OneToMany(() => Agents, (ag) => ag.admin)
  agents: Agents[];
}

