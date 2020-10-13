//@flow

import type { ProjectRead } from "../../../api/wri/wri.types.js";
import React, { Component } from "react";
import { View, Text, Image, StyleSheet, Platform } from "react-native";
import Styles from "../../../styles";
import Layout from "../../../styles/layout";
import Touchable from "../../common/touchable";
import translate, { formatCurrency, translateContinent, translateCountry, translateVisibility } from "../../../locales";
import colours from "../../../styles/colours";

const locationIcon = require("../../../assets/icons/cards/location/drawable-xxxhdpi/ic_location_on_black_24dp.png");

type Props = {
  /**
   * The project information
   */
  project: ProjectRead,
  styles?: any,
  isOwnedByUser?: ?boolean,
  isCompatiblityHidden: boolean,
  onPress?: ?() => void
};

export default class ProjectCard extends Component<Props> {
  renderIndicator(visibility: string) {
    let styleClasses;
    let badgeText;

    if (visibility === "draft") {
      styleClasses = styles.indicatorWrapper;
      badgeText = translate("common.draft");
    } else if (visibility === "finished" || visibility === "fully_invested_funded" || visibility === "archived") {
      styleClasses = [styles.indicatorWrapper, styles.shadowView];
      badgeText = translateVisibility(this.props.project.type, visibility) ?? translate("common.draft");
    } else if (this.props.isOwnedByUser) {
      styleClasses = styles.indicatorWrapper;
      badgeText = translateVisibility(this.props.project.type, visibility) ?? translate("common.draft");
    } else {
      return null;
    }
    return (
      <View style={styleClasses}>
        <View style={styles.statusBadge}>
          <Text style={styles.statusBadgeText}>{badgeText}</Text>
        </View>
      </View>
    );
  }

