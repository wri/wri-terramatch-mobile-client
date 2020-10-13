// @flow

import React, { Component } from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { Navigation } from "react-native-navigation";
import { tabComponentIds } from "../../../screens";

const CloseIcon = require("../../../assets/icons/modal/close.png");

/**
 * Adapted from https://github.com/wix/react-native-navigation/pull/1739/files
 */
export default class ModalCloseButton extends Component<{}> {
  render() {
    return (
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => Navigation.dismissModal(tabComponentIds.MODAL)}
        accessibilityRole={"button"}
      >
        <Image style={styles.closeModalButton} source={CloseIcon} />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center"
  },
  closeModalButton: {
    height: 32,
    width: 32,
    resizeMode: "stretch"
  }
});
