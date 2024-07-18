import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { BuildingType, Language, Menu, MenuType } from '@prisma/client';
import { DeviceRepository } from 'src/device/device.repository';

@Injectable()
export class ChatbotService {
  constructor(private deviceRepository: DeviceRepository) {}

  async generateMenu(menu: Menu) {
    let result = '';
    if (menu === null) {
      return ' ';
    }
    const meal = await this.deviceRepository.findMenuById(menu.id);

    for (const food of meal.Foods) {
      for (const foodname of food.FoodNames) {
        result += `${foodname.name}` + '\n';
      }
    }

    return result;
  }
  catch(error) {
    console.error('Error in generateMenu:', error.message);
    throw new InternalServerErrorException('Failed to generate menu');
  }

  async findMenuBybldg(
    buildingType: BuildingType,
    date: Date,
    language: Language,
  ) {
    const setDate = new Date(date);
    setDate.setUTCHours(0, 0, 0, 0);
    const breakfast = await this.deviceRepository.findMenuByPK(
      buildingType,
      setDate,
      'BREAKFAST',
      language,
    );

    const lunch = await this.deviceRepository.findMenuByPK(
      buildingType,
      setDate,
      'LUNCH',
      language,
    );

    let lunchSpecial: Menu;

    if (setDate.getDay() !== 0 || setDate.getDay() !== 6) {
      lunchSpecial = await this.deviceRepository.findMenuByPK(
        buildingType,
        setDate,
        'LUNCH_SPECIAL',
        language,
      );
    }
    const dinner = await this.deviceRepository.findMenuByPK(
      buildingType,
      setDate,
      'DINNER',
      language,
    );
    let result: string =
      setDate.getFullYear().toString() +
      '-' +
      (setDate.getMonth() + 1).toString() +
      '-' +
      setDate.getDate().toString() +
      ' ' +
      `${buildingType}` +
      '\n\n';
    language === 'KOREAN' ? (result += '조식') : (result += 'BREAKFAST');
    result += '\n' + (await this.generateMenu(breakfast)) + '\n';
    language === 'KOREAN' ? (result += '중식') : (result += 'LUNCH');
    result += '\n' + (await this.generateMenu(lunch)) + '\n';
    if (lunchSpecial) {
      language === 'KOREAN' ? (result += '코너') : (result += 'CORNER');
      result += '\n' + (await this.generateMenu(lunchSpecial)) + '\n';
    }
    language === 'KOREAN' ? (result += '석식') : (result += 'DINNER');
    result += '\n' + (await this.generateMenu(dinner));
    return result;
  }

  async dateString(dateString: string) {
    try {
      const year: number = parseInt(dateString.substring(0, 4));
      const month: number = parseInt(dateString.substring(4, 6)) - 1;
      const day: number = parseInt(dateString.substring(6, 8)) + 1;
      let date = new Date(year, month, day);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    } catch (error) {
      console.error('Error in dateString:', error.message);
      throw new InternalServerErrorException('Failed to parse date string');
    }
  }

  async findMenuByPK(
    buildingType: BuildingType,
    date: Date,
    type: MenuType,
    language: Language,
  ) {
    return this.deviceRepository.findMenuByPK(
      buildingType,
      date,
      type,
      language,
    );
  }
}
