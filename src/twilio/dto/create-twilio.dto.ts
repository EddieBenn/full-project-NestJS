import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl, IsOptional } from 'class-validator';

export class CreateTwilioDto {
  @ApiProperty({
    example: '+2348104467932',
    description: 'Phone number to send WhatsApp message to',
  })
  @IsNotEmpty()
  @IsString()
  to: string;

  @ApiProperty({
    example: 'https://example.com/file.pdf',
    description: 'URL of media file to send',
  })
  @IsNotEmpty()
  @IsUrl()
  mediaUrl: string;

  @ApiProperty({
    example: 'Please find your document attached',
    description: 'Message body text',
    required: false,
  })
  @IsOptional()
  @IsString()
  body?: string;
}
