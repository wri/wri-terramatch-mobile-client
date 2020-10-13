// @flow

import React, { Component } from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import Touchable from "../touchable/";
import Styles from "../../../styles";

const placeholderIcon = require("../../../assets/icons/organisation/placeholder.png");

type Props = {|
  items: ?Array<{
    key: string,
    label: string,
    image: ?any
  }>,
  onPress: string => any,
  selectedItems: Array<string>
|};

class TouchableCheckboxes extends Component<Props> {
  renderTypes(
    val: Array<{
      key: string,
      label: string,
      image: ?any
    }>
  ): any {
    return val.map((item, index) => {
      const selectedItems = this.props.selectedItems;
      return (
        <View key={index} style={styles.checkbox}>
          <Touchable accessibilityRole="button" onPress={() => this.props.onPress(item.key)} disableDebounce={true}>
            <View
              style={
                selectedItems.includes(item.key)
                  ? [styles.imageWrapper, styles.checkedImageWrapper]
                  : styles.imageWrapper
              }
            >
              <Image source={item.image ?? placeholderIcon} style={styles.placeholderIcon} />
            </View>
            <Text style={styles.checkboxLabel}>{item.label}</Text>
          </Touchable>
        </View>
      );
    });
  }

  render() {
    return <View style={styles.checkboxWrapper}>{this.props.items ? this.renderTypes(this.props.items) : []}</View>;
  }
}

const styles = StyleSheet.create({
  placeholderIcon: {
    height: "100%",
    resizeMode: "contain",
    width: "100%",
    alignItems: "center"
  },
  checkbox: {
    marginBottom: "2%",
    width: "46%",
    margin: "2%"
  },
  imageWrapper: {
    borderRadius: Styles.Layout.BorderRadius.medium,
    width: "100%",
    aspectRatio: 1,
    backgroundColor: Styles.Colours.black87,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    marginBottom: Styles.Layout.Margins.small,
    borderWidth: 0,
    borderColor: "transparent",
    overflow: "hidden"
  },
  checkboxWrapper: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    borderRadius: Styles.Layout.BorderRadius.medium
  },
  checkboxLabel: {
    ...Styles.Text.uppercase,
    ...Styles.Text.h5,
    color: Styles.Colours.black
  },
  checkedImageWrapper: {
    borderWidth: 6,
    borderColor: Styles.Colours.primary
  }
});

export default TouchableCheckboxes;
