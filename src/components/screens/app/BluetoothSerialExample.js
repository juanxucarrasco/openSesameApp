import React, { Component } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View,
  Modal,
  ActivityIndicator,
  Image,
  TextInput
} from "react-native";

import Toast from "@remobile/react-native-toast";
import BluetoothSerial from "react-native-bluetooth-serial";
import { Buffer } from "buffer";
import AsyncStorage from "@react-native-community/async-storage";
global.Buffer = Buffer;
const iconv = require("iconv-lite");

const Button = ({ title, onPress, style, textStyle }) => (
  <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
    <Text style={[styles.buttonText, textStyle]}>{title.toUpperCase()}</Text>
  </TouchableOpacity>
);

const DeviceList = ({
  devices,
  connectedId,
  showConnectedIcon,
  onDevicePress
}) => (
  <ScrollView style={styles.container}>
    <View style={styles.listContainer}>
      {devices.map((device, i) => {
        return (
          <TouchableHighlight
            underlayColor="#DDDDDD"
            key={`${device.id}_${i}`}
            style={styles.listItem}
            onPress={() => onDevicePress(device)}
          >
            <View style={{ flexDirection: "row" }}>
              {showConnectedIcon ? (
                <View style={{ width: 48, height: 48, opacity: 0.4 }}>
                  {connectedId === device.id ? (
                    <Image
                      style={{
                        resizeMode: "contain",
                        width: 24,
                        height: 24,
                        flex: 1
                      }}
                      source={require("../../../assets/img/ic_done_black_24dp.png")}
                    />
                  ) : null}
                </View>
              ) : null}
              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                  alignItems: "center"
                }}
              >
                <Text style={{ fontWeight: "bold" }}>{device.name}</Text>
                <Text>{`<${device.id}>`}</Text>
              </View>
            </View>
          </TouchableHighlight>
        );
      })}
    </View>
  </ScrollView>
);

class BluetoothSerialExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEnabled: false,
      discovering: false,
      devices: [],
      unpairedDevices: [],
      connected: false,
      section: 0,
      text: ""
    };
  }

  componentWillMount() {
    Promise.all([BluetoothSerial.isEnabled(), BluetoothSerial.list()]).then(
      values => {
        const [isEnabled, devices] = values;
        this.setState({ isEnabled, devices });
      }
    );
    BluetoothSerial.on("bluetoothEnabled", () =>
      Toast.showShortBottom("Bluetooth enabled")
    );
    BluetoothSerial.on("bluetoothDisabled", () =>
      Toast.showShortBottom("Bluetooth disabled")
    );
    BluetoothSerial.on("error", err => console.log(`Error: ${err.message}`));
    BluetoothSerial.on("connectionLost", () => {
      if (this.state.device) {
        Toast.showShortBottom(
          `Connection to device ${this.state.device.name} has been lost`
        );
      }
      this.setState({ connected: false });
    });
  }

  /**
   * [android]
   * request enable of bluetooth from user
   */
  requestEnable() {
    BluetoothSerial.requestEnable()
      .then(res => this.setState({ isEnabled: true }))
      .catch(err => Toast.showShortBottom(err.message));
  }

  /**
   * [android]
   * enable bluetooth on device
   */
  enable() {
    BluetoothSerial.enable()
      .then(res => this.setState({ isEnabled: true }))
      .catch(err => Toast.showShortBottom(err.message));
  }

  /**
   * [android]
   * disable bluetooth on device
   */
  disable() {
    BluetoothSerial.disable()
      .then(res => this.setState({ isEnabled: false }))
      .catch(err => Toast.showShortBottom(err.message));
  }

  /**
   * [android]
   * toggle bluetooth
   */
  toggleBluetooth(value) {
    if (value === true) {
      this.enable();
    } else {
      this.disable();
    }
  }

  /**
   * [android]
   * Discover unpaired devices, works only in android
   */
  cancelDiscovery() {
    if (this.state.discovering) {
      BluetoothSerial.cancelDiscovery()
        .then(() => {
          this.setState({ discovering: false });
        })
        .catch(err => Toast.showShortBottom(err.message));
    }
  }

  /**
   * [android]
   * Pair device
   */
  pairDevice(device) {
    BluetoothSerial.pairDevice(device.id)
      .then(paired => {
        if (paired) {
          Toast.showShortBottom(`Device ${device.name} paired successfully`);
          const devices = this.state.devices;
          devices.push(device);
          this.setState({
            devices,
            unpairedDevices: this.state.unpairedDevices.filter(
              d => d.id !== device.id
            )
          });
        } else {
          Toast.showShortBottom(`Device ${device.name} pairing failed`);
        }
      })
      .catch(err => Toast.showShortBottom(err.message));
  }

  /**
   * Connect to bluetooth device by id
   * @param  {Object} device
   */
  connect = async device => {
    await AsyncStorage.setItem("deviceId", device.id);
    this.setState({ device, connected: true, connecting: false });
    return;
    BluetoothSerial.connect(device.id)
      .then(async res => {
        Toast.showShortBottom(`Connected to device ${device.name}`);
        this.setState({ device, connected: true, connecting: false });
      })
      .catch(err => Toast.showShortBottom(err.message));
  };
  /**
   * Disconnect from bluetooth device
   */
  disconnect() {
    BluetoothSerial.disconnect()
      .then(() => this.setState({ connected: false }))
      .catch(err => Toast.showShortBottom(err.message));
  }

  onDevicePress(device) {
    this.connect(device);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.topBar}>
          <Text style={styles.heading}>DISPOSITIVOS EMPAREJADOS</Text>
          {Platform.OS === "android" ? (
            <View style={styles.enableInfoWrapper}>
              <Text style={{ fontSize: 12, color: "#FFFFFF" }}>
                {this.state.isEnabled ? "disable" : "enable"}
              </Text>
              <Switch
                onValueChange={this.toggleBluetooth.bind(this)}
                value={this.state.isEnabled}
              />
            </View>
          ) : null}
        </View>
        <DeviceList
          showConnectedIcon={this.state.section === 0}
          connectedId={this.state.device && this.state.device.id}
          devices={
            this.state.section === 0
              ? this.state.devices
              : this.state.unpairedDevices
          }
          onDevicePress={device => this.onDevicePress(device)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0.9,
    backgroundColor: "#F5FCFF"
  },
  topBar: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 6,
    backgroundColor: "#005da2"
  },
  heading: {
    fontWeight: "bold",
    fontSize: 16,
    alignSelf: "center",
    color: "#FFFFFF"
  },
  enableInfoWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  tab: {
    alignItems: "center",
    flex: 0.5,
    height: 56,
    justifyContent: "center",
    borderBottomWidth: 6,
    borderColor: "transparent"
  },
  connectionInfoWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 25
  },
  connectionInfo: {
    fontWeight: "bold",
    alignSelf: "center",
    fontSize: 18,
    marginVertical: 10,
    color: "#238923"
  },
  listContainer: {
    borderColor: "#ccc",
    borderTopWidth: 0.5
  },
  listItem: {
    flex: 1,
    height: 48,
    paddingHorizontal: 16,
    borderColor: "#ccc",
    borderBottomWidth: 0.5,
    justifyContent: "center"
  },
  fixedFooter: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ddd"
  },
  button: {
    height: 36,
    margin: 5,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center"
  },
  buttonText: {
    color: "#7B1FA2",
    fontWeight: "bold",
    fontSize: 14
  },
  buttonRaised: {
    backgroundColor: "#7B1FA2",
    borderRadius: 2,
    elevation: 2
  }
});

export default BluetoothSerialExample;
