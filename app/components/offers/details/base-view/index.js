// @flow

import type { AsyncState } from "../../../../redux/redux.types";
import React, { Component, type ElementConfig, type Node } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Navigation } from "react-native-navigation";
import { screens } from "../../../../screens";
import translate from "../../../../locales";
import TabView from "../../../common/tab-view";
import MetricsTab from "../metrics-tab";
import CategoryMatchCard from "../../../projects/details/category-match";
import ProjectHeaderCard from "../../../projects/details/header-card";
import { IsSmallDevice } from "../../../../styles/layout";
import Styles from "../../../../styles";
import { OfferContactReadAll, OfferRead, OrganisationRead, OrganisationVersionReadAll, PitchReadAll } from "wri-api";
import OrganizationOverview from "../../../projects/details/organisation-header";
import LoadingIndicator from "../../../common/loading-indicator";
import ContactList from "../../../projects/details/contact-list";
import debounceFunc from "../../../../utils/debounceFunc";
import { findMostRecentOrganisationApprovedVersion } from "../../../../api/wri/helpers";
import Toast from "../../../common/toast";

type Props = {|
  ...ElementConfig<typeof View>,

  +componentId: string,

  +contactsState: AsyncState<OfferContactReadAll>,

  +filteredId: number,

  /**
   * Flag indicating whether or not this project is owned by the user's organisation, and as such whether it should
   * display privileged owner-only info such as pending versions
   */
  // eslint-disable-next-line react/no-unused-prop-types
  +isOwnedByUser: boolean,

  +myOrganisation: AsyncState<OrganisationVersionReadAll>,

  +myPitches: AsyncState<PitchReadAll>,

  +offerDetails: AsyncState<OfferRead>,

  +organisationState: AsyncState<OrganisationRead>,

  // eslint-disable-next-line react/no-unused-prop-types
  +offerBase: ?OfferRead,

  // eslint-disable-next-line react/no-unused-prop-types
  +offerId: number
|};

export default class OfferDetails extends Component<Props> {
  static options(passProps: { isOwnedByUser: boolean }) {
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
  }

  _onPressApply = debounceFunc(() => {
    Navigation.push(this.props.componentId, {
      component: {
        ...screens.APPLY_INTEREST_SCREEN,
        passProps: {
          theirProjectId: this.props.offerId,
          theirProjectType: "offer",
          theirProjectName: this.props.offerBase?.name
        }
      }
    });
  });

  _onPressVisibility = debounceFunc(() => {
    const offer = this.props.offerDetails.data;
    if (offer) {
      Navigation.push(this.props.componentId, {
        component: {
          ...screens.PROJECTS_VISIBILITIES_SCREEN,
          passProps: {
            project: offer,
            projectType: "offer"
          }
        }
      });
    } else {
      this.refs.defaultToastBottom.showToast(translate("common.error"), 2000);
    }
  });

  render() {
    const offerDetails = this.props.offerDetails.data;
    const myOrg = findMostRecentOrganisationApprovedVersion(this.props.myOrganisation?.data ?? []);
    const canRegisterInterest = myOrg?.data?.category !== "funder" ?? null;

    if (!offerDetails) {
      return <LoadingIndicator size={"large"} style={styles.loadingIndicator} />;
    }

    return (
      <View style={this.props.style}>
        <View>
          <ProjectHeaderCard
            isOwnedByUser={this.props.isOwnedByUser}
            project={offerDetails}
            projectType={"offer"}
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
        </View>
        <View style={styles.dividerView} />
        <TabView
          navigationState={{
            routes: [
              { key: "offer", title: translate("offer.summary", "Summary") },
              { key: "team", title: translate("offer.team", "Team") }
            ]
          }}
          renderScene={scene => this.renderTabContents(scene, offerDetails)}
        />
        <Toast ref="defaultToastBottom" position="bottom" />
      </View>
    );
  }

  renderOfferDescriptionBody = (offer: OfferRead) => {
    return (
      <View style={styles.bottomMargin}>
        <Text style={Styles.Text.h1}>{translate("offer.funding.title", "Funding Offer")} </Text>
        <Text style={Styles.Text.body}>{offer.description}</Text>
      </View>
    );
  };

  renderTabContents = ({ route }: any, offer: OfferRead): Node => {
    switch (route.key) {
      case "offer":
        return (
          <View style={styles.tabContent}>
            <CategoryMatchCard
              isOwnedByUser={this.props.isOwnedByUser}
              style={styles.categoryCard}
              project={offer}
              projectType={"offer"}
              filteredId={this.props.filteredId}
              comparableProjects={this.props.myPitches}
            />

            {this.renderOfferDescriptionBody(offer)}
            <MetricsTab offer={offer} organisationState={this.props.organisationState} />
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
    }

    return null;
  };
}

const styles = StyleSheet.create({
  bottomMargin: { marginBottom: 20 },
  categoryCard: {
    marginHorizontal: -Styles.Layout.Margins.medium
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
  dividerView: {
    marginVertical: Styles.Layout.Margins.small,
    borderTopWidth: 1,
    borderColor: Styles.Colours.border
  },
  loadingIndicator: {
    height: "100%",
    width: "100%"
  }
});
