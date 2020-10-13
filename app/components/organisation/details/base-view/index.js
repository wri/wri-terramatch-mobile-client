// @flow

import type { ProjectRead, ProjectDraftRead } from "../../../../api/wri/wri.types";
import type { AsyncState } from "../../../../redux/redux.types.js";
import type { PendingTeamMember } from "../../../../redux/wri-api/organisations";
import React, { Component, type ElementConfig, type Node } from "react";
import { View, Text, Image, ImageBackground, StyleSheet, Linking, FlatList } from "react-native";
import Moment from "moment";
import {
  DraftDataReadOffer,
  DraftDataReadPitch,
  DraftReadAll,
  OfferReadAll,
  OrganisationDocumentVersionReadAll,
  OrganisationRead,
  OrganisationVersionReadAll,
  PitchRead,
  PitchVersionReadAll,
  TeamMemberReadAll,
  UserReadAll
} from "wri-api";
import Styles from "../../../../styles/";
import { IsSmallDevice } from "../../../../styles/layout";
import ProjectCard from "../../../projects/projects-card";
import Banner from "../../../common/banner";
import translate, { translateAccountType, translateCountry, translateOrganisationType } from "../../../../locales/";
import { findMostRecentOrganisationVersion } from "../../../../api/wri/helpers";
import LoadingIndicator from "../../../common/loading-indicator";
import DocumentList from "../../../projects/details/document-list";
import ContactList from "../../../projects/details/contact-list";
import TabView, { type TabViewItem } from "../../../common/tab-view";
import Touchable from "../../../common/touchable";
import { getValidUrl } from "../../../../utils/text";

const locationIcon = require("../../../../assets/icons/profile/location-pin-white.png");
const facebookIcon = require("../../../../assets/icons/projects/facebook/facebook.png");
const twitterIcon = require("../../../../assets/icons/projects/twitter/twitter.png");
const linkedinIcon = require("../../../../assets/icons/projects/linkedin/linkedin.png");
const instagramIcon = require("../../../../assets/icons/projects/instagram/instagram.png");
const websiteIcon = require("../../../../assets/icons/projects/website/website.png");

const projectsBannerIcon = require("../../../../assets/icons/projects/projects.png");

//All TabView keys
export type TabName = "about" | "projects" | "team" | "docs";

type Props = {|
  ...ElementConfig<typeof View>,

  +selectedTab?: TabName,
  /**
   * Document information displayed in the Documents tab
   */
  +documentsState: AsyncState<OrganisationDocumentVersionReadAll>,

  /**
   * Draft project information displayed in the projects tab
   */
  +draftOffers?: AsyncState<DraftReadAll>,

  /**
   * Draft project information displayed in the projects tab
   */
  +draftPitches?: AsyncState<DraftReadAll>,

  /**
   * team member information displayed in the team member tab
   */
  +membersState: AsyncState<TeamMemberReadAll>,
  /**
   * Project information displayed in the projects tab
   */
  +offersState: AsyncState<OfferReadAll>,

  +onContactPress?: ?(PendingTeamMember) => void,
  +onProjectPress?: ?(ProjectRead) => void,

  /**
   * Project information displayed in the projects tab
   */
  +pitchesState: AsyncState<PitchVersionReadAll>,
  /**
   * team users information displayed in the team member tab
   */
  +usersState: AsyncState<UserReadAll>,

  /**
   * organisation information displayed in the header
   */
  +versionsState: AsyncState<OrganisationVersionReadAll>,
  +isOwnedByUser: boolean
|};

/**
 * Base organisation component accepting async state for all org-related data as props
 *
 * Responsible for showing loading states, errors, etc. If these are not needed then this component is simply rendered
 * with all async state pre-set with data.
 */

let tabs: Array<TabViewItem>;

