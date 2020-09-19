export interface Gateway {
  id?: string;
  name: string;
  serialNumber: string;
  ipAddress: string;
  peripheralDevice?: PeripheralDevice[];
}

export interface PeripheralDevice {
  id?: string;
  uid: number;
  vendor: string;
  status: string;
  dateCreated?: number;
  gatewayID?: string;
}
