// @flow

import React, { Component, type ElementConfig } from "react";
import { RefreshControl, ScrollView, StyleSheet } from "react-native";
import translate from "../../../locales";
import OfferProfile from "./base-view";
import { withSafeArea } from "react-native-safe-area";
import Screen from "../../common/screen";

const SafeAreaView = withSafeArea(ScrollView, "padding", "bottom");

type Props = {|
  ...ElementConfig<typeof OfferProfile>,

  /**
   * Automatically sent by RNN if mounted in a navigation stack
   */
  // eslint-disable-next-line react/no-unused-prop-types
  +componentId: string,

  +fetchOfferData: () => any
|};

export default class OfferScreen extends Component<Props> {
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
    this.props.fetchOfferData();
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const { fetchOfferData, ...rest } = this.props;

    const isFetching =
      this.props.contactsState.isFetching ||
      this.props.offerDetails.isFetching ||
      this.props.organisationState.isFetching;
    return (
      <Screen
        style={styles.screen}
        scrollComponent={SafeAreaView}
        secondary
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={this.props.fetchOfferData} />}
      >
        <OfferProfile {...rest} />
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    padding: 0
  }
});
