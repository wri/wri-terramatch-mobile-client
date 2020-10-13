"use strict";

import React, { Component } from "react";
import { View, ViewPropTypes, StyleSheet, Image } from "react-native";
import PropTypes from "prop-types";
import partnerLogos from "./images";

export default class PartnerCard extends Component {
  render() {
    return (
      <View>
        {this.props.content && (
          <>
            <Image
              source={partnerLogos[this.props.content.partner_image_name]}
              style={styles.logo}
              accessible={true}
              accessibilityLabel={this.props.content.partner_website}
            />
          </>
        )}
      </View>
    );
  }
}

PartnerCard.propTypes = {
  ...ViewPropTypes,

  /**
   * The news item information
   */
  content: PropTypes.any
};

const styles = StyleSheet.create({
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain"
  }
});
