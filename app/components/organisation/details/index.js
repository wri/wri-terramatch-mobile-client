// @flow

import type { ProjectDraftRead, ProjectRead } from "../../../api/wri/wri.types";
import type { PendingTeamMember } from "../../../redux/wri-api/organisations";
import React, { Component, type ElementConfig } from "react";
import { RefreshControl, ScrollView, StyleSheet } from "react-native";
import { withSafeArea } from "react-native-safe-area";
import { Navigation } from "react-native-navigation";

import { screens } from "../../../screens";
import Screen from "../../common/screen";
import translate from "../../../locales/";
import OrganisationProfile from "./base-view";
import OrganisationApprovalCard from "../approval-card";
import debounceFunc from "../../../utils/debounceFunc";

const SafeAreaView = withSafeArea(ScrollView, "padding", "bottom");

type Props = {|
  ...ElementConfig<typeof OrganisationProfile>,

  /**
   * Automatically sent by RNN if mounted in a navigation stack
   */
  +componentId: string,

  +fetchOrganisationData: () => any,

  /**
   * Flag indicating whether or not this organisation is owned by the user
   */
  +isOwnedByUser: boolean,

  +onContactPress?: ?(PendingTeamMember) => void,
  +onEditDraftPressed?: (project: ProjectDraftRead) => Promise<void>,
  +onEditOrganisationPressed?: () => void,

  // eslint-disable-next-line react/no-unused-prop-types
  +organisationId: number
|};

export default class OrganisationDetailsScreen extends Component<Props> {
  static options(passProps: {}) {
    return {
      topBar: {
        title: {
          text: translate("profile.title")
        }
      }
    };
  }

  constructor(props: Props) {
    super(props);
    this.props.fetchOrganisationData();
  }

  _handleProjectPress = debounceFunc((project: ProjectRead) => {
    switch (project.type) {
      case "pitch": {
        Navigation.push(this.props.componentId, {
          component: {
            ...(this.props.isOwnedByUser ? screens.MY_PITCH_SCREEN : screens.PITCH_SCREEN),
            passProps: {
              isOwnedByUser: this.props.isOwnedByUser,
              pitchBase: project.data,
              pitchId: project.data.id
            }
          }
        });
        break;
      }
      case "offer": {
        Navigation.push(this.props.componentId, {
          component: {
            ...(this.props.isOwnedByUser ? screens.MY_OFFER_SCREEN : screens.OFFER_SCREEN),
            passProps: {
              isOwnedByUser: this.props.isOwnedByUser,
              offerBase: project.data,
              offerId: project.data.id
            }
          }
        });
        break;
      }
      case "pitch_draft": {
        if (this.props.onEditDraftPressed) {
          this.props.onEditDraftPressed(project);
        }
        break;
      }
      case "offer_draft": {
        if (this.props.onEditDraftPressed) {
          this.props.onEditDraftPressed(project);
        }
        break;
      }
      default: {
        // eslint-disable-next-line babel/no-unused-expressions
        (project.type: empty);
        break;
      }
    }
  });

  render() {
    const {
      componentId, // eslint-disable-line no-unused-vars
      fetchOrganisationData, // eslint-disable-line no-unused-vars
      isOwnedByUser, // eslint-disable-line no-unused-vars
      onEditDraftPressed, // eslint-disable-line no-unused-vars
      onEditOrganisationPressed, // eslint-disable-line no-unused-vars
      organisationId, // eslint-disable-line no-unused-vars
      ...rest
    } = this.props;
    const isFetching =
      this.props.documentsState.isFetching ||
      this.props.membersState.isFetching ||
      this.props.offersState.isFetching ||
      this.props.pitchesState.isFetching ||
      this.props.usersState.isFetching ||
      this.props.versionsState.isFetching;
    return (
      <Screen
        style={styles.screen}
        scrollComponent={SafeAreaView}
        secondary
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={this.props.fetchOrganisationData} />}
      >
        <OrganisationApprovalCard
          isAwaitingFirstApproval={false}
          organisationVersionsState={this.props.versionsState}
          onEditOrganisationPressed={this.props.onEditOrganisationPressed ?? (() => {})}
        />
        <OrganisationProfile
          {...rest}
          onContactPress={this.props.onContactPress}
          onProjectPress={item => this._handleProjectPress(item)}
          isOwnedByUser={this.props.isOwnedByUser}
        />
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    padding: 0
  }
});
