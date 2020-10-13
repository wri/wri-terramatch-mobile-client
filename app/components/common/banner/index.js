"use strict";

import React, { Component } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import Styles from "../../../styles";
import PropTypes from "prop-types";

class Banner extends Component {
  render() {
    return (
      <View style={styles.banner}>
        <Image
          style={this.props.wideImage ? [styles.icon, styles.wideIcon] : styles.icon}
          source={this.props.imageSource}
        />
        <Text style={styles.bannerText}>{this.props.header}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  banner: {
    paddingVertical: Styles.Layout.Margins.medium,
    paddingHorizontal: Styles.Layout.Margins.massive,
    justifyContent: "center",
    alignContent: "center",
    marginVertical: Styles.Layout.Margins.small,
    marginHorizontal: -Styles.Layout.Margins.medium
  },
  icon: {
    height: 100,
    width: 100,
    alignSelf: "center",
    marginBottom: Styles.Layout.Margins.tiny
  },
  wideIcon: {
    width: 178
  },
  bannerText: {
    ...Styles.Text.body,
    ...Styles.Text.centered,
    ...Styles.Text.primaryFontBody
  }
});

Banner.propTypes = {
  header: PropTypes.string.isRequired,
  imageSource: PropTypes.any.isRequired,
  wideImage: PropTypes.bool
};

export default Banner;
