//@flow
import React, { Component } from "react";
import { ActivityIndicator, StyleSheet, ViewPropTypes } from "react-native";

// Views
import Styles from "../../../styles";
import PropTypes from "prop-types";

class LoadingIndicator extends Component {
  static propTypes = {
    ...ViewPropTypes,
    color: PropTypes.any,
    size: PropTypes.string,
    style: PropTypes.any
  };

  static defaultProps = {
    color: Styles.Colours.primary,
    size: "small"
  };

  render() {
    return <ActivityIndicator {...this.props} style={[styles.defaultStyle, this.props.style]} />;
  }
}

const styles = StyleSheet.create({
  defaultStyle: {
    margin: Styles.Layout.Margins.medium
  }
});

export default LoadingIndicator;
