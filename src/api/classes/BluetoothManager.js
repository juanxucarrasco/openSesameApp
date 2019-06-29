import Toast from "@remobile/react-native-toast";
import BluetoothSerial from "react-native-bluetooth-serial";
import { Buffer } from "buffer";
import AsyncStorage from "@react-native-community/async-storage";
global.Buffer = Buffer;
const iconv = require("iconv-lite");

export default class BluetoothManager {
  isEnabled = false;
  discovering = false;
  devices = [];
  unpairedDevices = [];
  connected = false;
  section = 0;
  device = null;
  connecting = false;
  constructor() {
    Promise.all([BluetoothSerial.isEnabled(), BluetoothSerial.list()]).then(
      values => {
        const [isEnabled, devices] = values;
        this.isEnabled = isEnabled;
        this.devices = devices;
      }
    );
  }

  isConnected = () => {
    return this.connected;
  };

  async connect(device) {
    connecting = true;
    return BluetoothSerial.connect(device.id).then(async res => {
      Toast.showShortBottom(`Conectado a ${device.id}`);
      this.device = device;
      this.connected = true;
      this.connecting = false;
      await AsyncStorage.setItem("deviceId", device.id);
      return res;
    });
  }

  write(message) {
    if (!this.connected) {
      Toast.showShortBottom("Conectese al dispositivo primero");
    }

    return BluetoothSerial.write(message)
      .then(res => {
        Toast.showShortBottom("Se envió señal");
        this.connected = true;
        return res;
      })
      .catch(err => Toast.showShortBottom(err.message));
  }

  /**
   * Disconnect from bluetooth device
   */
  disconnect() {
    BluetoothSerial.disconnect()
      .then(() => (this.connected = false))
      .catch(err => Toast.showShortBottom(err.message));
  }

  writePackets(message, packetSize = 64) {
    const toWrite = iconv.encode(message, "cp852");
    const writePromises = [];
    const packetCount = Math.ceil(toWrite.length / packetSize);
    for (var i = 0; i < packetCount; i++) {
      const packet = new Buffer(packetSize);
      packet.fill(" ");
      toWrite.copy(packet, 0, i * packetSize, (i + 1) * packetSize);
      writePromises.push(BluetoothSerial.write(packet));
    }
    Promise.all(writePromises).then(result => {
      console.log("results", result);
    });
  }
}