export default class OrganisationProfile extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  getDefaultTab = (): number => {
    const tab = tabs.findIndex(item => item.key === this.props.selectedTab);
    return tab >= 0 ? tab : 0;
  };

  _handleDocumentPressed = (url: string) => {
    Linking.openURL(url);
  };

  calculateYearOfOperation = (foundedDate: ?string): ?number => {
    if (foundedDate) {
      return Moment().diff(foundedDate ?? "", "years");
    } else {
      return null;
    }
  };

  renderHeader = (organisationData: ?OrganisationRead): Node => {
    if (!organisationData) {
      return null;
    }
    const yearsOfOperation = this.calculateYearOfOperation(organisationData?.founded_at) ?? 0;

    return (
      <View style={styles.organisationHeader}>
        <ImageBackground source={{ uri: organisationData.cover_photo }} style={styles.organisationHeaderImg}>
          <View style={styles.overlay} />

          <View style={styles.organisationHeaderContent}>
            <Image style={styles.organisationHeaderAvatar} source={{ uri: organisationData.avatar }} />
            <Text style={styles.headerText}>{organisationData.name ?? translate("common.loading")}</Text>

            <View style={styles.locationWrapper}>
              <Image source={locationIcon} style={styles.locationPin} />
              <Text style={styles.locationBody}>
                {organisationData.city}, {translateCountry(organisationData.country)}
              </Text>
            </View>

            <Text style={styles.headerBody}>
              {translateAccountType(organisationData.category)} | {translateOrganisationType(organisationData.type)}
            </Text>

            <Text style={styles.subheaderText}>
              {yearsOfOperation > 0
                ? translate("organisation.yearsOfOperation", null, { count: yearsOfOperation })
                : translate("organisation.lessThanOneYearOfOperation")}
            </Text>

            {/*
                  * todo: Implement in v.1.1
                  <View style={Styles.Utilities.flexRow}>
                  <Text style={styles.headerBody}>stars </Text>
                  <Text style={styles.headerBody}>from 10 Funders</Text>
                </View>

                <View style={Styles.Utilities.flexRow}>
                  <View style={[styles.badge]}>
                    <Text style={[styles.badgeText, Styles.Text.bodyTiny]}>12 Years of operation</Text>
                  </View>
                  <View style={[styles.badge, styles.badgeSecondary]}>
                    <Text style={[styles.badgeText, Styles.Text.bodyTiny]}>34 projects funded</Text>
                  </View>
                </View>
                */}
          </View>
        </ImageBackground>
      </View>
    );
  };

  renderProjects = (type: string): Node => {
    const pitches = this.props.pitchesState.data ?? [];
    const draftPitches = this.props.draftPitches?.data ?? [];
    const draftOffers = this.props.draftOffers?.data ?? [];
    const offers = this.props.offersState.data ?? [];
    const projects: Array<ProjectRead> =
      type === "pitches"
        ? [
            ...pitches.map(item => ({
              type: "pitch",
              data: item.data ?? new PitchRead()
            }))
          ]
        : [
            ...offers.map(item => ({
              type: "offer",
              data: item
            }))
          ];
    const draftProjects: Array<ProjectDraftRead> =
      type === "pitches"
        ? [
            ...draftPitches.map(item => ({
              type: "pitch_draft",
              data: item.data?.pitch ?? new DraftDataReadPitch(),
              draftId: item.id ?? 0
            }))
          ]
        : [
            ...draftOffers.map(item => ({
              type: "offer_draft",
              data: item.data?.offer ?? new DraftDataReadOffer(),
              draftId: item.id ?? 0
            }))
          ];
    const emptyStateMessage = type === "pitches" ? "noPitches" : "noOffers";

    const isFetching = this.props.pitchesState.isFetching || this.props.offersState.isFetching;

    return (
      <>
        {isFetching && <LoadingIndicator />}
        <FlatList
          style={styles.tabList}
          contentContainerStyle={styles.tabListContainer}
          data={[...projects, ...draftProjects]}
          renderItem={({ item }) => (
            <ProjectCard
              onPress={this.props.onProjectPress ? this.props.onProjectPress.bind(this, item) : null}
              project={item}
              isCompatiblityHidden={true}
              isOwnedByUser={this.props.isOwnedByUser}
            />
          )}
          scrollEnabled={false}
          ListEmptyComponent={() => (
            <Banner imageSource={projectsBannerIcon} header={translate(`organisation.${emptyStateMessage}`)} />
          )}
        />
      </>
    );
  };

  renderSocialMedia = (organisation: ?OrganisationRead): Node => {
    return (
      <View style={styles.socialMedia}>
        {!!organisation?.website && (
          <Touchable
            accessibilityRole={"link"}
            onPress={() =>
              Linking.openURL(getValidUrl(organisation?.website) ?? "").catch(err =>
                console.error("An error occurred", err)
              )
            }
          >
            <Image style={styles.icon} source={websiteIcon} />
          </Touchable>
        )}
        {!!organisation?.linkedin && (
          <Touchable
            accessibilityRole={"link"}
            onPress={() =>
              Linking.openURL(getValidUrl(organisation?.linkedin) ?? "").catch(err =>
                console.error("An error occurred", err)
              )
            }
          >
            <Image style={styles.icon} source={linkedinIcon} />
          </Touchable>
        )}
        {!!organisation?.instagram && (
          <Touchable
            accessibilityRole={"link"}
            onPress={() =>
              Linking.openURL(getValidUrl(organisation?.instagram) ?? "").catch(err =>
                console.error("An error occurred", err)
              )
            }
          >
            <Image style={styles.icon} source={instagramIcon} />
          </Touchable>
        )}
        {!!organisation?.facebook && (
          <Touchable
            accessibilityRole={"link"}
            onPress={() =>
              Linking.openURL(getValidUrl(organisation?.facebook) ?? "").catch(err =>
                console.error("An error occurred", err)
              )
            }
          >
            <Image style={styles.icon} source={facebookIcon} />
          </Touchable>
        )}
        {!!organisation?.twitter && (
          <Touchable
            accessibilityRole={"link"}
            onPress={() =>
              Linking.openURL(getValidUrl(organisation?.twitter) ?? "").catch(err =>
                console.error("An error occurred", err)
              )
            }
          >
            <Image style={styles.icon} source={twitterIcon} />
          </Touchable>
        )}
      </View>
    );
  };
  renderOrganisationAbout = (organisationData: ?OrganisationRead): Node => {
    return (
      <>
        <Text style={Styles.Text.body}>{organisationData?.description ?? ""}</Text>
        {(organisationData?.website ||
          organisationData?.linkedin ||
          organisationData?.instagram ||
          organisationData?.facebook ||
          organisationData?.twitter) && (
          <Text style={[Styles.Text.h3, styles.spacing]}>{translate("organisation.followSocialMedia")}</Text>
        )}
        {this.renderSocialMedia(organisationData)}
      </>
    );
  };

  renderTabContents = ({ route }: any, organisationData: ?OrganisationRead): Node => {
    switch (route.key) {
      case "about":
        return (
          <View style={styles.tabContent}>
            <Text style={Styles.Text.h1}>{route.title}</Text>
            {this.renderOrganisationAbout(organisationData)}
          </View>
        );
      case "pitches":
        return (
          <View style={styles.tabContent}>
            <Text style={Styles.Text.h1}>{route.title}</Text>
            {this.renderProjects("pitches")}
          </View>
        );
      case "offers":
        return (
          <View style={styles.tabContent}>
            <Text style={Styles.Text.h1}>{route.title}</Text>
            {this.renderProjects("offers")}
          </View>
        );
      case "team":
        return (
          <View style={styles.tabContent}>
            <Text style={Styles.Text.h1}>{route.title}</Text>
            <ContactList
              style={styles.tabList}
              contentContainerStyle={styles.tabListContainer}
              membersState={this.props.membersState}
              usersState={this.props.usersState}
              scrollEnabled={false}
              translations={{
                empty: translate("organisation.noTeamMembers", "This organisation doesn’t have any user yet")
              }}
              onContactPressed={this.props.onContactPress}
            />
          </View>
        );
      case "docs":
        return (
          <View style={styles.tabContent}>
            <Text style={Styles.Text.h1}>{route.title}</Text>
            <DocumentList
              style={styles.tabList}
              contentContainerStyle={styles.tabListContainer}
              documents={{ type: "organisation", state: this.props.documentsState }}
              scrollEnabled={false}
              translations={{
                empty: translate("organisation.noDocuments", "This organisation doesn’t have any documents yet")
              }}
            />
          </View>
        );
      default:
        return (
          <View style={styles.tabContent}>
            <Text style={Styles.Text.h1}>{route.title}</Text>
          </View>
        );
    }
  };

  render() {
    const orgVersion = findMostRecentOrganisationVersion(this.props.versionsState.data ?? []);
    const orgDetails = orgVersion?.data;
    switch (orgDetails?.category) {
      case "both":
        tabs = [
          { key: "about", title: translate("organisation.about") },
          { key: "pitches", title: translate("organisation.pitches") },
          { key: "offers", title: translate("organisation.offers") },
          { key: "team", title: translate("organisation.team") },
          { key: "docs", title: translate("organisation.documents") }
        ];
        break;
      case "developer":
        tabs = [
          { key: "about", title: translate("organisation.about") },
          { key: "pitches", title: translate("organisation.pitches") },
          { key: "team", title: translate("organisation.team") },
          { key: "docs", title: translate("organisation.documents") }
        ];
        break;
      case "funder":
        tabs = [
          { key: "about", title: translate("organisation.about") },
          { key: "offers", title: translate("organisation.offers") },
          { key: "team", title: translate("organisation.team") },
          { key: "docs", title: translate("organisation.documents") }
        ];
        break;
      default:
        tabs = [
          { key: "about", title: translate("organisation.about") },
          { key: "pitches", title: translate("organisation.pitches") },
          { key: "offers", title: translate("organisation.offers") },
          { key: "team", title: translate("organisation.team") },
          { key: "docs", title: translate("organisation.documents") }
        ];
        break;
    }

    return (
      <View style={this.props.style}>
        {this.renderHeader(orgDetails)}
        <TabView
          selectedTab={this.getDefaultTab()}
          navigationState={{ routes: tabs }}
          renderScene={scene => this.renderTabContents(scene, orgDetails)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerText: {
    ...Styles.Text.secondaryH1,
    ...Styles.Text.uppercase
  },
  subheaderText: {
    ...Styles.Text.bodyHero,
    color: Styles.Colours.white
  },
  headerBody: {
    ...Styles.Text.uppercase,
    ...Styles.Text.bodyHero,
    color: Styles.Colours.white
  },
  locationBody: {
    ...Styles.Text.uppercase,
    ...Styles.Text.bodyTiny,
    color: Styles.Colours.white
  },
  organisationHeader: {
    position: "relative",
    marginBottom: Styles.Layout.Margins.medium
  },
  organisationHeaderImg: {
    width: "100%",
    zIndex: 1
  },
  locationPin: {
    width: 13,
    height: 18,
    marginRight: Styles.Layout.Margins.tiny
  },
  overlay: {
    zIndex: 2,
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Styles.Colours.black54
  },
  organisationHeaderContent: {
    zIndex: 3,
    paddingVertical: IsSmallDevice ? Styles.Layout.Margins.small : Styles.Layout.Margins.medium,
    paddingHorizontal: IsSmallDevice ? Styles.Layout.Margins.medium : Styles.Layout.Margins.large
  },
  organisationHeaderAvatar: {
    width: 62,
    resizeMode: "center",
    aspectRatio: 1,
    borderRadius: Styles.Layout.BorderRadius.medium,
    marginBottom: Styles.Layout.Margins.medium
  },
  locationWrapper: {
    ...Styles.Utilities.flexRow,
    alignItems: "center",
    marginBottom: Styles.Layout.Margins.tiny
  },
  tabContent: {
    paddingHorizontal: IsSmallDevice ? Styles.Layout.Margins.small : Styles.Layout.Margins.medium
  },
  tabList: {
    paddingTop: Styles.Layout.Margins.small,
    marginHorizontal: -Styles.Layout.Margins.medium
  },
  tabListContainer: {
    paddingHorizontal: Styles.Layout.Margins.medium,
    paddingBottom: Styles.Layout.Margins.medium
  },
  spacing: {
    marginTop: Styles.Layout.Margins.medium
  },
  socialMedia: {
    flex: 1,
    marginTop: Styles.Layout.Margins.small,
    height: 30,
    flexDirection: "row"
  },
  icon: {
    marginEnd: Styles.Layout.Margins.small
  }
  // todo: implement in v.1.1
  // badge: {
  //   marginTop: Styles.Layout.Margins.small,
  //   borderRadius: Styles.Layout.BorderRadius.large,
  //   backgroundColor: Styles.Colours.primary,
  //   paddingHorizontal: Styles.Layout.Margins.medium,
  //   paddingVertical: 2,
  //   width: "auto"
  // },
  // badgeSecondary: {
  //   backgroundColor: Styles.Colours.brownGrey,
  //   marginLeft: Styles.Layout.Margins.small
  // },
  // badgeText: {
  //   color: Styles.Colours.white,
  //   fontWeight: "700"
  // },
});
