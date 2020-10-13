"use strict";

import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  View,
  ViewPropTypes
} from "react-native";

import Styles from "../../../styles";

// Utilities
import PropTypes from "prop-types";

/**
 * Simple entirely JavaScript button component, to allow adding React-Native
 * children to buttons, which the native buttons currently do not support.
 */
class Button extends Component {
  render() {
    // Calculate which style should be applied to the 'button' based on
    // whether a value has been selected and whether we're 'enabled'
    let style = [StyleSheet.flatten(this.props.style)];

    if (!this.props.enabled && this.props.disabledStyle) {
      style = [...style, StyleSheet.flatten(this.props.disabledStyle)];
    }

    const flatStyle = StyleSheet.flatten(style);
    const borderRadius = flatStyle.borderRadius;

    // Styles which should be applied to the containing text element rather than
    // either of the containing views
    const textKeys = ["fontFamily", "fontSize", "fontStyle", "fontWeight", "textAlign", "color", "lineHeight"];

    const containerStyle = {};
    const fontStyle = {};

    // Pull out the styles for each constituent element, this is done so we don't
    // have to declare and pass through 3 seperate stylesheet objects for each state of the pickerButton.
    Object.keys(flatStyle).forEach(key => {
      if (textKeys.includes(key)) {
        fontStyle[key] = flatStyle[key];
      } else {
        containerStyle[key] = flatStyle[key];
      }
    });

    const Touchable = Platform.OS === "android" ? TouchableNativeFeedback : TouchableWithoutFeedback;
    return (
      <Touchable
        style={[styles.touchable, { borderRadius: borderRadius }]}
        onPress={this.props.onPress}
        accessibilityRole="button"
        background={Platform.select({
          android: TouchableNativeFeedback.Ripple(this.props.rippleColourAndroid),
          ios: undefined
        })}
        disabled={!this.props.enabled}
      >
        <View
          style={[
            containerStyle,
            styles.buttonContainer,
            {
              borderRadius: borderRadius
            }
          ]}
        >
          {this.props.children}
          <Text style={[Styles.Text.centered, Styles.Text.uppercase, fontStyle]}>{this.props.title}</Text>
        </View>
      </Touchable>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  touchable: {
    alignSelf: "stretch",
    alignItems: "stretch"
  }
});

Button.defaultProps = {
  enabled: true,
  rippleColourAndroid: Styles.Colours.border
};

Button.propTypes = {
  ...ViewPropTypes,

  /**
   * The style of the button when disabled
   */
  disabledStyle: PropTypes.any,

  /**
   * Whether the button is enabled
   */
  enabled: PropTypes.bool,

  rippleColourAndroid: PropTypes.any,

  style: PropTypes.any,

  /**
   * The title to display on the button
   */
  title: PropTypes.string
};

export default Button;
