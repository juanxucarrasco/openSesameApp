import React from "react";
import { ActivityIndicator, StatusBar, View, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    let usuario = await AsyncStorage.getItem("usuario");
    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    if (usuario) {
      try {
        usuario = JSON.parse(usuario);
        this.props.navigation.navigate("Home");
      } catch (err) {
        alert("Error en iniciar aplicación");
        console.log(err);
      }
    } else {
      this.props.navigation.navigate("Auth");
    }
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator color="#556297" size={20} />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center"
  }
});

export default AuthLoadingScreen;
