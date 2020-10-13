// @flow

import React, { Component, type ElementConfig } from "react";
import { StyleSheet } from "react-native";
import RNPickerSelect from "react-native-picker-select";

// Utilities
import Chevron from "../chevron";
import Layout from "../../../styles/layout";
import colours from "../../../styles/colours";
import Styles from "../../../styles";

type Props = {|
  ...ElementConfig<typeof RNPickerSelect>,

  fullBorder?: boolean,

  sorted?: boolean
|};

/**
 * Wrapper around RNPickerSelect applying some default styling and behaviour
 */
export default class Picker extends Component<Props> {
  render() {
    // eslint-disable-next-line no-unused-vars
    const { style, placeholder, items, sorted, fullBorder, ...rest } = this.props;

    let sortedItems = items;

    if (sorted) {
      sortedItems = [...items];
      sortedItems.sort((a, b) => a.label.localeCompare(b.label));
    }

    // Flag indicating whether or not the placeholder is {}, which has special significance to RNPS
    const isPlaceholderEmptyObject = placeholder && Object.keys(placeholder).length === 0;

    return (
      <RNPickerSelect
        style={{
          ...styles,
          inputAndroidContainer: {
            ...styles.inputAndroidContainer,
            borderWidth: fullBorder ? 1 : undefined,
            padding: fullBorder ? Layout.Margins.medium : 0,
            flex: fullBorder ? 1 : 0
          },
          inputIOSContainer: {
            ...styles.inputIOSContainer,
            borderWidth: fullBorder ? 1 : undefined,
            padding: fullBorder ? Layout.Margins.medium : 0
          }
        }}
        useNativeAndroidPickerStyle={false}
        Icon={() => {
          return <Chevron styles={fullBorder ? styles.margin : null} />;
        }}
        pickerProps={{
          mode: "dialog"
        }}
        placeholder={
          isPlaceholderEmptyObject
            ? placeholder
            : placeholder
            ? {
                ...placeholder,
                key: placeholder.value,
                color: colours.black38
              }
            : null
        }
        items={sortedItems.map(item => ({
          ...item,
          key: item.value, // value is always unique, so just use it for key
          color: colours.black87
        }))}
        {...rest}
      />
    );
  }
}

const styles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-unused-styles
  inputIOSContainer: {
    padding: Layout.Margins.medium,
    borderColor: colours.border,
    borderWidth: 1,
    justifyContent: "center",
    paddingRight: 50
  },
  // eslint-disable-next-line react-native/no-unused-styles
  inputIOS: {
    ...Styles.Text.input,
    lineHeight: 16
  },
  // eslint-disable-next-line react-native/no-unused-styles
  inputAndroidContainer: {
    padding: Layout.Margins.medium,
    borderColor: colours.border,
    borderWidth: 1,
    justifyContent: "center",
    paddingRight: Layout.Margins.medium
  },
  // eslint-disable-next-line react-native/no-unused-styles
  inputAndroid: {
    ...Styles.Text.input,
    lineHeight: 16,
    padding: 0
  },
  // eslint-disable-next-line react-native/no-unused-styles
  headlessAndroidContainer: {
    flexDirection: "row"
  },
  margin: {
    marginRight: Styles.Layout.Margins.medium
  }
});
