import { Body, Controller, Get, Param, Post, Delete, Patch } from '@nestjs/common';

import { ApiTags, ApiBody } from '@nestjs/swagger';

import { Gateway } from './interfaces/gateway.interface';
import { GatewaysService } from './gateway.service';
import { CreateGatewayDTO } from './dto/gateway.dto';
import { CreatePeripheralDeviceDTO } from './dto/peripheral-device.dto';

@ApiTags('gateway')
@Controller('gateway')
export class GatewaysController {
  constructor(private readonly gatewaysService: GatewaysService) {}

  @Get('/:id')
  async getById(@Param('id') id: string): Promise<Gateway> {
    return this.gatewaysService.getOne(id);
  }

  @Post('/create')
  @ApiBody({ type: CreateGatewayDTO })
  async createGateway(@Body() gateway: CreateGatewayDTO): Promise<Gateway> {
    return this.gatewaysService.insertOne(gateway);
  }

  @Patch('/:id/addDevice')
  @ApiBody({ type: CreatePeripheralDeviceDTO })
  async addDevice(
    @Param('id') id: string,
    @Body() createPeripheralDeviceDTO: CreatePeripheralDeviceDTO
  ): Promise<{id: string}> {
    return this.gatewaysService.addPeripheralDevice(id, createPeripheralDeviceDTO);
  }

  @Patch('/:id/removeDevice/:deviceID')
  async removeDevice(
    @Param('id') id: string,
    @Param('deviceID') deviceID: string,
  ): Promise<{ deleted: boolean; message?: string }> {
    return this.gatewaysService.removePeripheralDevice(id, deviceID);
  }
}
