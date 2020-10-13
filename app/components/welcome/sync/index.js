// @flow

import React, { Component } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { withSafeArea } from "react-native-safe-area";
import Styles from "../../../styles/";
import Screen from "../../common/screen";
import LoadingIndicator from "../../common/loading-indicator";

type Props = {|
  /**
   * Automatically sent by RNN if mounted in a navigation stack
   */
  // eslint-disable-next-line react/no-unused-prop-types
  +componentId: string
|};

type State = {||};

const SafeAreaView = withSafeArea(ScrollView, "padding", "bottom");

export default class SyncScreen extends Component<Props, State> {
  static options(passProps: Props) {
    return {};
  }

  render() {
    return (
      <Screen style={styles.screen} scrollComponent={SafeAreaView} secondary>
        <LoadingIndicator size={"large"} />
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: "center",
    paddingBottom: Styles.Layout.Margins.large
  }
});
