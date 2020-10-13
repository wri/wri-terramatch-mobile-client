"use strict";

import React, { Component } from "react";
import { Text, StyleSheet } from "react-native";
import Required from "../required";
import Styles from "../../../../styles/";
import PropTypes from "prop-types";

class InputLabel extends Component {
  render() {
    return (
      <Text style={[styles.fieldHeader, this.props.style]}>
        {this.props.title}
        {this.props.required ? <Required /> : null}
      </Text>
    );
  }
}

InputLabel.defaultProps = {
  required: false
};

InputLabel.propTypes = {
  required: PropTypes.bool,
  style: PropTypes.object,
  title: PropTypes.string.isRequired
};

const styles = StyleSheet.create({
  fieldHeader: {
    ...Styles.Text.h4,
    ...Styles.Text.uppercase,
    marginTop: Styles.Layout.Margins.medium
  }
});

export default InputLabel;
