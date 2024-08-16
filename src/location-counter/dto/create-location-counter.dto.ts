import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export enum UserTypeEnum {
  ADMIN = 'admin',
  PROSPECT = 'prospect',
  AGENT = 'agent',
}

export class CreateLocationCounterDto {
  @ApiProperty({ example: 'lagos', description: 'City name' })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({ example: 'Nigeria', description: 'Country of each city' })
  @IsNotEmpty()
  @IsString()
  country: string;

  @ApiProperty({ example: 1, description: 'No of people registered in that city' })
  @IsNotEmpty()
  @IsNumber()
  count: number;

  @ApiProperty({ example: 'LA', description: 'Code of each city' })
  @IsNotEmpty()
  @IsString()
  city_code: string;

  @ApiProperty({ example: 'agent', description: 'Role of the user' })
  @IsNotEmpty()
  @IsEnum(UserTypeEnum)
  user_type: UserTypeEnum;
}

export interface LocationCounterFilter {
  city?: string;
  user_type?: string;
  start_date?: string;
  end_date?: string;
  isPaginate?: boolean;
  size?: number;
  page?: number;
}
