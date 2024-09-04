import { BeforeInsert, Column, Entity, Unique } from 'typeorm';
import { UserTypeEnum } from '../dto/create-location-counter.dto';
import { BaseEntity } from '../../base.entity';

@Unique(['city_code', 'user_type'])
@Entity({ name: 'location-counter', schema: 'rental_service' })
export class LocationCounter extends BaseEntity {
  @BeforeInsert()
  fieldsToModify() {
    this.city = this.city.toLowerCase();
    this.country = this.country.toLowerCase();
    this.city_code = this.city_code.toUpperCase();
  }
  @Column({ nullable: false, type: 'varchar' })
  city: string;

  @Column({ nullable: false, type: 'varchar' })
  country: string;

  @Column({ nullable: false, type: 'integer' })
  count: number;

  @Column({ nullable: false, type: 'varchar' })
  city_code: string;

  @Column({
    nullable: false,
    type: 'varchar',
    enum: [UserTypeEnum.ADMIN, UserTypeEnum.AGENT, UserTypeEnum.PROSPECT],
  })
  user_type: UserTypeEnum;
}
