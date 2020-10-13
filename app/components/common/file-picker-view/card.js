// @flow

import type { File } from "../../../utils/models.types";
import React, { Component } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import Styles from "../../../styles";

const chevronRightIcon = require("../../../assets/icons/profile/chevron-right.png");
const documentIcon = require("../../../assets/icons/profile/document.png");
const awardIcon = require("../../../assets/icons/profile/award.png");
const removeIcon = require("../../../assets/icons/profile/remove.png");

type Props = {|
  +document: File,
  +icon?: ?number,
  +onDeletePressed?: ?() => void,
  +onPress?: ?() => void
|};

export default class DocumentCard extends Component<Props> {
  render() {
    return (
      <TouchableOpacity style={styles.card} onPress={this.props.onPress} accessibilityRole={"button"}>
        <View style={Styles.Utilities.flexRow}>
          <View style={styles.cardIconWrapper}>
            <Image
              source={
                this.props.icon ? this.props.icon : this.props.document.type === "award" ? awardIcon : documentIcon
              }
            />
          </View>
          <View style={styles.cardText}>
            <Text style={Styles.Text.h3}>{this.props.document.name}</Text>
          </View>
        </View>
        {!!this.props.onDeletePressed && (
          <TouchableOpacity onPress={this.props.onDeletePressed} accessibilityRole={"button"}>
            <Image source={removeIcon} />
          </TouchableOpacity>
        )}
        {!!this.props.onPress && <Image source={chevronRightIcon} />}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Styles.Colours.white,
    ...Styles.Containers.cardShadow,
    marginHorizontal: Styles.Layout.Margins.tiny,
    marginVertical: Styles.Layout.Margins.small,
    padding: Styles.Layout.Margins.medium,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    borderRadius: Styles.Layout.BorderRadius.medium
  },
  cardIconWrapper: {
    borderColor: Styles.Colours.border,
    borderWidth: 2,
    borderRadius: Styles.Layout.BorderRadius.medium,
    paddingVertical: Styles.Layout.Margins.small,
    paddingHorizontal: Styles.Layout.Margins.medium,
    height: 62,
    width: 62,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginRight: Styles.Layout.Margins.small
  },
  cardText: {
    flex: 1,
    justifyContent: "center"
  }
});
