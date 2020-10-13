import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, ViewPropTypes, Platform, StyleSheet, TouchableHighlight, TouchableNativeFeedback } from "react-native";
import debounceFunc from "../../../utils/debounceFunc";

const PlatformTouchable = Platform.select({
  android: TouchableNativeFeedback,
  ios: TouchableHighlight
});

export default class Touchable extends Component {
  static propTypes = {
    // The views that should be displayed in the touchable element.
    children: PropTypes.any,

    disableDebounce: PropTypes.bool,

    // The action that should be run when this element is tapped.
    onPress: PropTypes.func,

    // The inner container view's style.
    style: ViewPropTypes.style,

    underlayColor: PropTypes.string
  };

  static defaultProps = {
    disableDebounce: false,
    underlayColor: "white"
  };

  onDebouncePress = debounceFunc(() => {
    this.props.onPress();
  });

  handleOnPress = () => {
    if (this.props.onPress) {
      if (this.props.disableDebounce) {
        this.props.onPress();
      } else {
        this.onDebouncePress();
      }
    }
  };

  render() {
    const { children, style, underlayColor, ...rest } = this.props;
    const flatStyle = StyleSheet.flatten(style) || {};

    // A map of styles to be applied to the Touchable component,
    // to whether they should also be deleted from flatStyle (Applied to contained view)
    const touchableStyles = {
      borderRadius: false,
      bottom: false,
      flex: false,
      flexGrow: Platform.OS === "ios",
      flexShrink: Platform.OS === "ios",
      left: false,
      margin: Platform.OS === "ios",
      marginBottom: Platform.OS === "ios",
      marginLeft: Platform.OS === "ios",
      marginRight: Platform.OS === "ios",
      marginTop: Platform.OS === "ios",
      marginVertical: Platform.OS === "ios",
      marginHorizontal: false,
      position: false,
      right: false,
      top: false
    };

    const touchableStyle = {};
    Object.keys(touchableStyles).forEach(key => {
      touchableStyle[key] = flatStyle[key];
      if (touchableStyles[key]) {
        delete flatStyle[key];
      }
    });

    return (
      <PlatformTouchable
        style={touchableStyle}
        activeOpacity={0.8}
        background={Platform.select({
          android: TouchableNativeFeedback.SelectableBackground(),
          ios: undefined
        })}
        underlayColor={Platform.select({
          android: undefined,
          ios: underlayColor
        })}
        {...rest}
        onPress={this.handleOnPress}
      >
        <View style={flatStyle}>{children}</View>
      </PlatformTouchable>
    );
  }
}
