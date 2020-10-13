"use strict";

import React, { Component } from "react";
import { View, Text, ViewPropTypes, StyleSheet, Image } from "react-native";
import Styles from "../../../styles";
import PropTypes from "prop-types";
import translate, { formatNumber } from "../../../locales/";

const locationIcon = require("../../../assets/icons/welcome/location.png");

export default class ProjectsInfoCard extends Component {
  render() {
    return (
      <View style={styles.wrapper}>
        {this.props.content && (
          <>
            <Image source={{ uri: this.props.content.image }} style={styles.image} />
            <View style={styles.container}>
              <Text style={[Styles.Text.secondaryH2, Styles.Text.uppercase]}>{this.props.content.project_name}</Text>
              <View style={[Styles.Utilities.flexRow, Styles.Utilities.flexCenter]}>
                <Image source={locationIcon} style={styles.locationPin} resizeMode="contain" />
                <Text style={styles.title}>{this.props.content.project_location}</Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.title}>{translate("landing.numberOfTrees")}</Text>
                <Text style={Styles.Text.h5}>{formatNumber(this.props.content.number_of_trees)}</Text>
                <Text style={styles.title}>{translate("landing.restorationType")}</Text>
                <Text style={Styles.Text.h5}>{this.props.content.restoration_type}</Text>
              </View>
              <Text style={[Styles.Text.body, styles.fillSpace]} ellipsizeMode="tail">
                {this.props.content.description}
              </Text>
            </View>
          </>
        )}
      </View>
    );
  }
}

ProjectsInfoCard.propTypes = {
  ...ViewPropTypes,

  /**
   * The testimonial item information
   */
  content: PropTypes.any
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: Styles.Layout.Margins.small },
  wrapper: {
    backgroundColor: Styles.Colours.white,
    borderRadius: Styles.Layout.BorderRadius.small
  },
  image: {
    width: "100%",
    aspectRatio: 163 / 115,
    alignSelf: "center",
    borderTopLeftRadius: Styles.Layout.BorderRadius.small,
    borderTopRightRadius: Styles.Layout.BorderRadius.small,
    marginBottom: Styles.Layout.Margins.medium
  },
  section: {
    backgroundColor: Styles.Colours.border,
    padding: Styles.Layout.Margins.small,
    marginVertical: Styles.Layout.Margins.small,
    borderRadius: Styles.Layout.BorderRadius.small
  },
  locationPin: {
    width: 10,
    marginHorizontal: Styles.Layout.Margins.small,
    marginRight: Styles.Layout.Margins.small
  },
  title: {
    ...Styles.Text.h5,
    color: Styles.Colours.black
  },
  fillSpace: { height: "100%" }
});
