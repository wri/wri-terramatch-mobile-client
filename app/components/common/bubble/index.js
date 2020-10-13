//@flow

import React, { Component } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import REMOVE_ICON from "../../../assets/icons/bubble/close.png";
import Layout from "../../../styles/layout";
import Styles from "../../../styles";
import Touchable from "../touchable";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: Layout.BorderRadius.small,
    position: "absolute",
    top: Layout.Margins.small,
    left: Layout.Margins.small,
    right: Layout.Margins.small,
    paddingVertical: Layout.Margins.medium,
    minHeight: 60,
    backgroundColor: "white"
  },
  icon: { width: 20, height: 20, position: "absolute", right: 10, top: 6 },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    marginStart: Layout.Margins.medium,
    marginEnd: Layout.Margins.medium
  }
});

type Props = {|
  body: string,
  title: string
|};

type State = {|
  +hide: boolean
|};

class Bubble extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      hide: false
    };
  }

  _onPress = () => {
    this.setState({
      hide: true
    });
  };

  render() {
    if (this.state.hide === true) {
      return null;
    } else {
      return (
        <View style={styles.container}>
          <Touchable accessibilityRole="button" style={styles.icon} onPress={this._onPress}>
            <Image source={REMOVE_ICON} />
          </Touchable>
          <View style={styles.content}>
            <Text style={Styles.Text.h1}>{this.props.title}</Text>
            <Text style={Styles.Text.body}>{this.props.body}</Text>
          </View>
        </View>
      );
    }
  }
}

export default Bubble;
