// @flow

import type { AsyncState } from "../../redux/redux.types.js";
import type { ResolvedMatch } from "../../redux/wri-api/interests";

import React, { Component } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View, ScrollView } from "react-native";
import { withSafeArea } from "react-native-safe-area";
import { Navigation } from "react-native-navigation";
import { OrganisationVersionReadAll } from "wri-api";
import { findMostRecentOrganisationApprovedVersion } from "../../api/wri/helpers";
import { screens } from "../../screens";
import Styles from "../../styles/";
import ConnectionCard from "./connectionCard";
import InterestCard from "./interestCard";
import Banner from "../common/banner";
import Screen from "../common/screen";

import translate from "../../locales/";
import Layout from "../../styles/layout";
import debounceFunc from "../../utils/debounceFunc";

type Props = {|
  +componentId: string,
  +matchesState: AsyncState<Array<ResolvedMatch>>,
  +initiatedInterestsState: AsyncState<Array<ResolvedMatch>>,
  +receivedInterestsState: AsyncState<Array<ResolvedMatch>>,
  +refreshData: () => any,
  +withdrawInterest: (id: number) => any,
  +organisationVersionsState: AsyncState<OrganisationVersionReadAll>
|};

const teamBannerIcon = require("../../assets/icons/profile/team.png");
const offerImage = require("../../assets/icons/connections/funding.png");
const pitchImage = require("../../assets/icons/connections/projects.png");
const bothImage = require("../../assets/icons/connections/both.png");
const SafeAreaView = withSafeArea(ScrollView, "padding", "bottom");

export default class ConnectionsScreen extends Component<Props> {
  static options(passProps: {}) {
    return {
      topBar: {
        title: {
          text: translate("connections.title", "Connections")
        }
      }
    };
  }

  constructor(props: Props) {
    super(props);
  }

  _withdrawInterest = (id: ?number) => {
    if (id) {
      this.props.withdrawInterest(id);
    }
  };

  displayPitchOrOffer = debounceFunc((selectedPitchOrOffer: ResolvedMatch, interestType: "initiated" | "received") => {
    if (interestType === "received") {
      if (selectedPitchOrOffer.initiator === "pitch") {
        Navigation.push(this.props.componentId, {
          component: {
            ...screens.PITCH_SCREEN,
            passProps: {
              isOwnedByUser: false,
              pitchBase: selectedPitchOrOffer.pitch,
              pitchId: selectedPitchOrOffer.pitch.id
            }
          }
        });
      } else {
        Navigation.push(this.props.componentId, {
          component: {
            ...screens.OFFER_SCREEN,
            passProps: {
              isOwnedByUser: false,
              offerBase: selectedPitchOrOffer.offer,
              offerId: selectedPitchOrOffer.offer.id
            }
          }
        });
      }
    } else {
      if (selectedPitchOrOffer.initiator === "offer") {
        Navigation.push(this.props.componentId, {
          component: {
            ...screens.PITCH_SCREEN,
            passProps: {
              isOwnedByUser: false,
              pitchBase: selectedPitchOrOffer.pitch,
              pitchId: selectedPitchOrOffer.pitch.id
            }
          }
        });
      } else {
        Navigation.push(this.props.componentId, {
          component: {
            ...screens.OFFER_SCREEN,
            passProps: {
              isOwnedByUser: false,
              offerBase: selectedPitchOrOffer.offer,
              offerId: selectedPitchOrOffer.offer.id
            }
          }
        });
      }
    }
  });

  renderCard = (array: Array<ResolvedMatch>) => {
    return (
      <View style={styles.listView}>
        <FlatList
          data={array}
          extraData={this.state}
          scrollEnabled={false}
          keyExtractor={item => (item.id ?? 0).toString()}
          renderItem={({ item }) => <ConnectionCard content={item} removeMatch={this._withdrawInterest} />}
        />
      </View>
    );
  };

