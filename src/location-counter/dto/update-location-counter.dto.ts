import { PartialType } from '@nestjs/mapped-types';
import { CreateLocationCounterDto, UserTypeEnum } from './create-location-counter.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateLocationCounterDto extends PartialType(
  CreateLocationCounterDto,
) {}


export class UpdateLocationCounterResponseDto {
  @ApiProperty({ example: 'lagos', description: 'City name' })
  city: string;

  @ApiProperty({ example: 'Nigeria', description: 'Country of each city' })
  country: string;

  @ApiProperty({ example: 1, description: 'No of people registered in that city' })
  count: number;

  @ApiProperty({ example: 'LA', description: 'Code of each city' })
  city_code: string;

  @ApiProperty({ example: 'agent', description: 'Role of the user' })
  user_type: UserTypeEnum;
}