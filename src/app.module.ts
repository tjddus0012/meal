import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DeviceModule } from './device/device.module';
import { ConfigModule } from '@nestjs/config';
import { MealModule } from './meal/meal.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

@Module({
  imports: [DeviceModule, ConfigModule, MealModule, ChatbotModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
    dayjs.extend(utc);
    dayjs.extend(timezone);
  }
}
