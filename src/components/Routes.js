import React from "react";
import { createSwitchNavigator, createStackNavigator } from "react-navigation";

/* APP */
import BluetoothSerialExample from "./screens/app/BluetoothSerialExample";
import HomePage from "./screens/app/HomePage";
/* Auth */
import LoginPage from "./screens/auth/LoginPage";
import AuthLoadingScreen from "./screens/AuthLoadingScreen";

import HeaderStyles from "./headerStyles";
import CustomHeader from "./CustomHeader";

const HomeStack = createStackNavigator(
  {
    Home: {
      screen: HomePage,
      navigationOptions: {
        mode: "screen",
        header: null
      }
    }
  },
  {
    navigationOptions: {
      ...HeaderStyles,
      animationEnabled: true
    }
  }
);

const AuthStack = createStackNavigator(
  {
    Login: {
      screen: LoginPage,
      navigationOptions: {
        header: null
      }
    }
  },
  {
    initialRouteName: "Login",
    navigationOptions: {
      ...HeaderStyles,
      animationEnabled: true
    }
  }
);

export default createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    HomeStack: HomeStack,
    Auth: AuthStack
  },
  {
    initialRouteName: "AuthLoading"
  }
);
