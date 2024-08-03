import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export enum DeviceTypeEnum {
  IPHONE = 'iphone',
  IPAD = 'ipad',
  IMAC = 'imac',
  IWATCH = 'iwatch',
  MACBOOK_AIR = 'macbook_air',
  MACBOOK_PRO = 'macbook_pro',
}

export enum ChannelEnum {
  WALK_IN = 'walk_in',
  ONLINE = 'online',
  REFERRAL = 'referral',
}

export enum GenderEnum {
  MALE = 'male',
  FEMALE = 'female',
}

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  last_name: string;

  @Transform((val) => val.value.toLowerCase())
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @Transform((val) => val.value.toLowerCase())
  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsEnum(GenderEnum)
  gender: GenderEnum;

  @IsNotEmpty()
  @IsEnum(DeviceTypeEnum)
  device_type: DeviceTypeEnum;

  @IsNotEmpty()
  @IsEnum(ChannelEnum)
  channel: ChannelEnum;
}

export interface IUser {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  gender: string;
  city: string;
  stage: number;
  device_type: string;
  role: string;
  agent_id: string;
  apple_id: string;
  channel: string;
}

export interface UserFilter {
  city?: string;
  email?: string;
  phone?: string;
  start_date?: string;
  end_date?: string;
  isPaginate?: boolean;
  size?: number;
  page?: number;
}