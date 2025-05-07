import { Controller, Post, Body } from '@nestjs/common';
import { TwilioService } from './twilio.service';
import { CreateTwilioDto } from './dto/create-twilio.dto';
import {
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Twilio')
@Controller('twilio')
export class TwilioController {
  constructor(private readonly twilioService: TwilioService) {}

  @ApiOperation({ summary: 'Send WhatsApp Message with Media' })
  @ApiBody({ type: CreateTwilioDto })
  @ApiCreatedResponse({ description: 'Message sent successfully' })
  @ApiBadRequestResponse({ description: 'Failed to send message' })
  @ApiSecurity('access_token')
  @Post('send-whatsapp')
  async sendWhatsAppMedia(@Body() payload: CreateTwilioDto) {
    try {
      const { to, mediaUrl, body } = payload;
      const result = await this.twilioService.sendWhatsAppMedia(
        to,
        mediaUrl,
        body,
      );
      return { message: 'WhatsApp message sent successfully', data: result };
    } catch (error) {
      throw error;
    }
  }
}
