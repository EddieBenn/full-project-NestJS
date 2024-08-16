import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
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
  @ApiProperty({ example: 'John', description: 'First name of the user' })
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
  @IsNotEmpty()
  @IsString()
  last_name: string;

  @ApiProperty({ example: 'user@example.com', description: 'Email of the user' })
  @Transform((val) => val.value.toLowerCase())
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+2348104467932', description: 'Phone number of the user' })
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  phone: string;

  @ApiProperty({ example: 'Lagos', description: 'City of the user' })
  @Transform((val) => val.value.toLowerCase())
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({ example: 'male', description: 'Gender of the user' })
  @IsNotEmpty()
  @IsEnum(GenderEnum)
  gender: GenderEnum;

  @ApiProperty({ example: 'iphone', description: 'Device the user wants to rent' })
  @IsNotEmpty()
  @IsEnum(DeviceTypeEnum)
  device_type: DeviceTypeEnum;

  @ApiProperty({ example: 'online', description: 'How the user heard about Apple rentals' })
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

export class ReassignOneUserDto {
  @ApiProperty({ 
    example: '90b7f325-be27-45a7-9688-fa49630cac8f', 
    description: 'UUID of the new agent who will be assigned to the users' 
  })
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  new_agent_id: string;
}
export class ReassignAllUsersDto {
  @ApiProperty({ 
    example: '90b7f325-be27-45a7-9688-fa49630cac8f', 
    description: 'UUID of the new agent who will be assigned to the users' 
  })
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  new_agent_id: string;

  @ApiProperty({ 
    example: '90b7f325-be27-45a7-9688-fa49630cac8f', 
    description: 'UUID of the current agent from whom the users will be reassigned' 
  })
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  current_agent_id: string;
}