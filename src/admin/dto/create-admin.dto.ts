import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';
import { GenderEnum } from 'src/users/dto/create-user.dto';

export class CreateAdminDto {
  @ApiProperty({ example: 'John', description: 'First name of the admin' })
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the admin' })
  @IsNotEmpty()
  @IsString()
  last_name: string;

  @ApiProperty({ example: 'user@example.com', description: 'Email of the admin' })
  @Transform((val) => val.value.toLowerCase())
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Strongpassword123*',
    description: 'New password of the admin',
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

  @ApiProperty({ example: '+2348104467932', description: 'Phone number of the admin' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({ example: 'Lagos', description: 'City of the admin' })
  @Transform((val) => val.value.toLowerCase())
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({ example: 'male', description: 'Gender of the admin' })
  @Transform((val) => val.value.toLowerCase())
  @IsNotEmpty()
  @IsEnum(GenderEnum)
  gender: GenderEnum;
}

export interface IAdmin {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  gender: string;
  city: string;
  role: string;
}

export interface AdminFilter {
  city?: string;
  email?: string;
  phone?: string;
  start_date?: string;
  end_date?: string;
  isPaginate?: boolean;
  size?: number;
  page?: number;
}




