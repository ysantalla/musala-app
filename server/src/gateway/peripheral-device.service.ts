import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PeripheralDeviceDoc } from './schemas/peripheral-device.schema';
import { CreatePeripheralDeviceDTO } from './dto/peripheral-device.dto';
import { PeripheralDevice } from './interfaces/peripheral-device.interface';

@Injectable()
export class PeripheralDeviceService {
  constructor(
    @InjectModel(PeripheralDeviceDoc.name)
    private readonly peripheralDeviceModel: Model<PeripheralDeviceDoc>,
  ) {}

  async insertOne(
    createPeripheralDeviceDTO: CreatePeripheralDeviceDTO,
  ): Promise<PeripheralDevice> {
    const peripheralDevice = await this.peripheralDeviceModel.create({
      status: createPeripheralDeviceDTO.status,
      dateCreated: createPeripheralDeviceDTO.dateCreated,
      uid: createPeripheralDeviceDTO.uid,
      vendor: createPeripheralDeviceDTO.vendor,
    });

    return {
      id: peripheralDevice._id,
      status: peripheralDevice.status,
      dateCreated: peripheralDevice.dateCreated.getMilliseconds(),
      uid: peripheralDevice.uid,
      vendor: peripheralDevice.vendor,
    };
  }

  async deleteOne(id: string): Promise<{ deleted: boolean; message?: string }> {
    try {
      // tslint:disable-next-line: no-invalid-await
      await this.peripheralDeviceModel.deleteOne({ _id: id });
      return { deleted: true };
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }

  async findByIDs(ids: string[]): Promise<PeripheralDevice[]> {
    return await this.peripheralDeviceModel.find({ _id: { $in: ids } }).lean();
  }

  async countByIDs(ids: string[]): Promise<number> {
    return await this.peripheralDeviceModel.count({ _id: { $in: ids } }).lean();
  }
}
