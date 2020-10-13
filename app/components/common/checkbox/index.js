"use strict";

import React, { Component } from "react";
import { View, StyleSheet, Image } from "react-native";
import Touchable from "../touchable/";
import InputLabel from "../forms/input-label";
import Styles from "../../../styles";
import PropTypes from "prop-types";

const checkboxOnIcon = require("../../../assets/icons/forms/checkbox-on.png");

class Checkbox extends Component {
  render() {
    return (
      <Touchable
        style={[styles.checkboxWrapper, this.props.style]}
        accessibilityRole="button"
        accessibilityState={{ checked: this.props.isSelected }}
        onPress={this.props.onPress}
      >
        <InputLabel style={styles.checkboxText} title={this.props.checkboxLabel} />
        <View style={this.props.isSelected ? [styles.imageWrapper, styles.checkedImageWrapper] : styles.imageWrapper}>
          <Image
            source={checkboxOnIcon}
            style={this.props.isSelected ? styles.checkboxSelected : styles.checkboxUnselected}
          />
        </View>
      </Touchable>
    );
  }
}

const styles = StyleSheet.create({
  imageWrapper: {
    width: 20,
    height: 20,
    backgroundColor: Styles.Colours.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Styles.Colours.black87
  },
  checkboxWrapper: {
    width: "100%",
    ...Styles.Utilities.flexRow,
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Styles.Layout.Margins.small,
    borderBottomColor: Styles.Colours.boldShadow,
    borderBottomWidth: 1,
    paddingBottom: Styles.Layout.Margins.small
  },
  checkedImageWrapper: {
    borderColor: Styles.Colours.primary
  },
  checkboxText: {
    width: "85%",
    marginTop: 0,
    paddingRight: Styles.Layout.Margins.medium
  },
  checkboxSelected: {
    opacity: 1,
    height: 20,
    resizeMode: "contain",
    width: 20,
    alignItems: "center",
    tintColor: Styles.Colours.primary
  },
  checkboxUnselected: {
    opacity: 0
  }
});

Checkbox.propTypes = {
  checkboxLabel: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onPress: PropTypes.func.isRequired,
  style: PropTypes.any
};

export default Checkbox;