  render() {
    let avatarUri = null;
    let compatibilityScore = null;
    let visibility = null;

    switch (this.props.project.type) {
      case "pitch": {
        avatarUri = this.props.project.data.avatar;
        compatibilityScore = this.props.project.data.compatibility_score;
        visibility = this.props.project.data.visibility;
        break;
      }
      case "offer": {
        avatarUri = this.props.project.data.avatar;
        compatibilityScore = this.props.project.data.compatibility_score;
        visibility = this.props.project.data.visibility;
        break;
      }
      case "pitch_draft": {
        avatarUri = null; // there is no avatar field on the draft project models
        compatibilityScore = null; // there is no compatibility score field on the draft project models
        visibility = "draft";
        break;
      }
      case "offer_draft": {
        avatarUri = null; // there is no avatar field on the draft project models
        compatibilityScore = null; // there is no compatibility score field on the draft project models
        visibility = "draft";
        break;
      }
      default: {
        // eslint-disable-next-line babel/no-unused-expressions
        (this.props.project.type: empty);
        break;
      }
    }

    const projectData = this.props.project.data;

    return (
      <View style={[styles.mainView, this.props.styles]}>
        <Touchable accessibilityRole="none" onPress={this.props.onPress}>
          <View style={styles.topView}>
            {!projectData.cover_photo ? (
              <View style={styles.coverImagePlaceholder} />
            ) : (
              <Image
                style={styles.coverImage}
                accessible={true}
                accessibilityLabel={translate("mobile.accessibility.projectCard.cover_image", "Cover Image")}
                source={{ uri: projectData.cover_photo }}
              />
            )}
            <View style={styles.logoView}>
              {!avatarUri ? (
                <View style={styles.logoImagePlaceholder} />
              ) : (
                <Image
                  style={styles.logoImage}
                  accessible={true}
                  accessibilityLabel={translate("mobile.accessibility.projectCard.avatar", "Avatar")}
                  source={{ uri: avatarUri }}
                />
              )}
            </View>
          </View>
          <View style={styles.midView}>
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>{projectData.name}</Text>
            </View>
            <View style={styles.infoContainer}>
              <View style={styles.projectLocationContainer}>
                <View style={styles.projectInfoGraphic}>
                  <Image style={styles.projectLocationImg} source={locationIcon} />
                </View>
                <Text style={styles.subText}>
                  {[translateContinent(projectData.land_continent), translateCountry(projectData.land_country)]
                    .filter(part => !!part)
                    .join(", ")}
                </Text>
              </View>
            </View>
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionText} ellipsizeMode={"tail"} numberOfLines={3}>
                {projectData.description}
              </Text>
            </View>
          </View>
          <View style={styles.bottomViewContainer}>
            <View style={styles.bottomViewFunding}>
              <Text style={styles.bottomViewLabelText}>
                {translate("mobile.projectCard.funding_amount", "Funding Amount")}
              </Text>
              <Text style={Styles.Text.secondaryH2}>
                {formatCurrency(projectData.funding_amount, { minimumFractionDigits: 0 })}
              </Text>
            </View>
            {compatibilityScore === null || this.props.isCompatiblityHidden ? null : (
              <View style={styles.bottomViewCompatibility}>
                <Text style={styles.bottomViewLabelText}>
                  {translate("mobile.projectCard.compatibility", "Compatibility")}
                </Text>
                <Text style={Styles.Text.secondaryH2}>{compatibilityScore}% </Text>
              </View>
            )}
          </View>
          {visibility ? this.renderIndicator(visibility) : null}
        </Touchable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    marginBottom: Layout.Margins.medium,
    minHeight: 350,
    backgroundColor: Styles.Colours.white,
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: colours.black,
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
          height: 1,
          width: 1
        }
      },
      android: {
        shadowOffset: { width: 1, height: 1 },
        shadowColor: colours.black,
        shadowOpacity: 0.8,
        elevation: 2
      }
    })
  },
  topView: {
    width: "100%",
    height: 150,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    overflow: "hidden"
  },
  midView: {
    minHeight: 125
  },
  logoView: {
    borderRadius: Layout.Margins.small,
    width: 70,
    height: 70,
    marginLeft: Layout.Margins.medium,
    marginTop: 55,
    position: "absolute"
  },
  bottomViewContainer: {
    flexDirection: "row",
    height: 75,
    borderTopColor: Styles.Colours.tableDivider,
    borderTopWidth: 1
  },
  bottomViewFunding: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  bottomViewCompatibility: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderLeftColor: Styles.Colours.tableDivider,
    borderLeftWidth: 1
  },
  projectLocationContainer: {
    flexDirection: "row",
    width: "40%",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  projectInfoGraphic: {
    width: 30,
    height: 30,
    marginLeft: Layout.Margins.small,
    paddingLeft: Layout.Margins.small,
    marginRight: 0,
    justifyContent: "center",
    alignItems: "center"
  },
  projectLocationImg: {
    height: 25,
    width: 25
  },
  infoContainer: {
    flexDirection: "row"
  },
  titleContainer: {
    marginHorizontal: Layout.Margins.small,
    marginTop: Layout.Margins.small
  },
  descriptionContainer: {
    marginHorizontal: Layout.Margins.medium,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    height: 75
  },
  coverImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10
  },
  coverImagePlaceholder: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    backgroundColor: Styles.Colours.lightGrey
  },
  logoImage: {
    width: "100%",
    resizeMode: "center",
    aspectRatio: 1,
    borderRadius: Layout.Margins.small
  },
  logoImagePlaceholder: {
    width: "100%",
    height: "100%",
    borderRadius: Layout.Margins.small,
    backgroundColor: Styles.Colours.black38
  },
  descriptionText: {
    flex: 1,
    flexWrap: "wrap",
    flexShrink: 1,
    ...Styles.Text.bodyHero,
    color: Styles.Colours.bodyHero,
    fontSize: 17,
    alignSelf: "flex-start",
    marginVertical: Layout.Margins.tiny,
    paddingBottom: Layout.Margins.tiny
  },
  bottomViewLabelText: {
    ...Styles.Text.uppercase,
    ...Styles.Text.bodyHero,
    fontSize: 17
  },
  subText: {
    ...Styles.Text.bodyHero,
    ...Styles.Text.uppercase,
    paddingLeft: Layout.Margins.tiny,
    fontSize: 14
  },
  titleText: {
    ...Styles.Text.secondaryH2,
    ...Styles.Text.uppercase,
    marginLeft: Layout.Margins.small
  },
  shadowView: {
    width: "100%",
    height: 150,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    backgroundColor: Styles.Colours.shadow,
    position: "absolute"
  },
  indicatorWrapper: {
    borderRadius: Layout.Margins.small,
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: 0
  },
  statusBadge: {
    backgroundColor: Styles.Colours.secondary,
    paddingHorizontal: Styles.Layout.Margins.medium,
    borderRadius: Styles.Layout.BorderRadius.large,
    position: "absolute",
    top: 12,
    right: 10,
    zIndex: 1
  },
  statusBadgeText: {
    ...Styles.Text.h5,
    ...Styles.Text.uppercase,
    color: Styles.Colours.black
  }
});
