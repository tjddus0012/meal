import { Module } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatbotController } from './chatbot.controller';
import { DeviceRepository } from 'src/device/device.repository';
import { DeviceService } from 'src/device/device.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ChatbotService, DeviceRepository, DeviceService],
  controllers: [ChatbotController],
})
export class ChatbotModule {}
