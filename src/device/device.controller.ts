import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { DeviceService } from './device.service';
import { createMenuDto } from 'src/device/dto/createMenuDto';
import { createImageURLDto } from 'src/device/dto/createImageDto';
import { BuildingType, Language, MenuType } from '@prisma/client';
import { SpecMealDto } from './dto/specMealDto';

@Controller('device')
export class DeviceController {
  private readonly logger = new Logger(DeviceController.name);
  constructor(private deviceService: DeviceService) {}

  // @Post('/test')
  // test(testStr: string) {
  //   this.logger.log(testStr);
  // }

  @Post('/create/menu')
  async createMenu(@Body() menu: createMenuDto) {
    try {
      return this.deviceService.createMenu(menu);
    } catch (error) {
      throw new BadRequestException('Failed to create menu');
    }
  }

  @Post('/create/imageurl')
  createImageURL(@Body() body: createImageURLDto) {
    return this.deviceService.createImageURL(body.name, body.image_url);
  }

  @Post('/find:buildingType:language')
  async findMenuBybldg(
    @Param('buildingType') buildingType: BuildingType,
    @Param('language') Language: Language,
  ) {
    const dayjs = require('dayjs');
    const date = dayjs();
    return await this.deviceService.findMenuBybldg(
      buildingType,
      date,
      Language,
    );
  }

  @Post('/eng')
  async getMenuEng() {
    return await this.deviceService.getNowMenu('ENGLISH');
  }

  @Post('/kor')
  async getMenuKor() {
    return await this.deviceService.getNowMenu('KOREAN');
  }
}
