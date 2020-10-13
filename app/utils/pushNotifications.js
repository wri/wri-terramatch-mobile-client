// @flow

import type { AppStore, Dispatch } from "../redux/redux.types";
import { Platform } from "react-native";
import firebase, { type NotificationOpen, type RemoteMessage } from "react-native-firebase";

import { NOTIFICATION_CHANNELS_ANDROID, NOTIFICATION_TYPES } from "../constants/notifications";

import { updateAPNSToken, updatePushToken } from "../redux/device/notifications/actions/";
import { updateDevice } from "../redux/wri-api/users/actions";
import Config from "react-native-config";
import { refreshData } from "../redux/app/actions";
import { createDestinationScreenForNotification, displayScreenAsModal } from "../screens";

/**
 * Handles a specific push notification, dispatching any required actions
 *
 * @param {Object} notification - The notification which was received
 */
export async function handleNotification(notification: RemoteMessage) {
  // Notifications don't need to be manually shown on iOS!
  if (Platform.OS === "android") {
    // Android uses _data
    const data = notification?._data ?? notification?.data;

    // Setup the basic push structure
    let firebaseNotification = new firebase.notifications.Notification()
      .setNotificationId(notification._messageId ?? notification.messageId)
      .setTitle(data.title ?? Config.APP_NAME)
      .setBody(data.message)
      .setData(data)
      .android.setAutoCancel(true) // Remove notification from notification bar when opened.
      .android.setSmallIcon("ic_notification")
      .android.setChannelId(Config.NOTIFICATION_CHANNEL_DEFAULT_ID);

    // Perform customisation based on the push type
    if (data?.type) {
      const type = Object.keys(NOTIFICATION_TYPES)
        .map(key => NOTIFICATION_TYPES[key])
        .find(notificationType => notificationType.serverIdentifier === data?.type);
      if (type) {
        firebaseNotification = firebaseNotification.android.setChannelId(type.channelIdAndroid);
      }
    }

    await firebase.notifications().displayNotification(firebaseNotification);
  }
}

/**
 * checkPermissions - Checks the current push permissions, before calling the callback param with the result.
 */
export async function checkPermission() {
  const hasPermission = await firebase.messaging().hasPermission();
  await firebase.messaging().requestPermission();
  return hasPermission;
}

export async function configurePushNotifications(store: AppStore) {
  addNotificationListeners(store.dispatch);
  if (Platform.OS === "android") {
    // Build any notification channels
    Object.keys(NOTIFICATION_CHANNELS_ANDROID)
      .map(key => NOTIFICATION_CHANNELS_ANDROID[key])
      .forEach(channelDetails => {
        const firebaseChannel = new firebase.notifications.Android.Channel(
          channelDetails.id,
          channelDetails.title,
          channelDetails.importance
        ).setDescription(channelDetails.description);
        firebase.notifications().android.createChannel(firebaseChannel);
      });
    return fetchPushToken(store.dispatch);
  } else {
    const hasPermission = await checkPermission();

    if (hasPermission) {
      return fetchPushToken(store.dispatch);
    }
  }

  return null;
}

/**
 * requestPermission - Requests push notification permissions from the user.
 *
 * @throws An error if the permissions have been declined, does nothing if the user has given permission.
 */
export async function requestPermission() {
  return await firebase.messaging().requestPermission();
}

export function addNotificationListeners(dispatch: Dispatch) {
  firebase.messaging().onTokenRefresh(token => {
    newPushToken(token, dispatch);
  });

  const onNotification = () => {
    dispatch(refreshData());
  };

  // iOS we use `onNotification` because we don't send iOS notifications via FCM, rather via APNS
  if (Platform.OS === "android") {
    firebase.messaging().onMessage(message => {
      handleNotification(message);
      onNotification();
    });
  } else {
    firebase.notifications().onNotification(notification => {
      onNotification();
    });
  }

  /**
   * Handle directing the user to the appropriate page after a push notification is opened while the app is already
   * running
   */
  firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
    const pushDestination = createDestinationScreenForNotification(notificationOpen.notification._data);
    if (pushDestination) {
      displayScreenAsModal(pushDestination);
    }
    dispatch(refreshData());
  });
}

export async function fetchPushToken(dispatch: Dispatch) {
  const token = await firebase.messaging().getToken();
  await newPushToken(token, dispatch);
}

/**
 * Checks to see if the app was opened through the user clicking on a push notification.
 *
 * If so, it returns that notification, and discards so next time this function is called it is not returned. This helps
 * with ensuring pushes are only handled once.
 */
let hasObtainedInitialNotification = false;
export async function getInitialNotificationAndDiscard(): Promise<?NotificationOpen> {
  if (hasObtainedInitialNotification) {
    return null;
  }
  const notificationOpen = await firebase.notifications().getInitialNotification();
  hasObtainedInitialNotification = true;
  return notificationOpen;
}

export function resetInitialNotification() {
  hasObtainedInitialNotification = false;
}

async function newPushToken(token: string, dispatch: Dispatch) {
  dispatch(updatePushToken(token));

  // On iOS, we should also fetch & store the APNS token - as we need to use this instead of the FCM token for the appointment reminders endpoint.
  if (Platform.OS === "ios") {
    const apnsToken = await firebase.messaging().ios.getAPNSToken();
    if (apnsToken) {
      dispatch(updateAPNSToken(apnsToken.toLowerCase()));
    }
  }

  // Tell the WRI API about the new token
  dispatch(updateDevice());
}
