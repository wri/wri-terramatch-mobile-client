// @flow
import React, { Component } from "react";
import { ScrollView, Text, StyleSheet } from "react-native";
import { Navigation } from "react-native-navigation";
import { withSafeArea } from "react-native-safe-area";
import LatestUpdateCard from "./latest-update-card";
import Styles from "../../styles/";
import Screen from "../common/screen";
import translate from "../../locales/";
import { screens } from "../../screens";
import debounceFunc from "../../utils/debounceFunc";

const NAV_BAR_BUTTON_ID_NOTIFICATIONS = "nav_bar_btn_notifications";
const NAV_BAR_BUTTON_ID_SETTINGS = "nav_bar_btn_settings";
const notificationUnreadIcon = require("../../assets/icons/home/notification-unread.png");
const notificationIcon = require("../../assets/icons/home/notification.png");
const settingsIcon = require("../../assets/icons/home/settings.png");
const SafeAreaView = withSafeArea(ScrollView, "padding", "bottom");

type Props = {|
  +checkNotificationPermission: () => any,
  +componentId: string,
  +hasNotifications: boolean,
  +newsWordpressState: any
|};

export default class HomeScreen extends Component<Props> {
  static options(passProps: $Shape<Props>) {
    return {
      topBar: {
        rightButtons: [
          {
            id: NAV_BAR_BUTTON_ID_SETTINGS,
            icon: settingsIcon,
            showAsAction: "always"
          },
          {
            id: NAV_BAR_BUTTON_ID_NOTIFICATIONS,
            icon: passProps.hasNotifications ? notificationUnreadIcon : notificationIcon,
            showAsAction: "always",
            disableIconTint: true
          }
        ],
        title: {
          text: translate("home.title")
        }
      }
    };
  }

  constructor(props: Props) {
    super(props);
    Navigation.events().bindComponent(this);
    this.props.checkNotificationPermission();
  }

  openSettings = debounceFunc(() => {
    Navigation.push(this.props.componentId, {
      component: {
        ...screens.SETTINGS
      }
    });
  });

  openNotifications = debounceFunc(() => {
    Navigation.push(this.props.componentId, {
      component: {
        ...screens.NOTIFICATION_SCREEN
      }
    });
  });

  navigationButtonPressed(event: { buttonId: string }) {
    switch (event.buttonId) {
      case NAV_BAR_BUTTON_ID_NOTIFICATIONS: {
        this.openNotifications();
        break;
      }
      case NAV_BAR_BUTTON_ID_SETTINGS: {
        this.openSettings();
        break;
      }
    }
  }

  componentDidAppear() {
    if (this.props.hasNotifications) {
      Navigation.mergeOptions(
        this.props.componentId,
        HomeScreen.options({
          hasNotifications: true
        })
      );
    }
  }

  componentDidUpdate(prevProps: Props) {
    const previouslyHadNotifications = prevProps.hasNotifications;
    const hasNotifications = this.props.hasNotifications;

    if (previouslyHadNotifications !== hasNotifications) {
      Navigation.mergeOptions(
        this.props.componentId,
        HomeScreen.options({
          hasNotifications: hasNotifications
        })
      );
    }
  }

  newsFlow = debounceFunc((article: any) => {
    Navigation.push(this.props.componentId, {
      component: {
        ...screens.NEWS_SCREEN,
        passProps: {
          article: article
        }
      }
    });
  });

  render() {
    const latestNewsItem = this.props.newsWordpressState?.[0];

    return (
      <Screen scrollComponent={SafeAreaView} secondary>
        {latestNewsItem && (
          <>
            <Text style={styles.heading}>{translate("mobile.home.latestUpdate")}</Text>
            <LatestUpdateCard content={latestNewsItem} onPress={() => this.newsFlow(latestNewsItem)} />
          </>
        )}
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  heading: {
    ...Styles.Text.secondaryH2,
    ...Styles.Text.centered,
    ...Styles.Text.uppercase,
    marginBottom: Styles.Layout.Margins.small
  }
});
