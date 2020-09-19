export interface PeripheralDevice {
  id?: string;
  uid: number;
  vendor: string;
  status: string;
  dateCreated?: number;
  gatewayID?: string;
}
