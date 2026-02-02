// Web Bluetooth API type declarations
interface BluetoothDevice {
  id: string;
  name?: string;
  gatt?: BluetoothRemoteGATTServer;
}

interface BluetoothRemoteGATTServer {
  connected: boolean;
  device: BluetoothDevice;
  connect(): Promise<BluetoothRemoteGATTServer>;
  disconnect(): void;
}

interface RequestDeviceOptions {
  acceptAllDevices?: boolean;
  filters?: BluetoothLEScanFilter[];
  optionalServices?: string[];
}

interface BluetoothLEScanFilter {
  services?: string[];
  name?: string;
  namePrefix?: string;
}

interface Bluetooth {
  requestDevice(options: RequestDeviceOptions): Promise<BluetoothDevice>;
  getAvailability(): Promise<boolean>;
}

interface Navigator {
  bluetooth?: Bluetooth;
}