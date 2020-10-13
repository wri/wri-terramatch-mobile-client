//@flow

import React, { Component } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Layout from "../../../styles/layout";
import Styles from "../../../styles";
import Button from "../button";
import translate from "../../../locales";

type Props = {|
  body: string,
  title: string,
  icon: number,
  onPress: Function
|};

class ErrorBubble extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <View style={Styles.Utilities.flexRow}>
          <Image style={styles.icon} source={this.props.icon} />
          <View style={styles.content}>
            <Text style={Styles.Text.h3}>{this.props.title}</Text>
            <Text style={Styles.Text.body}>{this.props.body}</Text>
          </View>
        </View>
        <Button
          style={[Styles.Buttons.primary, styles.button]}
          onPress={this.props.onPress}
          title={translate("common.retry")}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: Layout.BorderRadius.small,
    position: "absolute",
    left: Layout.Margins.medium,
    right: Layout.Margins.medium,
    paddingVertical: Layout.Margins.medium,
    minHeight: 90,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white"
  },
  icon: { width: 70, height: 70, marginStart: 10, marginEnd: 10, resizeMode: "contain" },
  content: {
    flex: 1,
    justifyContent: "center",
    marginStart: Layout.Margins.medium,
    marginEnd: Layout.Margins.medium
  },
  button: { marginTop: 20, alignSelf: "center", justifyContent: "center" }
});

export default ErrorBubble;
