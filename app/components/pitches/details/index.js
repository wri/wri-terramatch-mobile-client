// @flow

import React, { Component, type ElementConfig } from "react";
import { RefreshControl, ScrollView, StyleSheet } from "react-native";
import translate from "../../../locales";
import PitchProfile from "./base-view";
import { withSafeArea } from "react-native-safe-area";
import Screen from "../../common/screen";
import PitchApprovalCard from "../approval-card";

const SafeAreaView = withSafeArea(ScrollView, "padding", "bottom");

type Props = {|
  ...ElementConfig<typeof PitchProfile>,

  /**
   * Automatically sent by RNN if mounted in a navigation stack
   */
  // eslint-disable-next-line react/no-unused-prop-types
  +componentId: string,

  +fetchPitchData: () => any,

  /**
   * Callback to be invoked when the user has requested that they be able to edit their project
   */
  +onEditPitchPressed: () => any
|};

export default class PitchScreen extends Component<Props> {
  static options(passProps: { isOwnedByUser: boolean }) {
    return {
      topBar: {
        title: {
          text: translate("projects.title"),
          alignment: "fill"
        },
        rightButtons: [] // We need to add that in order to fix the navigation icon getting hidden, weird RN issue
      }
    };
  }

  constructor(props: Props) {
    super(props);
    this.props.fetchPitchData();
  }

  render() {
    const {
      fetchPitchData, // eslint-disable-line no-unused-vars
      onEditPitchPressed, // eslint-disable-line no-unused-vars
      ...rest
    } = this.props;
    const isFetching =
      this.props.certificationState.isFetching ||
      this.props.contactsState.isFetching ||
      this.props.documentsState.isFetching ||
      this.props.metricsState.isFetching ||
      this.props.organisationState.isFetching ||
      this.props.treeSpeciesState.isFetching ||
      this.props.versionsState.isFetching;
    return (
      <Screen
        style={styles.screen}
        scrollComponent={SafeAreaView}
        secondary
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={this.props.fetchPitchData} />}
      >
        <PitchApprovalCard
          pitchVersionsState={this.props.versionsState}
          onEditPitchPressed={this.props.onEditPitchPressed}
        />
        <PitchProfile {...rest} />
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    padding: 0
  }
});
