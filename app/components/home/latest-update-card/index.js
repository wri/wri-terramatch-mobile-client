"use strict";

import React, { Component } from "react";
import { Text, ViewPropTypes, StyleSheet, Image, View } from "react-native";
import { getLocale } from "../../../locales";
import Styles from "../../../styles";
import Button from "../../common/button";

import { getTranslation } from "../../../utils/wp";
import translate from "../../../locales/";
import PropTypes from "prop-types";

export default class LatestUpdateCard extends Component {
  render() {
    const langCode = getLocale();

    return (
      <View style={styles.wrapper} accessibilityRole={"button"} onPress={this.props.onPress}>
        {this.props.content && (
          <>
            <Image source={{ uri: this.props.content.head_image }} style={styles.image} />

            <View style={styles.innerContent}>
              <Text style={styles.intro}>{translate("landing.news.latest")}</Text>

              <Text style={[Styles.Text.secondaryH2, Styles.Text.centered]}>
                {getTranslation(langCode, this.props.content.new_item_title)}
              </Text>

              <Text style={[Styles.Text.h3, Styles.Text.centered, Styles.Text.uppercase]}>
                {this.props.content.subtitle}
              </Text>

              <Text style={[Styles.Text.body, Styles.Text.centered, styles.spaceTop]}>
                {this.props.content.preview_text}
              </Text>

              <Button
                style={[Styles.Buttons.centeredPrimaryButton, styles.spaceTop]}
                disabledStyle={Styles.Buttons.primaryDisabled}
                onPress={this.props.onPress}
                title={translate("common.readMore")}
              />
            </View>
          </>
        )}
      </View>
    );
  }
}

LatestUpdateCard.propTypes = {
  ...ViewPropTypes,

  /**
   * The news item information
   */
  content: PropTypes.any
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Styles.Colours.white,
    marginHorizontal: -Styles.Layout.Margins.medium
  },
  innerContent: {
    padding: Styles.Layout.Margins.medium
  },
  image: {
    width: "100%",
    aspectRatio: 16 / 9,
    marginBottom: Styles.Layout.Margins.medium
  },
  intro: {
    ...Styles.Text.primaryFontBody,
    ...Styles.Text.centered,
    ...Styles.Text.uppercase,
    fontWeight: "bold",
    color: Styles.Colours.black87
  },
  spaceTop: {
    marginTop: Styles.Layout.Margins.medium
  }
});
