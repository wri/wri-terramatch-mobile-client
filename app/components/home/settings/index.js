// @flow

import React, { Component } from "react";
import { StyleSheet, Text, View, Linking } from "react-native";
import Screen from "../../common/screen";
import Touchable from "../../common/touchable";
import Styles from "../../../styles/";
import Config from "react-native-config";
import { logUserData } from "../../../utils/analytics";

import translate from "../../../locales/";

type Props = {
  onSignOutPressed: () => any
};

export default class SettingsScreen extends Component<Props> {
  static options(passProps: {}) {
    return {
      topBar: {
        title: {
          text: translate("mobile.settings.title", "Settings")
        },
        rightButtons: []
      }
    };
  }

  openPrivacyPolicy() {
    Linking.openURL(Config.PRIVACY_POLICY);
  }

  openTerms() {
    Linking.openURL(Config.TERMS_OF_SERVICE);
  }

  openContactUsEmail() {
    const emailAddress = Config.WRI_EMAIL_ADDRESS;
    Linking.openURL(`mailto:${emailAddress}?subject=${translate("footer.contactSubject")}`);
  }

  signOutUser = () => {
    logUserData({
      user_type: null,
      country_code: null
    });
    this.props.onSignOutPressed();
  };

  render() {
    return (
      <Screen style={styles.container} secondary>
        <Text style={[Styles.Text.h5, Styles.Text.uppercase, styles.subheading]}>
          {translate("mobile.settings.title", "Settings")}
        </Text>
        {this.renderSetting({
          title: translate("footer.privacy"),
          onPress: this.openPrivacyPolicy
        })}
        {this.renderSetting({ title: translate("footer.terms"), onPress: this.openTerms })}
        {this.renderSetting({ title: translate("footer.contact"), onPress: this.openContactUsEmail })}
        {this.renderSetting({
          title: translate("common.logout"),
          isBottom: true,
          onPress: this.signOutUser
        })}
      </Screen>
    );
  }

  renderSetting(details: { title: string, isBottom?: boolean, onPress: string => any }) {
    return (
      <>
        <Touchable style={Styles.Containers.tableCell} onPress={details.onPress} accessibilityRole={"button"}>
          <Text style={[Styles.Text.tableCellTitle, details.isBottom ? Styles.Text.emphasis : {}]}>
            {details.title}
          </Text>
        </Touchable>
        <View style={details.isBottom ? Styles.Layout.Dividers.full : Styles.Layout.Dividers.partial} />
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 0
  },
  subheading: {
    paddingLeft: Styles.Layout.Margins.medium,
    paddingTop: Styles.Layout.Margins.medium
  }
});
