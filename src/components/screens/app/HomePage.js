import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView
} from "react-native";

import LinearGradient from "react-native-linear-gradient";
import { clearStorage, getUserData } from "../../../api/config";

export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    };
  }

  componentDidMount() {
    getUserData().then(user => {
      this.setState({
        user
      });
    });
  }
  render() {
    const { user } = this.state;
    const name = user ? `${user.name} ${user.lastName}` : "";
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
                  fontSize: 20,
                  color: "black"
                }}
              >
                {name}
              </Text>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  justifyContent: "center"
                }}
                onPress={this.loginProcess}
              >
                <LinearGradient
                  colors={["#002368", "#002368"]}
                  angle={-45}
                  useAngle
                  style={styles.buttonLogout}
                >
                  <Text style={styles.buttonLogout__text}>CERRAR SESIÓN</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <Text
              style={{
                fontSize: 40,
                fontWeight: "bold",
                textAlign: "center",
                marginTop: 50,
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
              onPress={this.loginProcess}
            >
              <LinearGradient
                colors={["#005da2", "#005da2"]}
                angle={-45}
                useAngle
                style={styles.buttonOpenDoor}
              >
                <Text style={styles.buttonOpenDoor__text}>ABRIR PUERTA</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
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
  buttonLogout__text: {
    color: "white",
    fontSize: 20
  }
});
