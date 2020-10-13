// @flow

import React, { Component } from "react";
import { StyleSheet, Platform, NativeModules } from "react-native";
import { WebView } from "react-native-webview";
import translate from "../../locales/";
import Styles from "../../styles";
import { getTranslation } from "../../utils/wp";

type Props = {|
  +article: any
|};

export default class NewsScreen extends Component<Props> {
  static options(passProps: Props) {
    return {
      topBar: {
        title: {
          text: translate("common.home")
        },
        rightButtons: [] // We need to add that in order to fix the navigation icon getting hidden, weird RN issue
      }
    };
  }

  /**
   * Field holding the HTML that will be rendered for this screen
   */
  html: string;

  constructor(props: Props) {
    super(props);

    const body = this.props.article;
    let langCode;

    if (Platform.OS === "ios") {
      let iOSLocale = NativeModules.SettingsManager.settings.AppleLocale;
      if (iOSLocale === undefined) {
        // iOS 13 workaround, take first of AppleLanguages array
        iOSLocale = NativeModules.SettingsManager.settings.AppleLanguages[0];
        if (iOSLocale == undefined) {
          iOSLocale = "en-us";
        }
      }
      langCode = iOSLocale.replace(/_/, "-");
    } else {
      langCode = NativeModules.I18nManager.localeIdentifier;
    }

    this.html = `<html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          .c-header {
            font-size: 20px;
            text-align: center;
            text-transform: uppercase;
          }

          .c-image {
            width: 100%;
          }
        </style>
      </head>
      <body>
        <img src="${body.head_image}" class="c-image" alt="${body.header_image_alt_text}">
        <h1 class="c-header">${getTranslation(langCode, body.new_item_title)}</h1>
        <p>${body.new_item_modified_date}</p>
        ${body.main_text}
      </body>
      </html>`;
  }

  render() {
    return (
      <WebView
        containerStyle={styles.webViewContainer}
        style={styles.webView}
        originWhitelist={["*"]}
        scalesPageToFit={false}
        source={{ html: this.html }}
      />
    );
  }
}

const styles = StyleSheet.create({
  webView: {
    flex: 1
  },
  webViewContainer: {
    marginVertical: Styles.Layout.Margins.small,
    marginHorizontal: Styles.Layout.Margins.small
  }
});
