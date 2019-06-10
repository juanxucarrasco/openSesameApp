import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

export default class LoginPage extends Component {
  loginProcess = () => {};
  render() {
    return (
      <View
        style={{
          flex: 1
        }}
      >
        <LinearGradient
          style={styles.linearGradient}
          start={{ x: 0.2, y: 0.2 }}
          end={{ x: 1, y: 1 }}
          colors={["#eef3ee", "#47cde6"]}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center"
            }}
          >
            <Image
              style={{
                width: "90%",
                height: 120,
                marginTop: 80
              }}
              resizeMode="stretch"
              source={require("../assets/img/EPICI_recortado.png")}
            />
          </View>

          <View style={styles.boxForm}>
            <View>
              <TextInput
                placeholder="Ingrese Correo"
                keyboardType="email-address"
                underlineColorAndroid={"#428AF8"}
              />
            </View>
            <View>
              <TextInput
                placeholder="Ingrese password"
                mode="outlined"
                secureTextEntry={true}
                underlineColorAndroid={"#428AF8"}
              />
            </View>

            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginTop: 30
              }}
              onPress={this.loginProcess}
            >
              <LinearGradient
                colors={["#447aff", "#44b1ff"]}
                angle={-45}
                useAngle
                style={styles.buttonLogin}
              >
                <Text style={styles.buttonLogin__text}>LOGIN</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    paddingHorizontal: 30
  },
  boxForm: {
    backgroundColor: "white",
    borderRadius: 30,
    padding: 20,
    marginTop: 80
  },
  buttonLogin: {
    borderRadius: 30,
    paddingVertical: 5,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "center",
    width: "80%"
  },
  buttonLogin__text: {
    color: "white",
    fontSize: 25
  }
});
