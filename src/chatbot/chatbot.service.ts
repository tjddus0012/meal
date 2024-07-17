import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { BuildingType, Language, Menu, MenuType } from '@prisma/client';
import { DeviceRepository } from 'src/device/device.repository';

@Injectable()
export class ChatbotService {
  constructor(private deviceRepository: DeviceRepository) {}

  async getNowMenu(language: Language) {
    try {
      const dayjs = require('dayjs');
      let date = dayjs()
        .set('hour', 0)
        .set('minute', 0)
        .set('second', 0)
        .set('millisecond', 0);
      const currentHour = dayjs().hour();
      if (currentHour >= 19) {
        date = date.add(1, 'day');
      }
      const currentDay = dayjs().day();
      const menuType = await this.deviceRepository.getNowMenuType();

      const menu1_1 = await this.deviceRepository.findMenuByPK(
        'STUDENT_UNION_1_FLOOR_1',
        date,
        menuType,
        language,
      );

      const menu1_2 = await this.deviceRepository.findMenuByPK(
        'STUDENT_UNION_1_FLOOR_2',
        date,
        menuType,
        language,
      );

      const menu2 = await this.deviceRepository.findMenuByPK(
        'STUDENT_UNION_2_FLOOR_1',
        date,
        menuType,
        language,
      );

      let cornerMenu1_1 = await this.deviceRepository.findCornerMenu(
        'STUDENT_UNION_1_FLOOR_1',
        date,
        language,
      );
      let cornerMenu2_1 = await this.deviceRepository.findCornerMenu(
        'STUDENT_UNION_2_FLOOR_1',
        date,
        language,
      );

      let result: string = `${dayjs()}`;
      if (language === 'KOREAN') {
        if (currentHour >= 19 || currentHour < 9) {
          result += '조식\n';
        } else if (currentHour >= 9 && currentHour < 13) {
          result += '중식\n';
        } else if (currentHour >= 13 && currentHour < 19) {
          result += '석식\n';
        } else {
          result += '조식\n';
        }
      } else {
        if (currentHour >= 19 || currentHour < 9) {
          result += 'BREAKFAST\n';
        } else if (currentHour >= 9 && currentHour < 13) {
          result += 'LUNCH\n';
        } else if (currentHour >= 13 && currentHour < 19) {
          result += 'DINNER\n';
        } else {
          result += 'BREAKFAST\n';
        }
      }

      if (currentDay === 5 && currentHour >= 19) {
        result += this.generateMenu(menu2);
        return result;
      }
      if (currentDay === 0 && currentHour >= 19) {
        result += (await this.generateMenu(menu1_1)) + this.generateMenu(menu2);
        return result;
      }
      if (currentDay === 6 || currentDay === 0) {
        result += this.generateMenu(menu2);
        return result;
      } else {
        if (currentHour < 9 || currentHour >= 19) {
          result +=
            (await this.generateMenu(menu1_1)) + this.generateMenu(menu2);
          return result;
        } else {
          language === 'KOREAN'
            ? (result += '제1학생회관 - 1층')
            : (result += 'STUDENT UNION 1 - Floor 1');
          result += '\n' + (await this.generateMenu(menu1_1)) + '\n';
          if (cornerMenu1_1) {
            language === 'KOREAN' ? (result += '코너') : (result += 'CORNER');
            result += '\n' + (await this.generateMenu(cornerMenu1_1)) + '\n';
          }
          language === 'KOREAN'
            ? (result += '제1학생회관 - 2층')
            : (result += 'STUDENT UNION 1 - Floor 2');
          result += '\n' + (await this.generateMenu(menu1_2)) + '\n';
          if (cornerMenu2_1) {
            language === 'KOREAN' ? (result += '코너') : (result += 'CORNER');
            result += '\n' + (await this.generateMenu(cornerMenu2_1)) + '\n';
          }
          language === 'KOREAN'
            ? (result += '제2학생회관')
            : (result += 'STUDENT UNION 2');
          result += '\n' + (await this.generateMenu(menu2)) + '\n';
        }
      }

      return result;
    } catch (error) {
      console.error('Error in getNowMenu:', error.message);
      throw new InternalServerErrorException('Failed to retrieve menu data');
    }
  }

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
    const breakfast = await this.deviceRepository.findMenuByPK(
      buildingType,
      date,
      'BREAKFAST',
      language,
    );

    const lunch = await this.deviceRepository.findMenuByPK(
      buildingType,
      date,
      'LUNCH',
      language,
    );

    let lunchSpecial: Menu;

    if (date.getDay() !== 0 || date.getDay() !== 6) {
      lunchSpecial = await this.deviceRepository.findMenuByPK(
        buildingType,
        date,
        'LUNCH_SPECIAL',
        language,
      );
    }
    const dinner = await this.deviceRepository.findMenuByPK(
      buildingType,
      date,
      'DINNER',
      language,
    );
    let result: string =
      date.getFullYear().toString() +
      '-' +
      (date.getMonth() + 1).toString() +
      '-' +
      date.getDate().toString() +
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
      const day: number = parseInt(dateString.substring(6, 8));
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
