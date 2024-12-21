import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique } from 'typeorm';
import { BaseEntity, RolesEnum } from '../../base.entity';
import { Exclude } from 'class-transformer';
import { GenderEnum } from 'src/users/dto/create-user.dto';
import { Users } from 'src/users/entities/user.entity';
import { Admin } from 'src/admin/entities/admin.entity';

@Unique(['email'])
@Unique(['phone'])
@Unique(['apple_id'])
@Entity({ name: 'agents' })
export class Agents extends BaseEntity {
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
    enum: [RolesEnum.AGENT],
    default: RolesEnum.AGENT
  })
  role: string;

  @Column({ nullable: false, type: 'varchar' })
  apple_id: string;

  @Column({ nullable: true, type: 'uuid' })
  admin_id: string;

  @OneToMany(() => Users, (u) => u.agent)
  users: Users[];

  @ManyToOne(() => Admin, (ad) => ad.agents)
  @JoinColumn({ name: 'admin_id', referencedColumnName: 'id' })
  admin: Admin;
}
