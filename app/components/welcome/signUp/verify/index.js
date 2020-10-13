// @flow

import type { AsyncState } from "../../../../redux/redux.types";
import React, { Component } from "react";
import { Alert, NativeModules, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { withSafeArea } from "react-native-safe-area";
import { UserRead } from "wri-api";
import Styles from "../../../../styles/";
import Button from "../../../common/button";
import Screen from "../../../common/screen";
import Touchable from "../../../common/touchable";
import translate from "../../../../locales/";
import Error from "../../../common/error";
import ScreenSubtext from "../../../common/screen/subtext";
import LoadingIndicator from "../../../common/loading-indicator";

type Props = {|
  /**
   * Automatically sent by RNN if mounted in a navigation stack
   */
  // eslint-disable-next-line react/no-unused-prop-types
  +componentId: string,

  +continueAfterVerified: () => any,

  +refreshUserDetails: () => Promise<UserRead>,

  +requestVerificationEmail: () => Promise<any>,

  +requestVerificationEmailState: AsyncState<any>,

  +userDetailsState: AsyncState<UserRead>
|};

type State = {|
  hasSubmitted: boolean
|};

const SafeAreaView = withSafeArea(ScrollView, "padding", "bottom");

export default class VerificationScreen extends Component<Props, State> {
  static options(passProps: Props) {
    return {
      topBar: {
        title: {
          text: translate("mobile.verify.title", "Verify"),
          alignment: "fill"
        }
      }
    };
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      hasSubmitted: false
    };
  }

  _onResendPressed = () => {
    this.setState({
      hasSubmitted: true
    });
    this.props.requestVerificationEmail();
  };

  _onVerifyPressed = () => {
    // On iOS, we won't do anything. The user can just open the notification instead of us trying to guess their favoured email client.
    if (Platform.OS === "android") {
      NativeModules.Intents.launchEmailClient();
    }
  };

  _refreshUserDetails = async () => {
    const user = await this.props.refreshUserDetails();
    const isVerified = !!user.email_address_verified_at;

    if (isVerified) {
      this.props.continueAfterVerified();
    } else {
      Alert.alert(translate("verify.problem"), translate("verify.checkEmail"));
    }
  };

  render() {
    if (!this.props.userDetailsState.data) {
      return null;
    }

    const isInProgress = this.state.hasSubmitted && this.props.requestVerificationEmailState.isFetching;
    const hasSuccessfullyRequestedNewVerification =
      this.state.hasSubmitted && !isInProgress && !this.props.requestVerificationEmailState.error;

    return (
      <Screen
        scrollComponent={SafeAreaView}
        secondary
        header={translate("mobile.verify.title")}
        subtext={translate("mobile.verify.subtext")}
      >
        {Platform.OS === "android" && (
          <Button
            style={Styles.Buttons.centeredPrimaryButton}
            enabled={true}
            onPress={this._onVerifyPressed}
            title={translate("mobile.verify.openInbox")}
          />
        )}
        {!isInProgress && !hasSuccessfullyRequestedNewVerification && (
          <Button
            style={Platform.select({
              android: Styles.Buttons.centeredSecondaryButton,
              ios: Styles.Buttons.centeredPrimaryButton
            })}
            enabled={true}
            onPress={this._onResendPressed}
            title={translate("mobile.verify.sendAgain")}
          />
        )}
        {isInProgress && <LoadingIndicator />}
        {this.state.hasSubmitted && !isInProgress && <Error error={this.props.requestVerificationEmailState.error} />}
        {hasSuccessfullyRequestedNewVerification && (
          <ScreenSubtext style={styles.successText}>{translate("mobile.verify.sendAgainSuccess")}</ScreenSubtext>
        )}
        <View style={Styles.Utilities.flexGrow} />
        <Touchable
          style={styles.alreadyVerifiedButton}
          onPress={this._refreshUserDetails}
          disabled={this.props.userDetailsState.isFetching}
          accessibilityRole={"button"}
        >
          {this.props.userDetailsState.isFetching && <LoadingIndicator />}
          {!this.props.userDetailsState.isFetching && (
            <Text style={[Styles.Text.body, styles.alreadyVerifiedText]}>{translate("mobile.verify.continue")}</Text>
          )}
        </Touchable>
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  alreadyVerifiedButton: {
    alignSelf: "center",
    padding: Styles.Layout.Margins.medium
  },
  alreadyVerifiedText: {
    textDecorationLine: "underline"
  },
  successText: {
    marginTop: Styles.Layout.Margins.large
  }
});
