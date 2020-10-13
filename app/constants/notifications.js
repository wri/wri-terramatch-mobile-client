// @flow

import Config from "react-native-config";
import firebase from "react-native-firebase";

type NotificationConfiguration = {|
  key: string,
  channelIdAndroid: string,
  title: string,
  serverIdentifier: ?string
|};

type AndroidNotificationChannelConfiguration = {|
  id: string,
  title: string,
  description: string,
  importance: number
|};

/**
 * Configuration for Android notifiation channels
 *
 * https://developer.android.com/training/notify-user/channels
 */
export const NOTIFICATION_CHANNELS_ANDROID: { [string]: AndroidNotificationChannelConfiguration } = {
  general: {
    id: Config.NOTIFICATION_CHANNEL_DEFAULT_ID,
    title: "General",
    description: "General notifications",
    importance: firebase.notifications.Android.Importance.Default
  }
};

/**
 * Configuration for the different types of received notifications
 */
export const NOTIFICATION_TYPES: { [string]: NotificationConfiguration } = {
  generalNotification: {
    key: "PN_GeneralNotification",
    channelIdAndroid: NOTIFICATION_CHANNELS_ANDROID.general.id,
    title: "General Notification",
    serverIdentifier: null
  }
};
