import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class GatewayDoc extends Document {
  @Prop({
    unique: true,
  })
  serialNumber: string;

  @Prop()
  name: string;

  @Prop()
  ipAddress: string;

  @Prop({
    type: [String],
  })
  peripheralDeviceIDs: string[];
}

export const GatewaySchema = SchemaFactory.createForClass(GatewayDoc);
