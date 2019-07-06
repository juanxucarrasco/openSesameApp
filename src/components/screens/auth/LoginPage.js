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
import Toast from "@remobile/react-native-toast";
import AutoHeightImage from "react-native-auto-height-image";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";

import { loginUser } from "../../../api/user";
export default class LoginPage extends Component {
  loginProcess = () => {
    const { email, password } = this.state;

    if (email.trim().length === 0 || password.trim().length === 0) {
      Toast.showShortTop("Por favor ingrese correo y clave");
      return;
    }

    this.setState({ textLoad: "CARGANDO..." });
    loginUser(email, password)
      .then(res => {
        if (res.error) {
          Toast.showShortCenter("Credenciales incorrectas");
          this.setState({ textLoad: "LOGIN" });
        } else {
          this.props.navigation.navigate("Home");
        }
      })
      .catch(err => {
        this.setState({ textLoad: "LOGIN" });
        Toast.showShortCenter("Credenciales incorrectas");
        console.log(err);
      });
  };

  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      textLoad: "LOGIN"
    };
  }

  render() {
    const { email, password, textLoad } = this.state;
    return (
      <LinearGradient
        style={styles.linearGradient}
        start={{ x: 0.2, y: 0.2 }}
        end={{ x: 1, y: 1 }}
        colors={["#eef3ee", "#47cde6"]}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.containerStyle}
        >
          <AutoHeightImage
            width={wp("80%")}
            source={require("../../../assets/img/EPICI_recortado.png")}
          />
          <Text
            style={{
              fontSize: 30,
              fontWeight: "bold",
              textAlign: "center",
              marginTop: hp("10%"),
              color: "black"
            }}
          >
            LABORATORIO 01
          </Text>

          <View style={styles.boxForm}>
            <View>
              <TextInput
                placeholder="Ingrese Correo"
                keyboardType="email-address"
                value={email}
                onChangeText={email => this.setState({ email })}
                underlineColorAndroid={"#428AF8"}
                returnKeyType={"next"}
                onSubmitEditing={() => {
                  this.inputPassword.focus();
                }}
              />
            </View>
            <View>
              <TextInput
                placeholder="Ingrese password"
                mode="outlined"
                value={password}
                onChangeText={password => this.setState({ password })}
                secureTextEntry={true}
                underlineColorAndroid={"#428AF8"}
                ref={ref => {
                  this.inputPassword = ref;
                }}
                onSubmitEditing={() => {
                  this.loginProcess();
                }}
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
                <Text style={styles.buttonLogin__text}>{textLoad}</Text>
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
    // flex: 1
    // backgroundColor: "red"
    paddingVertical: 30
  },
  containerStyle: {
    // flex: 1,
    //  flexDirection: "column",
    // justifyContent: "center",
    // alignItems: "center",
    paddingHorizontal: 30
  },
  linearGradient: {
    flex: 1
  },
  boxForm: {
    backgroundColor: "white",
    borderRadius: 30,
    padding: 20,
    marginTop: 20,
    marginBottom: 80
  },
  buttonLogin: {
    borderRadius: 30,
    paddingVertical: 5,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "center",
    width: wp("70%")
  },
  buttonLogin__text: {
    color: "white",
    fontSize: 25
  }
});
