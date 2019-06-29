/**
 * Airbnb Clone App
 * @author: Andy
 * @Url: https://www.cubui.com
 */

import React, { Component } from "react";
import { View, Image, Modal, StyleSheet } from "react-native";

export default class CustomModal extends Component {
  render() {
    const { animationType, modalVisible, children } = this.props;
    if (!modalVisible) return null;
    return (
      <Modal
        animationType={animationType}
        onRequestClose={() => {}}
        transparent
        visible={modalVisible}
      >
        <View style={styles.wrapper}>{children}</View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 9,
    backgroundColor: "rgba(0,0,0,0.6)",
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0
  },
  loaderContainer: {
    width: 90,
    height: 90,
    backgroundColor: "#fff",
    borderRadius: 15,
    position: "absolute",
    left: "50%",
    top: "50%",
    marginLeft: -45,
    marginTop: -45
  },
  loaderImage: {
    width: 70,
    height: 70,
    borderRadius: 15,
    position: "relative",
    left: "50%",
    marginLeft: -35,
    top: "50%",
    marginTop: -35
  }
});