  renderInterestCard = (array: Array<ResolvedMatch>, interestType: "initiated" | "received") => {
    return (
      <View style={styles.listView}>
        <FlatList
          data={array}
          extraData={this.state}
          scrollEnabled={false}
          keyExtractor={item => (item.id ?? 0).toString()}
          renderItem={({ item }) => (
            <InterestCard
              interestClicked={() => this.displayPitchOrOffer(item, interestType)}
              content={item}
              onRemovePressed={interestType === "initiated" ? () => this._withdrawInterest(item.id) : null}
            />
          )}
        />
      </View>
    );
  };

  render() {
    const hasMatches = this.props.matchesState ? (this.props.matchesState.data?.length ?? 0) > 0 : false;
    const hasReceivedInterests = this.props.receivedInterestsState
      ? (this.props.receivedInterestsState.data?.length ?? 0) > 0
      : false;
    const hasInitiatedInterests = this.props.initiatedInterestsState
      ? (this.props.initiatedInterestsState.data?.length ?? 0) > 0
      : false;

    const isFetching =
      this.props.receivedInterestsState.isFetching ||
      this.props.initiatedInterestsState.isFetching ||
      this.props.matchesState.isFetching;

    const mostRecentApprovedVersion =
      findMostRecentOrganisationApprovedVersion(this.props.organisationVersionsState.data ?? []) ?? null;
    const organisationCategory = mostRecentApprovedVersion?.data?.category ?? "both";
    let yourInterestsImage = null;
    let interestedInMeImage = null;
    switch (organisationCategory) {
      case "both":
        yourInterestsImage = bothImage;
        interestedInMeImage = bothImage;
        break;
      case "developer":
        interestedInMeImage = pitchImage;
        yourInterestsImage = offerImage;
        break;
      case "funder":
        interestedInMeImage = offerImage;
        yourInterestsImage = pitchImage;
        break;
      default:
        break;
    }

    return (
      <Screen
        scrollComponent={SafeAreaView}
        secondary
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={this.props.refreshData} />}
      >
        <View>
          <View style={styles.textWrapper}>
            <Text style={styles.recentConnectionsHeader}>{translate("connections.yourConnections")}</Text>
          </View>
          {hasMatches ? (
            <>{this.renderCard(this.props.matchesState.data ?? [])}</>
          ) : (
            <Banner imageSource={teamBannerIcon} header={translate("connections.empty")} />
          )}
          <Text style={styles.infoText}>{translate("connections.newTime")}</Text>
        </View>

        <View style={styles.textWrapper}>
          <Text style={styles.recentConnectionsHeader}>{translate("interests.interestedInYou")}</Text>
        </View>

        {hasReceivedInterests ? (
          this.renderInterestCard(this.props.receivedInterestsState.data ?? [], "received")
        ) : (
          <Banner
            imageSource={interestedInMeImage}
            header={translate(`interests.empty.${organisationCategory}InterestedInYou`)}
            wideImage={organisationCategory === "both"}
          />
        )}
        <View style={styles.textWrapper}>
          <Text style={styles.recentConnectionsHeader}>{translate("interests.yourInterests")}</Text>
        </View>
        {hasInitiatedInterests ? (
          this.renderInterestCard(this.props.initiatedInterestsState.data ?? [], "initiated")
        ) : (
          <Banner
            imageSource={yourInterestsImage}
            header={translate(`interests.empty.${organisationCategory}YourInterests`)}
            wideImage={organisationCategory === "both"}
          />
        )}
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  listView: {
    marginBottom: Layout.Margins.small,
    flex: 1,
    overflow: "visible"
  },
  recentConnectionsHeader: {
    ...Styles.Text.secondaryH2,
    alignSelf: "center",
    textAlign: "center",
    color: Styles.Colours.black87
  },
  textWrapper: {
    borderBottomWidth: 2,
    borderBottomColor: Styles.Colours.border,
    paddingBottom: Layout.Margins.small,
    marginBottom: Layout.Margins.small,
    marginHorizontal: Layout.Margins.medium
  },
  infoText: {
    ...Styles.Text.input,
    ...Styles.Text.centered,
    ...Styles.Text.primaryFontBody,
    paddingHorizontal: Styles.Layout.Margins.massive,
    paddingVertical: Styles.Layout.Margins.medium
  }
});
