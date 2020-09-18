import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { ObjectID } from 'mongodb';

import { CreateGatewayDTO } from './dto/gateway.dto';
import { GatewayDoc } from './schemas/gateway.schema';
import { Gateway } from './interfaces/gateway.interface';
import { PeripheralDeviceService } from './peripheral-device.service';
import { CreatePeripheralDeviceDTO } from './dto/peripheral-device.dto';


@Injectable()
export class GatewaysService {
  constructor(
    @InjectModel(GatewayDoc.name)
    private readonly gatewayModel: Model<GatewayDoc>,
    private readonly peripheralDeviceService: PeripheralDeviceService,
  ) {}

  async getOne(id: string): Promise<Gateway> {

    if (!ObjectID.isValid(id)) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `Invalid decoding Object ID ${id}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const gateway = await this.gatewayModel.findOne({ _id: id }).lean();

    if (!gateway) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `Gateway not found by ID ${id}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const peripheralDevice = await this.peripheralDeviceService.findByIDs(
      gateway.peripheralDeviceIDs,
    );

    return {
      id: gateway._id,
      name: gateway.name,
      ipAddress: gateway.ipAddress,
      serialNumber: gateway.serialNumber,
      peripheralDevice: peripheralDevice,
    };
  }

  /**
   * I would suggest against using something like `new this.gatewayModel()`
   * because it becomes really _really_ hard to mock.
   * Instead, you can use the class method `create` to achieve
   * the same effect.
   */
  async insertOne(createGatewayDTO: CreateGatewayDTO): Promise<Gateway> {
    const gateway = await this.gatewayModel.create({
      name: createGatewayDTO.name,
      ipAddress: createGatewayDTO.ipAddress,
      serialNumber: createGatewayDTO.serialNumber,
      peripheralDeviceIDs: [],
    });

    return {
      id: gateway._id,
      name: gateway.name,
      ipAddress: gateway.ipAddress,
      serialNumber: gateway.serialNumber,
      peripheralDevice: [],
    };
  }

  async addPeripheralDevice(
    id: string,
    createPeripheralDeviceDTO: CreatePeripheralDeviceDTO,
  ): Promise<{id: string}> {

    if (!ObjectID.isValid(id)) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `Invalid decoding Object ID ${id}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const findGateway = await this.gatewayModel.findById(id);

    if (!findGateway) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `Gateway not found by ID ${id}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (findGateway.peripheralDeviceIDs.length == 10) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Gateway must be less or 10 peripheral devices',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const peripheralDevice = await this.peripheralDeviceService.insertOne(
      createPeripheralDeviceDTO,
    );

    await this.gatewayModel.updateOne(
      {
        _id: id,
      },
      {
        $push: {
          peripheralDeviceIDs: peripheralDevice.id,
        },
      },
    );

    return {id: peripheralDevice.id};
  }

  async removePeripheralDevice(
    id: string,
    peripheralDeviceID: string,
  ): Promise<{ deleted: boolean; message?: string }> {

    if (!ObjectID.isValid(id) || !ObjectID.isValid(peripheralDeviceID)) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `Invalid decoding Object ID`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const findGateway = await this.gatewayModel.findById(id);

    if (!findGateway) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `Gateway not found by ID ${id}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.gatewayModel.updateOne(
      {
        _id: id,
      },
      {
        $pull: {
          peripheralDeviceIDs: peripheralDeviceID,
        },
      },
    );

    return await this.peripheralDeviceService.deleteOne(peripheralDeviceID);
  }
}
