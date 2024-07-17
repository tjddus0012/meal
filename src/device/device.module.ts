import { Module } from '@nestjs/common';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';
import { DeviceRepository } from './device.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule],
  controllers: [DeviceController],
  providers: [DeviceService, DeviceRepository],
})
export class DeviceModule {}
