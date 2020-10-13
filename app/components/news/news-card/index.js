"use strict";

import React, { Component } from "react";
import { Text, ViewPropTypes, StyleSheet, Image } from "react-native";
import { getLocale } from "../../../locales/";
import Styles from "../../../styles";
import Touchable from "../../common/touchable";

import { getTranslation } from "../../../utils/wp";
import PropTypes from "prop-types";

export default class NewsCard extends Component {
  render() {
    const langCode = getLocale();

    return (
      <Touchable style={styles.newsWrapper} accessibilityRole={"button"} onPress={this.props.onPress}>
        {this.props.content && (
          <>
            <Image source={{ uri: this.props.content.head_image }} style={styles.image} />

            <Text style={[Styles.Text.secondaryH2, Styles.Text.centered, Styles.Text.uppercase]}>
              {getTranslation(langCode, this.props.content.new_item_title)}
            </Text>

            <Text style={[Styles.Text.h3, Styles.Text.centered, Styles.Text.uppercase]}>
              {this.props.content.subtitle}
            </Text>

            <Text style={[Styles.Text.body, Styles.Text.centered]}>{this.props.content.preview_text}</Text>
          </>
        )}
      </Touchable>
    );
  }
}

NewsCard.propTypes = {
  ...ViewPropTypes,

  /**
   * The news item information
   */
  content: PropTypes.any
};

const styles = StyleSheet.create({
  newsWrapper: {
    backgroundColor: Styles.Colours.white,
    paddingHorizontal: Styles.Layout.Margins.medium,
    padding: Styles.Layout.Margins.medium
  },
  image: {
    width: 85,
    height: 85,
    borderRadius: 85 / 2,
    alignSelf: "center",
    marginBottom: Styles.Layout.Margins.medium
  }
});
