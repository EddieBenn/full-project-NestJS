import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export enum UserTypeEnum {
  ADMIN = 'admin',
  PROSPECT = 'prospect',
  AGENT = 'agent',
}

export class CreateLocationCounterDto {
  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsNotEmpty()
  @IsNumber()
  count: number;

  @IsNotEmpty()
  @IsString()
  city_code: string;

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
