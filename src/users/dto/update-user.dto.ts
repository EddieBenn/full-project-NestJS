import { PartialType } from '@nestjs/mapped-types';
import { ChannelEnum, CreateUserDto, DeviceTypeEnum, GenderEnum } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';


export class UpdateUserDto extends PartialType(CreateUserDto) {}



export class UpdateUserResponseDto {
    @ApiProperty({ required: false, example: 'John', description: 'First name of the user' })
    first_name: string;
  
    @ApiProperty({ required: false, example: 'Doe', description: 'Last name of the user' })
    last_name: string;
  
    @ApiProperty({ required: false, example: 'user@example.com', description: 'Email of the user' })
    email: string;
  
    @ApiProperty({ required: false, example: '+2348104467932', description: 'Phone number of the user' })
    phone: string;
  
    @ApiProperty({ required: false, example: 'Lagos', description: 'City of the user' })
    city: string;
  
    @ApiProperty({ required: false, example: 'male', description: 'Gender of the user' })
    gender: GenderEnum;
  
    @ApiProperty({ required: false, example: 'iphone', description: 'Device the user wants to rent' })
    device_type: DeviceTypeEnum;
  
    @ApiProperty({ required: false, example: 'online', description: 'How the user heard about Apple rentals' })
    channel: ChannelEnum;
  }