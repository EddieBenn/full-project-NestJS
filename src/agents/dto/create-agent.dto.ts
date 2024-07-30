import { IsEmail, IsEnum, IsNotEmpty, IsString, Matches } from "class-validator";
import { IPagination } from "src/base.entity";
import { GenderEnum } from "src/users/dto/create-user.dto";

export class CreateAgentDto {
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
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, {
    message: 'Password must be at least 6 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  city: string;

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