import { BeforeInsert, Column, Entity, Unique } from 'typeorm';
import { BaseEntity, RolesEnum } from '../../base.entity';
import {
  ChannelEnum,
  DeviceTypeEnum,
  GenderEnum,
} from '../dto/create-user.dto';
import { Exclude } from 'class-transformer';

@Unique(['email'])
@Unique(['phone'])
@Unique(['apple_id'])
@Entity({ name: 'users' })
export class Users extends BaseEntity {
  @BeforeInsert()
  fieldsToModify() {
    this.city = this.city.toLowerCase();
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
  gender: GenderEnum;

  @Column({ nullable: false, type: 'integer', default: 1 })
  stage: number;

  @Column({
    nullable: false,
    type: 'varchar',
    enum: [
      DeviceTypeEnum.IMAC,
      DeviceTypeEnum.IPAD,
      DeviceTypeEnum.IPHONE,
      DeviceTypeEnum.IWATCH,
      DeviceTypeEnum.MACBOOK_AIR,
      DeviceTypeEnum.MACBOOK_PRO,
    ],
    default: DeviceTypeEnum.IPHONE,
  })
  device_type: DeviceTypeEnum;

  @Column({
    nullable: false,
    type: 'varchar',
    enum: [RolesEnum.USERS],
    default: RolesEnum.USERS
  })
  role: RolesEnum;

  @Column({ nullable: false, type: 'uuid' })
  agent_id: string;

  @Column({ nullable: false, type: 'varchar' })
  apple_id: string;

  @Column({
    nullable: false,
    type: 'varchar',
    enum: [ChannelEnum.ONLINE, ChannelEnum.REFERRAL, ChannelEnum.WALK_IN],
    default: ChannelEnum.ONLINE,
  })
  channel: ChannelEnum;
}
