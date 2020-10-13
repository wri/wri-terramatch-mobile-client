// @flow

import type { AsyncState } from "../../../../redux/redux.types";
import React, { Component, type ElementConfig, type Node } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Navigation } from "react-native-navigation";
import { screens } from "../../../../screens";
import translate, { formatNumber } from "../../../../locales";
import TabView from "../../../common/tab-view";
import MetricsTab from "../metrics-tab";
import CategoryMatchCard from "../../../projects/details/category-match";
import ProjectHeaderCard from "../../../projects/details/header-card";
import { IsSmallDevice } from "../../../../styles/layout";
import Styles from "../../../../styles";
import {
  CarbonCertificationVersionReadAll,
  OfferReadAll,
  OrganisationRead,
  OrganisationVersionReadAll,
  PitchContactReadAll,
  PitchDocumentVersionReadAll,
  PitchRead,
  PitchVersionReadAll,
  RestorationMethodMetricVersionReadAll,
  TreeSpeciesVersionReadAll
} from "wri-api";
import { findMostRecentPitchVersion, findMostRecentOrganisationApprovedVersion } from "../../../../api/wri/helpers";
import OrganizationOverview from "../../../projects/details/organisation-header";
import LoadingIndicator from "../../../common/loading-indicator";
import DocumentList from "../../../projects/details/document-list";
import ContactList from "../../../projects/details/contact-list";
import debounceFunc from "../../../../utils/debounceFunc";
import VideoPlayer from "../../../common/video-player";
import colours from "../../../../styles/colours";
import Toast from "../../../common/toast";

const playIcon = require("../../../../assets/video/play-icon.png");

type Props = {|
  ...ElementConfig<typeof View>,

  +certificationState: AsyncState<CarbonCertificationVersionReadAll>,

  +componentId: string,

  +contactsState: AsyncState<PitchContactReadAll>,

  +documentsState: AsyncState<PitchDocumentVersionReadAll>,

  +filteredId: number,

  /**
   * Flag indicating whether or not this project is owned by the user's organisation, and as such whether it should
   * display privileged owner-only info such as pending versions
   */
  +isOwnedByUser: boolean,

  +metricsState: AsyncState<RestorationMethodMetricVersionReadAll>,

  +myOffers: AsyncState<OfferReadAll>,

  +myOrganisation: AsyncState<OrganisationVersionReadAll>,

  +organisationState: AsyncState<OrganisationRead>,

  // eslint-disable-next-line react/no-unused-prop-types
  +pitchBase: ?PitchRead,

  // eslint-disable-next-line react/no-unused-prop-types
  +pitchId: number,

  +treeSpeciesState: AsyncState<TreeSpeciesVersionReadAll>,

  +versionsState: AsyncState<PitchVersionReadAll>
|};

export default class PitchDetails extends Component<Props> {
  static options(passProps: {}) {
    return {
      topBar: {
        title: {
          text: translate("projects.title"),
          alignment: "fill"
        }
      }
    };
  }

  constructor(props: Props) {
    super(props);
    Navigation.events().bindComponent(this);
  }

  componentDidDisappear() {
    this.videoPlayer?.pauseVideo?.();
  }

  navigationButtonPressed({ buttonId }) {
    // Pause video for any nav button press, delete should pause
    // the video so user has peace and quiet to reflect on
    // their decision!
    this.videoPlayer?.pauseVideo?.();
  }

  renderTabContents = ({ route }: any, pitch: PitchRead): Node => {
    switch (route.key) {
      case "pitch":
        return <View style={styles.tabContent}>{this.renderInformation(pitch)}</View>;
      case "metric":
        return (
          <View style={styles.tabContent}>
            <MetricsTab
              pitch={pitch}
              certificationState={this.props.certificationState}
              metricsState={this.props.metricsState}
              organisationState={this.props.organisationState}
              treeSpeciesState={this.props.treeSpeciesState}
            />
          </View>
        );
      case "team":
        return (
          <View style={styles.tabContent}>
            <Text style={Styles.Text.h1}>{route.title}</Text>
            <ContactList
              style={styles.tabList}
              contentContainerStyle={styles.tabListContainer}
              contactsState={this.props.contactsState}
              scrollEnabled={false}
              translations={{
                empty: translate("profile.noPitch", "This project doesn’t have any user yet")
              }}
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
              documents={{ type: "pitch", state: this.props.documentsState }}
              scrollEnabled={false}
              translations={{
                empty: translate("project.documents.none")
              }}
            />
          </View>
        );
    }

    return null;
  };

