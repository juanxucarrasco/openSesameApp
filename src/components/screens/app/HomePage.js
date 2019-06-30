import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal
} from "react-native";

import LinearGradient from "react-native-linear-gradient";
import { clearStorage, getUserData, fetchApi } from "../../../api/config";
import { isValidateTime } from "../../../api/user";
import BluetoothManager from "../../../api/classes/BluetoothManager";
import BluetoothSerialExample from "./BluetoothSerialExample";
import AsyncStorage from "@react-native-community/async-storage";
import Toast from "@remobile/react-native-toast";
import BluetoothSerial from "react-native-bluetooth-serial";

export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      stateConnection: false,
      showModal: false,
      bluetoothState: false,
      connecting: false,
      isEnabled: false,
      validating: false
    };
    this.bluetooth = new BluetoothManager();
    BluetoothSerial.on("bluetoothEnabled", () =>
      Toast.showShortBottom("Bluetooth habilitado")
    );
    BluetoothSerial.on("bluetoothDisabled", () =>
      Toast.showShortBottom("Bluetooth deshabilitado")
    );
    BluetoothSerial.on("error", err => console.log(`Error: ${err.message}`));
    BluetoothSerial.on("connectionLost", () => {
      if (this.device) {
        Toast.showShortBottom(`Conexión a ${this.device.id} perdida`);
      }
      this.setState({
        stateConnection: false
      });
    });

    BluetoothSerial.requestEnable()
      .then(res => this.setState({ isEnabled: true }))
      .catch(err => Toast.showShortBottom(err.message));
  }

  componentDidMount() {
    getUserData().then(user => {
      this.setState({
        user
      });
    });
    this.setData(null);
  }

  setData = async device => {
    if (device) {
      this.device = device;
    } else {
      this.device = {
        id: await AsyncStorage.getItem("deviceId")
      };
    }
    if (this.device.id) {
      this.setState({
        connecting: true
      });
      this.bluetooth
        .connect(this.device)
        .then(res => {
          this.setState({
            stateConnection: true,
            connecting: false
          });
          Toast.showShortBottom("Conectado");
        })
        .catch(err => {
          this.setState({
            stateConnection: false,
            connecting: false
          });
          Toast.showShortBottom("No es posible conectarse al dispositivo");
        });
    } else {
      this.setState({
        stateConnection: false,
        connecting: false
      });
    }
  };

  openStateManager = () => {
    const { stateConnection } = this.state;
    if (!stateConnection)
      this.props.navigation.navigate("Bluetooth", {
        onBack: async () => {
          await this.setData();
        }
      });
  };

  toggleModal = () => {
    this.setState(state => {
      return {
        showModal: !state.showModal
      };
    });
  };

  sendMessage = async () => {
    const { stateConnection, user } = this.state;
    if (!stateConnection) {
      Toast.showShortBottom("Conectese al dispositivo primero");
      return null;
    }
    if (user.role !== "administrator") {
      this.setState({
        validating: true
      });
      try {
        const response = await isValidateTime();
        this.setState({
          validating: false
        });
        if (response.isValidTime === false) {
          Toast.showShortBottom("No se encuentra en su horario establecido");
          return;
        }
      } catch (error) {
        this.setState({
          validating: false
        });
        return;
      }
    }
    await this.bluetooth.write("^");
    Toast.showShortBottom("Puerta abierta");
  };

  logout = () => {
    AsyncStorage.clear();
    this.bluetooth.disconnect();
    this.props.navigation.navigate("Auth");
  };

  render() {
    const {
      user,
      stateConnection,
      showModal,
      connecting,
      validating
    } = this.state;
    const name = user ? `${user.name} ${user.lastName}` : "";

    let textButtonState = stateConnection ? "CONECTADO" : "DESCONECTADO";

    if (connecting) {
      textButtonState = "CONECTANDO...";
    }

    return (
      <LinearGradient
        style={styles.linearGradient}
        start={{ x: 0.2, y: 0.2 }}
        end={{ x: 1, y: 1 }}
        colors={["#c0cacb", "#eef3ee", "#47cde6"]}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.containerStyle}
        >
          <View>
            <View
              style={{
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row"
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: "black",
                  width: "70%"
                }}
              >
                {name}
              </Text>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  width: "30%"
                }}
                onPress={this.logout}
              >
                <LinearGradient
                  colors={["#002368", "#002368"]}
                  angle={-45}
                  useAngle
                  style={styles.buttonLogout}
                >
                  <Text style={styles.buttonLogout__text}>SALIR</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <Text
              style={{
                fontSize: 40,
                fontWeight: "bold",
                textAlign: "center",
                marginTop: 20,
                color: "black"
              }}
            >
              BIENVENIDO AL LAB 01
            </Text>
            <View
              style={{
                justifyContent: "center",
                flexDirection: "row",
                marginTop: 30
              }}
            >
              <View
                style={{
                  width: "45%",
                  height: 150,
                  justifyContent: "center",
                  flexDirection: "row"
                }}
              >
                <Image
                  style={{
                    flex: 1,
                    alignSelf: "stretch",
                    height: undefined,
                    width: undefined
                  }}
                  resizeMode="stretch"
                  source={require("../../../assets/img/candado_3.png")}
                />
              </View>
            </View>
          </View>
          <View>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginTop: 30
              }}
              onPress={this.sendMessage}
            >
              <LinearGradient
                colors={["#005da2", "#005da2"]}
                angle={-45}
                useAngle
                style={styles.buttonOpenDoor}
              >
                <Text style={styles.buttonOpenDoor__text}>
                  {validating ? "VALIDANDO..." : "ABRIR PUERTA"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <View
            style={{
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              marginTop: 50
            }}
          >
            <Text
              style={{
                fontSize: 18,
                color: "black"
              }}
            >
              Conexión
            </Text>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "center"
              }}
              onPress={this.openStateManager}
            >
              <LinearGradient
                colors={["#0092c7", "#0092c7"]}
                angle={-45}
                useAngle
                style={styles.buttonState}
              >
                <Text style={styles.buttonState__text}>{textButtonState}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <Modal
            animationType="fade"
            onRequestClose={() => {}}
            transparent
            visible={showModal}
          >
            <View style={styles.wrapper}>
              <BluetoothSerialExample bluetooth={this.bluetooth} />
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  marginTop: 10
                }}
                onPress={() => {
                  this.setData();
                  this.toggleModal();
                }}
              >
                <LinearGradient
                  colors={["#005da2", "#005da2"]}
                  angle={-45}
                  useAngle
                  style={styles.buttonOpenDoor}
                >
                  <Text style={styles.buttonOpenDoor__text}>Connectar</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Modal>
        </ScrollView>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
    // backgroundColor: "trasnpar"
  },
  wrapper: {
    zIndex: 9,
    backgroundColor: "rgba(0,0,0,0.6)",
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0
  },
  containerStyle: {
    flex: 1,
    paddingVertical: 30
    /*flexDirection: "column",
    justifyContent: "center"*/
  },
  linearGradient: {
    flex: 1,
    paddingHorizontal: 30
  },
  boxForm: {
    backgroundColor: "white",
    borderRadius: 30,
    padding: 20,
    marginTop: 80,
    marginBottom: 40
  },
  buttonOpenDoor: {
    borderRadius: 30,
    paddingVertical: 5,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "center",
    width: "80%"
  },
  buttonOpenDoor__text: {
    color: "white",
    fontSize: 25
  },
  buttonLogout: {
    borderRadius: 30,
    paddingVertical: 5,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "center"
  },
  buttonBluetooth: {
    borderRadius: 50,
    width: 50,
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  buttonLogout__text: {
    color: "white",
    fontSize: 18
  },
  buttonState: {
    borderRadius: 30,
    paddingVertical: 5,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "center"
  },
  buttonState__text: {
    color: "white",
    fontSize: 18
  }
});
