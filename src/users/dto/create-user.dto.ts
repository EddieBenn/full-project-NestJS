import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
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

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

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