  renderInformation(pitch: PitchRead) {
    return (
      <View>
        <Text style={styles.sectionHeading}>{translate("project.details.description")}</Text>
        <Text style={styles.sectionText}>{pitch.description}</Text>
        <Text style={styles.sectionHeading}>{translate("project.details.problem")}</Text>
        <Text style={styles.sectionText}>{pitch.problem}</Text>
        <Text style={styles.sectionHeading}>{translate("project.details.anticipatedOutcome")}</Text>
        <Text style={styles.sectionText}>{pitch.anticipated_outcome}</Text>
        <Text style={styles.sectionHeading}>{translate("project.details.whoIsInvolved")}</Text>
        <Text style={styles.sectionText}>{pitch.who_is_involved}</Text>
        <Text style={styles.sectionHeading}>{translate("project.details.community.title")}</Text>
        <Text style={Styles.Text.h3}>{translate("project.details.community.localInvolvement")}</Text>
        <Text style={styles.sectionText}>
          {pitch.local_community_involvement
            ? translate("project.details.community.involvementTrue")
            : translate("project.details.community.involvementFalse")}
        </Text>

        {!!pitch.training_involved && (
          <>
            <Text style={Styles.Text.h3}>{translate("project.details.community.trainingInvolved")}</Text>
            <Text style={styles.sectionText}>{pitch.training_type ?? ""}</Text>
            <Text style={Styles.Text.h3}>{translate("project.details.community.trainingNumber")}</Text>
            <Text style={styles.sectionText}>{formatNumber(pitch.training_amount_people) ?? ""}</Text>
          </>
        )}

        <Text style={Styles.Text.h3}>{translate("project.details.community.peopleWorkingIn")}</Text>
        <Text style={styles.sectionText}>{pitch.people_working_in}</Text>
        <Text style={Styles.Text.h3}>{translate("project.details.community.peopleNearby")}</Text>
        <Text style={styles.sectionText}>{formatNumber(pitch.people_amount_nearby)}</Text>
        <Text style={Styles.Text.h3}>{translate("project.details.community.peopleAbroad")}</Text>
        <Text style={styles.sectionText}>{formatNumber(pitch.people_amount_abroad)}</Text>
        <Text style={Styles.Text.h3}>{translate("project.details.community.numberOfEmployees")}</Text>
        <Text style={styles.sectionText}>{formatNumber(pitch.people_amount_employees)}</Text>
        <Text style={Styles.Text.h3}>{translate("project.details.community.numberOfVolunteers")}</Text>
        <Text style={styles.sectionText}>{formatNumber(pitch.people_amount_volunteers)}</Text>
        <Text style={Styles.Text.h3}>{translate("project.details.community.numberOfBenefitedPeople")}</Text>
        <Text style={styles.sectionText}>{formatNumber(pitch.benefited_people)}</Text>

        <Text style={styles.sectionHeading}>{translate("project.details.sustainability.title")}</Text>
        <Text style={Styles.Text.h3}>{translate("project.details.sustainability.futureMaintenance")}</Text>
        <Text style={styles.sectionText}>{pitch.future_maintenance}</Text>
        <Text style={Styles.Text.h3}>{translate("project.details.sustainability.useOfResources")}</Text>
        <Text style={styles.sectionText}>{pitch.use_of_resources}</Text>
      </View>
    );
  }

  _onPressApply = debounceFunc(() => {
    Navigation.push(this.props.componentId, {
      component: {
        ...screens.APPLY_INTEREST_SCREEN,
        passProps: {
          theirProjectId: this.props.pitchId,
          theirProjectType: "pitch",
          theirProjectName: this.props.pitchBase?.name
        }
      }
    });
  });

  _onPressVisibility = debounceFunc(() => {
    const pitchVersion = findMostRecentPitchVersion(this.props.versionsState.data ?? []);
    const pitch = pitchVersion?.data;
    if (pitch) {
      Navigation.push(this.props.componentId, {
        component: {
          ...screens.PROJECTS_VISIBILITIES_SCREEN,
          passProps: {
            project: pitch,
            projectType: "pitch"
          }
        }
      });
    } else {
      this.refs.defaultToastBottom.showToast(translate("common.error"), 2000);
    }
  });

  render() {
    const pitchVersion = findMostRecentPitchVersion(this.props.versionsState.data ?? []);
    const pitchDetails = pitchVersion?.data;
    const myOrg = findMostRecentOrganisationApprovedVersion(this.props.myOrganisation?.data ?? []);
    const canRegisterInterest = myOrg?.data?.category !== "developer" ?? null;

    if (!pitchDetails) {
      return <LoadingIndicator size={"large"} style={styles.loadingIndicator} />;
    }

    return (
      <View style={this.props.style}>
        <View>
          <ProjectHeaderCard
            isOwnedByUser={this.props.isOwnedByUser}
            project={pitchDetails}
            projectType={"pitch"}
            onPressApply={this._onPressApply}
            onPressVisibility={this._onPressVisibility}
            isRegisterInterestButtonVisible={canRegisterInterest}
          />
          {!this.props.isOwnedByUser && (
            <OrganizationOverview
              componentId={this.props.componentId}
              organisationState={this.props.organisationState}
            />
          )}
          <CategoryMatchCard
            isOwnedByUser={this.props.isOwnedByUser}
            project={pitchDetails}
            projectType={"pitch"}
            filteredId={this.props.filteredId}
            comparableProjects={this.props.myOffers}
          />
          {pitchDetails.video && (
            <View style={styles.containerVideo}>
              <VideoPlayer
                ref={component => {
                  this.videoPlayer = component;
                }}
                componentId={this.props.componentId}
                video={{ uri: pitchDetails.video }}
                style={styles.video}
                thumbnailPlayIcon={playIcon}
              />
            </View>
          )}
        </View>
        <TabView
          navigationState={{
            routes: [
              { key: "pitch", title: translate("project.about") },
              { key: "metric", title: translate("project.metrics") },
              { key: "team", title: translate("project.team") },
              { key: "docs", title: translate("project.documents.title") }
            ]
          }}
          renderScene={scene => this.renderTabContents(scene, pitchDetails)}
        />
        <Toast ref="defaultToastBottom" position="bottom" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
  sectionText: {
    ...Styles.Text.body,
    marginBottom: Styles.Layout.Margins.medium
  },
  sectionHeading: {
    ...Styles.Text.h1,
    marginBottom: Styles.Layout.Margins.medium
  },
  loadingIndicator: {
    height: "100%",
    width: "100%"
  },
  video: {
    aspectRatio: 16 / 9
  },
  containerVideo: {
    aspectRatio: 16 / 9,
    backgroundColor: colours.primary,
    justifyContent: "center",
    paddingBottom: 8
  }
});
