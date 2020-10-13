//@flow
import React, { Component } from "react";
import colours from "../../../styles/colours";
import { StyleSheet, Text, Animated } from "react-native";
import Styles from "../../../styles/layout";

type Props = {|
  backgroundColor?: string,
  position: "top" | "bottom",
  textColor?: any
|};

type State = {|
  displayToast: boolean
|};

export default class Toast extends Component<Props, State> {
  static defaultProps: $Shape<Props> = {
    backgroundColor: colours.primary,
    textColor: colours.white
  };

  animateOpacityValue: any;
  timerID: ?any;
  toastMessage: string;

  constructor() {
    super();

    this.animateOpacityValue = new Animated.Value(0);

    this.state = {
      displayToast: false
    };

    this.toastMessage = "";
  }

  componentWillUnmount() {
    clearTimeout(this.timerID);
  }

  showToast(message: string, duration: number) {
    this.toastMessage = message;

    this.setState({ displayToast: true }, () => {
      Animated.timing(this.animateOpacityValue, {
        toValue: 1,
        duration: 500
      }).start(() => this.hideToast(duration));
    });
  }

  hideToast = (duration: number) => {
    this.timerID = setTimeout(() => {
      Animated.timing(this.animateOpacityValue, {
        toValue: 0,
        duration: duration
      }).start(() => {
        this.setState({ displayToast: false });
      });
    }, duration);
  };

  render() {
    const importStyle = {
      opacity: this.animateOpacityValue,
      top: this.props.position === "top" ? "15%" : "85%",
      backgroundColor: this.props.backgroundColor
    };
    if (this.state.displayToast) {
      return (
        <Animated.View style={[styles.container, importStyle]}>
          <Text numberOfLines={1} style={[styles.text, { color: this.props.textColor }]}>
            {this.toastMessage}
          </Text>
        </Animated.View>
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Styles.Margins.medium,
    paddingHorizontal: Styles.Margins.medium,
    paddingVertical: Styles.Margins.small,
    borderRadius: Styles.BorderRadius.medium,
    zIndex: 10,
    position: "absolute",
    justifyContent: "center",
    alignSelf: "center"
  },
  text: {
    fontSize: 15,
    alignSelf: "stretch",
    textAlign: "center"
  }
});
