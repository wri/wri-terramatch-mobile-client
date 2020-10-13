// @flow

import React, { Component, type ElementProps } from "react";
import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";
import translate, {
  formatCurrency,
  translateContinent,
  translateCountry,
  translateVisibility
} from "../../../../locales";
import Styles from "../../../../styles";
import { OfferRead, PitchRead } from "wri-api";
import Button from "../../../common/button";
import buttonStyles from "../../../../styles/buttons";
import { FONT_FAMILY, fontWeights } from "../../../../styles/text";
import type { Project } from "../../../../utils/models.types";
const locationIcon = require("../../../../assets/icons/profile/location-pin-white.png");

type Props = {|
  ...ElementProps<typeof View>,

  +onPressApply: () => ?number,

  +onPressVisibility: () => ?number,

  +isOwnedByUser?: boolean,

  +isRegisterInterestButtonVisible?: boolean,

  +project: OfferRead | PitchRead,

  +projectType: Project
|};

export default class ProjectHeaderCard extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const {
      onPressApply, // eslint-disable-line
      onPressVisibility, // eslint-disable-line
      project,
      projectType,
      isRegisterInterestButtonVisible,
      isOwnedByUser,
      style,
      ...rest
    } = this.props;
    const projectId = this.props.project?.id ?? null;

    const canRegisterInterest = isOwnedByUser === false && isRegisterInterestButtonVisible;
    return (
      <View {...rest} style={[styles.pitchHeader, style]}>
        <ImageBackground source={{ uri: project.cover_photo }} style={styles.pitchHeaderImg}>
          <View style={styles.overlay} />
          <View style={styles.pitchHeaderContent}>
            <Text style={styles.headerText}>{project.name}</Text>
            <View style={styles.locationWrapper}>
              <Image source={locationIcon} style={styles.locationPin} />
              <Text style={styles.locationBody}>
                {[translateContinent(project.land_continent), translateCountry(project.land_country)]
                  .filter(part => !!part)
                  .join(", ")}
              </Text>
            </View>
            <Text style={styles.headerText}>
              {formatCurrency(project.funding_amount, { minimumFractionDigits: 0 })}
            </Text>
            <Text style={styles.headerBody}>{translate("project.funding.amount")}</Text>
            {projectId !== null && (
              <>
                <Text style={styles.visibilityStatus}>
                  {translate("projectStatus.visibility.status", null, {
                    status:
                      translateVisibility(projectType, this.props.project?.visibility) ??
                      translate("mobile.common.unknown")
                  })}
                </Text>
                {isOwnedByUser && this.props.project.id !== 0 && (
                  <Button
                    title={translate("projectStatus.visibility.update")}
                    style={[buttonStyles.primary, styles.visibilityButton]}
                    onPress={this.props.onPressVisibility}
                  />
                )}
              </>
            )}
          </View>
          {canRegisterInterest && (
            <Button
              title={translate("match.interest.applyFunding")}
              style={[buttonStyles.centeredPrimaryButton, styles.headerButton]}
              onPress={this.props.onPressApply}
            />
          )}
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerText: {
    ...Styles.Text.secondaryH1,
    ...Styles.Text.uppercase
  },
  headerBody: {
    ...Styles.Text.bodyTiny,
    color: Styles.Colours.white
  },
  locationBody: {
    ...Styles.Text.uppercase,
    ...Styles.Text.bodyHero,
    color: Styles.Colours.white
  },
  pitchHeader: {
    position: "relative",
    marginBottom: Styles.Layout.Margins.small
  },
  pitchHeaderImg: {
    width: "100%",
    zIndex: 1
  },
  overlay: {
    zIndex: 2,
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Styles.Colours.black54
  },
  pitchHeaderContent: {
    zIndex: 3,
    justifyContent: "center",
    paddingHorizontal: Styles.Layout.Margins.large,
    paddingTop: Styles.Layout.Margins.large,
    paddingBottom: Styles.Layout.Margins.small
  },
  locationWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Styles.Layout.Margins.tiny
  },
  locationPin: {
    width: 13,
    height: 18,
    marginRight: Styles.Layout.Margins.tiny
  },
  headerButton: {
    backgroundColor: Styles.Colours.secondary,
    marginHorizontal: Styles.Layout.Margins.large,
    marginBottom: Styles.Layout.Margins.medium,
    alignSelf: "stretch",
    zIndex: 3
  },
  visibilityButton: {
    backgroundColor: Styles.Colours.secondary,
    marginBottom: Styles.Layout.Margins.medium,
    marginTop: Styles.Layout.Margins.small,
    zIndex: 3,
    alignSelf: "flex-start"
  },
  visibilityStatus: {
    ...Styles.Text.uppercase,
    fontWeight: fontWeights.regular,
    fontFamily: FONT_FAMILY,
    fontSize: 20,
    color: Styles.Colours.white
  }
});
