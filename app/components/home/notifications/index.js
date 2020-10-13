//@flow

import React, { Component } from "react";
import { Text, View, StyleSheet, FlatList, Image, RefreshControl } from "react-native";
import Moment from "moment";
import { Navigation } from "react-native-navigation";
import { NotificationReadAll, NotificationRead } from "wri-api";
import Styles from "../../../styles";
import Touchable from "../../common/touchable";
import type { AsyncState } from "../../../redux/redux.types";
import translate from "../../../locales";
import Banner from "../../common/banner";
import colours from "../../../styles/colours";

import NavLogo from "../../../assets/icons/notifications/ic_navigate_next_black_24dp.png";
import Icon from "../../../assets/icons/notifications/icon.png";
import { createDestinationScreenForNotification } from "../../../screens";
import Screen from "../../common/screen";
const notificationIcon = require("../../../assets/icons/home/notification.png");

type Props = {|
  +componentId: string,
  +notifications: AsyncState<NotificationReadAll>,
  +onReadNotificationPressed: number => any,
  +refreshData: () => any
|};

class NotificationScreen extends Component<Props> {
  static options(passProps: {}) {
    return {
      topBar: {
        title: {
          text: translate("notifications.title")
        },
        rightButtons: []
      }
    };
  }

  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
    this.props.refreshData();
  }

  onPress = (item: NotificationRead) => {
    this.props.onReadNotificationPressed(item.id ?? 0);
    const notificationDestination = createDestinationScreenForNotification(item);
    if (notificationDestination) {
      Navigation.push(this.props.componentId, {
        component: notificationDestination
      });
    }
  };

  today = (date: Date) => {
    const currentDate = new Date();

    return (
      date.getDate() === currentDate.getDate() &&
      date.getMonth() === currentDate.getMonth() &&
      date.getFullYear() === currentDate.getFullYear()
    );
  };

  yesterday = (date: Date) => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1);
    return (
      date.getDate() === currentDate.getDate() &&
      date.getMonth() === currentDate.getMonth() &&
      date.getFullYear() === currentDate.getFullYear()
    );
  };

  older = (date: Date) => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 2);
    currentDate.setHours(23, 59, 59, 59);
    return date.getTime() < currentDate.getTime();
  };

  renderNotification = (item: NotificationRead) => {
    const time = Moment(item.created_at ?? "");
    return (
      <View style={styles.container}>
        <Touchable accessibilityRole="none" onPress={this.onPress.bind(this, item)}>
          <View style={styles.cardView}>
            <Image source={Icon} style={styles.icon} />
            <View style={styles.cardTextContainer}>
              <View style={styles.readIndicator}>
                <Text style={[Styles.Text.input, Styles.Text.emphasis, styles.timeText]}>{time.fromNow()}</Text>
                <View style={[styles.indication, { backgroundColor: item.unread ? colours.red : colours.brownGrey }]} />
              </View>
              <View style={styles.messageRow}>
                <View style={Styles.Utilities.flexShrink}>
                  <Text style={[Styles.Text.input, styles.cardTextTitle]}>
                    {translate(`api.notification.actions.${item.action}`)}
                  </Text>

                  <Text style={[Styles.Text.input, styles.cardText]}>
                    {translate(`api.notification.typeMessages.${item.action}.${item.referenced_model}`)}
                  </Text>
                </View>
                <Image source={NavLogo} style={styles.navLogo} />
              </View>
            </View>
          </View>
        </Touchable>
      </View>
    );
  };

  renderList = (title: string, notifArray: Array<NotificationRead>) => {
    return (
      <View>
        <Text style={[Styles.Text.secondaryH1, styles.titleText]}>{title}</Text>
        <FlatList data={notifArray} renderItem={({ item }) => this.renderNotification(item)} />
      </View>
    );
  };

  render() {
    const todayNotif = (this.props.notifications.data ? this.props.notifications.data : []).filter(item =>
      this.today(new Date(item.created_at ?? ""))
    );
    const yesterdayNotif = (this.props.notifications.data ? this.props.notifications.data : []).filter(item =>
      this.yesterday(new Date(item.created_at ?? ""))
    );
    const olderNotif = (this.props.notifications.data ? this.props.notifications.data : []).filter(item =>
      this.older(new Date(item.created_at ?? ""))
    );

    return (
      <Screen
        secondary
        refreshControl={
          <RefreshControl refreshing={this.props.notifications.isFetching} onRefresh={this.props.refreshData} />
        }
      >
        {(this.props.notifications.data ?? []).length === 0 && (
          <Banner
            imageSource={notificationIcon}
            header={translate("notifications.empty", "You have no notifications.")}
          />
        )}
        {todayNotif.length === 0 ? null : this.renderList("TODAY", todayNotif)}
        {yesterdayNotif.length === 0 ? null : this.renderList("YESTERDAY", yesterdayNotif)}
        {olderNotif.length === 0 ? null : this.renderList("OLDER", olderNotif)}
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    backgroundColor: colours.white,
    padding: Styles.Layout.Margins.small,
    width: "100%"
  },
  cardView: {
    flexDirection: "row",
    backgroundColor: colours.white,
    padding: Styles.Layout.Margins.small,
    justifyContent: "flex-start",
    borderRadius: Styles.Layout.BorderRadius.medium,
    flex: 1,
    width: "100%",
    ...Styles.Containers.cardShadow
  },
  cardText: {
    textAlign: "left"
  },
  cardTextTitle: {
    ...Styles.Text.h4,
    textAlign: "left"
  },
  titleText: {
    color: "#323c47",
    fontSize: 20
  },
  timeText: {
    fontSize: 12
  },
  indication: {
    borderRadius: 4,
    width: 8,
    height: 8,
    backgroundColor: colours.red,
    marginLeft: Styles.Layout.Margins.small
  },
  readIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end"
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  icon: {
    borderColor: colours.brownGrey,
    borderRadius: Styles.Layout.BorderRadius.medium,
    borderWidth: 1,
    height: 62,
    marginRight: Styles.Layout.Margins.medium,
    padding: Styles.Layout.Margins.small,
    width: 62,
    alignSelf: "center"
  },
  navLogo: {
    width: 20,
    height: 30,
    alignSelf: "center"
  },
  cardTextContainer: {
    flex: 1
  }
});

export default NotificationScreen;
