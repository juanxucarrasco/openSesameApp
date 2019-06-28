import React, { Component } from "react";
import { View, YellowBox } from "react-native";
import Routes from "./Routes";

type Props = {};

YellowBox.ignoreWarnings([
  "Warning: isMounted(...) is deprecated",
  "Warning: Can't",
  "Module RCTImageLoader",
  "Method `jumpToIndex` is deprecated"
]);

class App extends Component<Props> {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Routes />
      </View>
    );
  }
}
export default App;
