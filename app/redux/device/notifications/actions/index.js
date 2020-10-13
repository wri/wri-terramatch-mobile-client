// @flow

type NotificationPreference = {|
  +key: string,
  +value: boolean
|};

export type SetNotificationPreferenceAction = {|
  +type: "set_notification_preference",
  +payload: NotificationPreference
|};

export type UpdateAPNSTokenAction = {|
  +type: "update_apns_token",
  +payload: string
|};

export type UpdatePushTokenAction = {|
  +type: "update_push_token",
  +payload: string
|};

/**
 * setNotificationPreference - Set's the user's preference for a particular type of push notification.
 *
 * @param  {object} preference The user's preference: {key: <string>, value: <bool>}
 * @return {function}          A Redux action meeting the above specification.
 */
// eslint-disable-next-line no-unused-vars
function setNotificationPreference(preference: NotificationPreference): SetNotificationPreferenceAction {
  return {
    type: "set_notification_preference",
    payload: preference
  };
}

/*
 * updateAPNSToken - Creates a redux thunk, that dispatches an action to update the user's APNS token.
 *
 * @param  {string} token The user's APNS token.
 * @return {function}     A redux thunk meeting the above specification.
 */
export function updateAPNSToken(token: string): UpdateAPNSTokenAction {
  return {
    type: "update_apns_token",
    payload: token
  };
}

/**
 * Creates a redux thunk, that when dispatched An action to be dispatched will update the user's
 * push token with the server
 *
 * @param {string} token - The push token provided by the OS
 * @returns {function} A Redux thunk meeting the above specification.
 */
export function updatePushToken(token: string): UpdatePushTokenAction {
  return {
    type: "update_push_token",
    payload: token
  };
}
