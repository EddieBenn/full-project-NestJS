import { Injectable } from '@nestjs/common';
import { TwilioService as NestTwilioService } from 'nestjs-twilio';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TwilioService {
  constructor(
    private readonly twilioService: NestTwilioService,
    private readonly configService: ConfigService,
  ) {}

  async sendWhatsAppMedia(to: string, mediaUrl: string, body?: string) {
    const from = `whatsapp:${this.configService.get('TWILIO_WHATSAPP_NUMBER')}`;
    const formattedTo = `whatsapp:${to}`;

    try {
      const message = await this.twilioService.client.messages.create({
        from,
        to: formattedTo,
        body: body || 'Please find your notice agreement attached.',
        mediaUrl: [mediaUrl],
      });

      return message;
    } catch (error) {
      console.error('WhatsApp sending failed:', error);
      throw error;
    }
  }
}
