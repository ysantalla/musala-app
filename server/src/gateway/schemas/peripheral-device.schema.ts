import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class PeripheralDeviceDoc extends Document {
  @Prop({
    required: true,
  })
  uid: number;

  @Prop({
    required: true,
  })
  vendor: string;

  @Prop({
    type: Date,
    default: Date.now(),
  })
  dateCreated?: Date;

  @Prop({
    enum: ['ONLINE', 'OFFLINE'],
  })
  status: string;
}

export const PeripheralDeviceSchema = SchemaFactory.createForClass(
  PeripheralDeviceDoc,
);