import { PartialType } from '@nestjs/mapped-types';
import { CreateAgentDto } from './create-agent.dto';
import { ApiProperty } from '@nestjs/swagger';
import { GenderEnum } from 'src/users/dto/create-user.dto';


export class UpdateAgentDto extends PartialType(CreateAgentDto) {}


export class UpdateAgentResponseDto {
    @ApiProperty({ example: 'John', description: 'First name of the agent' })
    first_name: string;
  
    @ApiProperty({ example: 'Doe', description: 'Last name of the agent' })
    last_name: string;
  
    @ApiProperty({ example: '+2348104467932', description: 'Phone number of the agent' })
    phone: string;
  
    @ApiProperty({ example: 'Lagos', description: 'City of the agent' })
    city: string;
  
    @ApiProperty({ example: 'male', description: 'Gender of the agent' })
    gender: GenderEnum;
  }