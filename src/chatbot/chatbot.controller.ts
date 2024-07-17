import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { DeviceService } from 'src/device/device.service';
import { BuildingType, Language } from '@prisma/client';
import { IsDateString } from 'class-validator';
import { SpecMealDto } from 'src/device/dto/specMealDto';

@Controller('chatbot')
export class ChatbotController {
  constructor(private chatbotService: ChatbotService) {}

  @Post('/speckor')
  specKorMeal(@Body() body: SpecMealDto) {
    return this.chatbotService.findMenuBybldg(
      body.buildingType,
      body.date,
      'KOREAN',
    );
  }

  @Post('/speceng')
  specEngMeal(@Body() body: SpecMealDto) {
    return this.chatbotService.findMenuBybldg(
      body.buildingType,
      body.date,
      'ENGLISH',
    );
  }

  @Get('/:dateString/:buildingType/:language')
  async getSpecMenu(
    @Param('dateString') dateString: string,
    @Param('buildingType') buildingType: BuildingType,
    @Param('language') language: Language,
  ) {
    const date = await this.chatbotService.dateString(dateString);
    return await this.chatbotService.findMenuBybldg(
      buildingType,
      date,
      language,
    );
  }
}
