//@flow
"use strict";

import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import Styles from "../../../styles";

type Props = {|
  styles?: any
|};

class Chevron extends Component<Props> {
  render() {
    return <View style={[styles.chevron, this.props.styles]} />;
  }
}

const chevronSize = 6;

const styles = StyleSheet.create({
  chevron: {
    backgroundColor: "transparent",
    borderTopWidth: chevronSize,
    borderTopColor: Styles.Colours.black,
    borderRightWidth: chevronSize,
    borderRightColor: "transparent",
    borderLeftWidth: chevronSize,
    borderLeftColor: "transparent",
    width: 0,
    height: 0
  }
});

export default Chevron;
