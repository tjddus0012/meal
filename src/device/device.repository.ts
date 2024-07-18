import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BuildingType, Food, Language, Menu, MenuType } from '@prisma/client';
import { NotFoundError } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { createMenuDto } from './dto/createMenuDto';
import dayjs from 'dayjs';
import { error } from 'console';

@Injectable()
export class DeviceRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findMenuById(id: number) {
    try {
      return this.prismaService.menu.findUniqueOrThrow({
        where: { id },
        include: {
          Foods: {
            include: {
              FoodNames: true,
            },
          },
        },
      });
    } catch (error) {
      throw new NotFoundException('Menu not found');
    }
  }

  async findMenuByPK(
    buildingType: BuildingType,
    date: Date,
    type: MenuType,
    language: Language,
  ) {
    const setDate = new Date(date);
    setDate.setUTCHours(0, 0, 0, 0);
    console.log(buildingType, date, type, language);
    return await this.prismaService.menu
      .findFirst({
        where: {
          buildingType,
          date: {
            equals: setDate,
          },
          type,
        },
        include: {
          Foods: {
            include: {
              FoodNames: { where: { language } },
            },
          },
        },
      })
      .catch((error) => {
        if (error instanceof NotFoundError) {
          console.error(error instanceof NotFoundError);
        }
        throw error;
      });
  }

  checkIfMenuExists(menu: createMenuDto) {
    const date = new Date(menu.date);
    date.setUTCHours(0, 0, 0, 0);
    return this.prismaService.menu.findFirst({
      where: {
        date: date,
        buildingType: menu.buildingType,
        type: menu.type,
      },
      include: {
        Foods: true,
      },
    });
  }

  async createMenu(menu: createMenuDto) {
    const date = new Date(menu.date);
    date.setUTCHours(0, 0, 0, 0);
    console.log(date);

    let lang: Language = menu.food[0].foodName.language;

    let existMenu;
    try {
      existMenu = await this.findMenuByPK(
        menu.buildingType,
        date,
        menu.type,
        lang,
      );
    } catch (error) {
      if (error.message === 'No Menu found') {
        console.log('No menu found, create new menu');
      } else {
        throw error;
      }
    }

    if (existMenu) {
      throw new ConflictException(
        `${menu.buildingType}, ${menu.date}, ${menu.type}, ${lang}`,
      );
    }

    let foodList;

    let ExistingMenu = await this.checkIfMenuExists(menu);
    if (ExistingMenu) {
      ExistingMenu.Foods.map(async (existFood, index) => {
        const id = existFood.id;
        return this.prismaService.foodName.create({
          data: {
            food_id: id,
            name: menu.food[index].foodName.name,
            language: menu.food[index].foodName.language,
          },
        });
      });
    } else {
      foodList = await Promise.all(
        menu.food.map(async (food) => {
          const { name, language } = food.foodName;
          const existFood = await this.findFoodByName(name, language);
          if (!existFood) {
            const newFood = await this.createFood(
              name,
              language,
              food.image_url,
            );

            return { id: newFood.id };
          } else {
            return { id: existFood.id };
          }
        }),
      );

      return this.prismaService.menu.create({
        data: {
          type: menu.type,
          buildingType: menu.buildingType,
          date: date,
          Foods: {
            connect: foodList,
          },
        },
      });
    }
  }

  async createFood(name: string, language: Language, image_url: string) {
    return await this.prismaService.food.create({
      data: {
        image_url,
        FoodNames: {
          create: {
            name,
            language,
          },
        },
      },
      select: {
        id: true,
        image_url: true,
      },
    });
  }

  async createImageURL(name: string, imageURL: string) {
    const food = await this.findFoodByName(name, 'KOREAN');
    if (!food) {
      return 'food not found';
    }
    if (food.image_url) {
      return 'image already exists';
    }
    return await this.prismaService.food.update({
      where: {
        id: food.id,
      },
      data: {
        image_url: imageURL,
      },
    });
  }

  async findFoodByName(name: string, language: Language) {
    return this.prismaService.food.findFirst({
      where: {
        FoodNames: {
          some: {
            name,
            language,
          },
        },
      },
    });
  }

  async findCornerMenu(
    buildingType: BuildingType,
    date: Date,
    language: Language,
  ) {
    return await this.findMenuByPK(
      buildingType,
      date,
      'LUNCH_SPECIAL',
      language,
    );
  }

  async getNowMenuType() {
    const korNow = dayjs();
    const currentHour = korNow.hour();

    let menuType: MenuType = 'BREAKFAST';

    if (currentHour >= 9 && currentHour < 13) {
      menuType = 'LUNCH';
    } else if (currentHour >= 13 && currentHour < 19) {
      menuType = 'DINNER';
    } else if (currentHour >= 19 && currentHour < 24) {
      menuType = 'BREAKFAST';
      korNow.date(korNow.date() + 1);
    }

    return menuType;
  }
}
