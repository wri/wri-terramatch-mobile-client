"use strict";

import React, { Component } from "react";
import { View, Text, ViewPropTypes, StyleSheet, Image } from "react-native";
import Styles from "../../../styles";
import PropTypes from "prop-types";

export default class TestimonialCard extends Component {
  render() {
    return (
      <View style={styles.wrapper}>
        {this.props.content && (
          <>
            <Image source={{ uri: this.props.content.avatar }} style={styles.image} />
            <Text style={[Styles.Text.secondaryH2, Styles.Text.centered, Styles.Text.uppercase]}>
              {this.props.content.name}
            </Text>
            <Text style={[Styles.Text.h3, Styles.Text.centered, Styles.Text.uppercase]}>
              {this.props.content.job_role}
            </Text>
            <Text style={[Styles.Text.body, Styles.Text.centered]}>{this.props.content.quote}</Text>
          </>
        )}
      </View>
    );
  }
}

TestimonialCard.propTypes = {
  ...ViewPropTypes,

  /**
   * The testimonial item information
   */
  content: PropTypes.any
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Styles.Colours.white,
    padding: Styles.Layout.Margins.small
  },
  image: {
    width: 85,
    height: 85,
    borderRadius: 85 / 2,
    alignSelf: "center",
    marginBottom: Styles.Layout.Margins.medium
  }
});
