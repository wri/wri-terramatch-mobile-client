"use strict";

import React, { Component } from "react";
import { View, StyleSheet, Platform } from "react-native";
import Button from "../button/";
import translate from "../../../locales/";
import { IsSmallDevice } from "../../../styles/layout";
import Styles from "../../../styles";
import PropTypes from "prop-types";

import { withSafeArea } from "react-native-safe-area";

const SafeAreaView = withSafeArea(View, "padding", "bottom");

class ButtonRow extends Component {
  render() {
    return (
      <SafeAreaView style={[this.props.isFloating ? styles.isFloating : null]}>
        {this.props.children}
        <View
          style={[
            this.props.isBackButtonHidden ? styles.centeredButtonWrapper : styles.buttonWrapper,
            this.props.style
          ]}
        >
          {!this.props.isBackButtonHidden && (
            <Button style={styles.backButton} onPress={this.props.backButton} title={translate("common.back")} />
          )}

          <Button
            disabledStyle={styles.nextButtonDisabled}
            enabled={this.props.enabled}
            style={styles.nextButton}
            onPress={this.props.nextButton}
            title={this.props.nextTitle ?? translate("common.nextAndSave")}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  centeredButtonWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: IsSmallDevice ? Styles.Layout.Margins.small : Styles.Layout.Margins.medium
  },
  buttonWrapper: {
    ...Styles.Buttons.buttonWrapper,
    paddingTop: IsSmallDevice ? Styles.Layout.Margins.small : Styles.Layout.Margins.medium
  },
  nextButton: {
    ...Styles.Buttons.primary,
    ...Styles.Buttons.isSmall,
    ...Styles.Utilities.flexGrow,
    paddingHorizontal: Styles.Layout.Margins.small
  },
  nextButtonDisabled: {
    ...Styles.Buttons.primaryDisabled,
    ...Styles.Buttons.isSmall,
    ...Styles.Utilities.flexGrow,
    paddingHorizontal: Styles.Layout.Margins.small
  },
  backButton: {
    ...Styles.Buttons.tertiary,
    ...Styles.Buttons.isSmall,
    ...Styles.Utilities.flexGrow
  },
  isFloating: {
    justifyContent: "space-around",
    paddingHorizontal: IsSmallDevice ? Styles.Layout.Margins.small : Styles.Layout.Margins.medium,
    paddingBottom: IsSmallDevice ? Styles.Layout.Margins.small : Styles.Layout.Margins.medium,
    ...Platform.select({
      ios: {
        shadowColor: Styles.Colours.black54,
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
          width: 0,
          height: -3
        }
      },
      android: {
        elevation: 16,
        paddingTop: 1
      }
    }),
    backgroundColor: "white"
  }
});

ButtonRow.propTypes = {
  backButton: PropTypes.func.isRequired,
  children: PropTypes.any,
  enabled: PropTypes.bool.isRequired,
  isBackButtonHidden: PropTypes.bool,
  isFloating: PropTypes.bool,
  nextButton: PropTypes.func.isRequired,
  nextTitle: PropTypes.string,
  style: PropTypes.object
};

ButtonRow.defaultProps = {
  isFloating: false
};

export default ButtonRow;
