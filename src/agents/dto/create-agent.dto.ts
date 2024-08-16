import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { IPagination } from 'src/base.entity';
import { GenderEnum } from 'src/users/dto/create-user.dto';

export class CreateAgentDto {
  @ApiProperty({ example: 'John', description: 'First name of the agent' })
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the agent' })
  @IsNotEmpty()
  @IsString()
  last_name: string;

  @ApiProperty({
    example: 'Strongpassword123@',
    description: 'New password of the agent',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
    {
      message:
        'Password must be at least 6 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.',
    },
  )
  password: string;

  @ApiProperty({ example: '+2348104467932', description: 'Phone number of the agent' })
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  phone: string;

  @ApiProperty({ example: 'Lagos', description: 'City of the agent' })
  @Transform((val) => val.value.toLowerCase())
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({ example: 'male', description: 'Gender of the agent' })
  @IsNotEmpty()
  @IsEnum(GenderEnum)
  gender: GenderEnum;
}

export interface IAgent {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  gender: string;
  city: string;
  role: string;
  apple_id: string;
  admin_id?: string;
  pagination?: IPagination;
}

export interface AgentFilter {
  city?: string;
  email?: string;
  phone?: string;
  start_date?: string;
  end_date?: string;
  isPaginate?: boolean;
  size?: number;
  page?: number;
}
