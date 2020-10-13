//@flow

import type { AsyncState } from "../../../../redux/redux.types";
import React, { Component } from "react";
import { View, StyleSheet, Text, Image, Linking } from "react-native";
import { OrganisationRead } from "wri-api";
import Touchable from "../../../common/touchable";
import Styles from "../../../../styles";

import FACEBOOK_ICON from "../../../../assets/icons/projects/facebook/facebook.png";
import INSTAGRAM_ICON from "../../../../assets/icons/projects/instagram/instagram.png";
import TWITTER_ICON from "../../../../assets/icons/projects/twitter/twitter.png";
import LINKEDIN_ICON from "../../../../assets/icons/projects/linkedin/linkedin.png";
import translate, { translateCountry } from "../../../../locales";

type Props = {|
  organisationState: AsyncState<OrganisationRead>
|};

export default class OrganisationDetails extends Component<Props> {
  renderSocialIcon = (img: number, social: string) => {
    if (!social) {
      return null;
    }

    return (
      <Touchable
        accessibilityRole={"button"}
        onPress={() =>
          Linking.canOpenURL(social)
            .then(supported => {
              if (!supported) {
                return console.warn("Cannot handle URL: " + social);
              } else {
                return Linking.openURL(social);
              }
            })
            .catch(err => console.error("An error occurred", err))
        }
      >
        <View style={styles.socialIconView}>
          <Image source={img} style={styles.socialIcon} />
        </View>
      </Touchable>
    );
  };

  renderWebsite = (organisation: OrganisationRead) => {
    const website = organisation.website;

    if (!website) {
      return null;
    }

    return (
      <View>
        <Text style={styles.viewTitleText}>{translate("project.organisationDetails.website")}</Text>
        <Touchable
          accessibilityRole={"button"}
          onPress={() => Linking.openURL(website).catch(err => console.error("An error occurred", err))}
        >
          <Text style={styles.viewSubtitleText}>{website}</Text>
        </Touchable>
      </View>
    );
  };

  render() {
    const organisation = this.props.organisationState.data;

    if (!organisation) {
      return null;
    }

    return (
      <View style={styles.info}>
        <Text style={styles.viewTitleText}>{translate("project.organisationDetails.name")}</Text>
        <Text style={styles.viewSubtitleText}>{organisation.name}</Text>
        <Text style={styles.viewTitleText}>{translate("project.organisationDetails.location")}</Text>
        <Text style={styles.viewSubtitleText}>
          {[organisation.city, organisation.state, translateCountry(organisation.country)]
            .filter(part => !!part)
            .join(", ")}
        </Text>
        {this.renderWebsite(organisation)}
        <View style={styles.socialIconRow}>
          {this.renderSocialIcon(FACEBOOK_ICON, organisation.facebook ?? "")}
          {this.renderSocialIcon(TWITTER_ICON, organisation.twitter ?? "")}
          {this.renderSocialIcon(INSTAGRAM_ICON, organisation.instagram ?? "")}
          {this.renderSocialIcon(LINKEDIN_ICON, organisation.linkedin ?? "")}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  info: {
    paddingTop: Styles.Layout.Margins.small,
    paddingBottom: Styles.Layout.Margins.medium
  },
  viewTitleText: {
    ...Styles.Text.h4,
    fontSize: 20,
    color: Styles.Colours.brownGrey
  },
  viewSubtitleText: {
    ...Styles.Text.h4,
    fontSize: 20,
    paddingBottom: Styles.Layout.Margins.small
  },
  socialIconRow: {
    flexDirection: "row"
  },
  socialIconView: {
    width: 40,
    height: 40,
    borderColor: Styles.Colours.black8,
    borderWidth: 1.2,
    marginHorizontal: Styles.Layout.Margins.small,
    borderRadius: 5,
    padding: Styles.Layout.Margins.small,
    alignItems: "center",
    justifyContent: "center"
  },
  socialIcon: {
    width: 20,
    height: 20,
    tintColor: Styles.Colours.brownGrey
  }
});
