import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { GatewaysController } from './gateway.controller';
import { GatewaysService } from './gateway.service';

import { GatewayDoc, GatewaySchema } from './schemas/gateway.schema';
import { PeripheralDeviceDoc, PeripheralDeviceSchema } from './schemas/peripheral-device.schema';
import { PeripheralDeviceService } from './peripheral-device.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GatewayDoc.name, schema: GatewaySchema },
      { name: PeripheralDeviceDoc.name, schema: PeripheralDeviceSchema },
    ]),
  ],
  controllers: [GatewaysController],
  providers: [GatewaysService, PeripheralDeviceService],
})
export class GatewayModule {}
