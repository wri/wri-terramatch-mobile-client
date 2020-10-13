// @flow

import type { LogoutAction, ReducerMap } from "../../redux.types";
import type { SetNotificationPreferenceAction, UpdateAPNSTokenAction, UpdatePushTokenAction } from "./actions";
import { combineReducers } from "redux";
import { NOTIFICATION_TYPES } from "../../../constants/notifications";

type NotificationPreferencesState = {| +[string]: boolean |};

/**
 * Type definition for the state managed by this reducer and its subreducers
 */
export type State = {|
  +apnsToken: ?string,
  +notificationPreferences: NotificationPreferencesState,
  +token: ?string
|};

/**
 * Type definition for the actions supported by this reducer and its subreducers
 */
export type Actions = SetNotificationPreferenceAction | UpdateAPNSTokenAction | UpdatePushTokenAction | LogoutAction;

export default combineReducers<ReducerMap<State, any>, any>({
  notificationPreferences: notificationPreferencesReducer,

  /**
   * The user's current push token
   */
  token: tokenReducer,

  /**
   * An iOS user's current APNS push token.
   * We retain a reference to this, as SNS requires the APNS token for iOS.
   */
  apnsToken: apnsTokenReducer
});

function notificationPreferencesReducer(
  state: NotificationPreferencesState = {
    [NOTIFICATION_TYPES.generalNotification.key]: true
  },
  action: SetNotificationPreferenceAction | LogoutAction
): NotificationPreferencesState {
  switch (action.type) {
    case "set_notification_preference": {
      return {
        ...state,
        [action.payload.key]: action.payload.value
      };
    }
    case "logout": {
      return {
        [NOTIFICATION_TYPES.generalNotification.key]: true
      };
    }
    default: {
      // eslint-disable-next-line babel/no-unused-expressions
      (action: empty); // flow cast to empty - this will error if we've forgotten to handle an action
      return state;
    }
  }
}

/**
 * apnsTokenReducer - Updates the redux state, with the given APNS token.
 * This is only relevant on iOS, where we need to capture this so that it can be sent to the Appointment Reminders API.
 *
 * @param  {object} state = null The default state for this action.
 * @param  {object} action       The action that will change the state.
 * @return {object}              The updated redux state.
 */
function apnsTokenReducer(state: ?string = null, action: UpdateAPNSTokenAction): ?string {
  switch (action.type) {
    case "update_apns_token": {
      return action.payload;
    }
    default: {
      // eslint-disable-next-line babel/no-unused-expressions
      (action: empty); // flow cast to empty - this will error if we've forgotten to handle an action
      return state;
    }
  }
}

/**
 * Updates Redux state in response to the provided action.
 *
 * @param {Object} [state=null] - The previous chunk of state
 * @param {Object} action - The Flux standard action used to update state
 *
 * @returns {Object} The updated chunk of state
 */
function tokenReducer(state: ?string = null, action: UpdatePushTokenAction | LogoutAction): ?string {
  switch (action.type) {
    case "update_push_token": {
      return action.payload;
    }
    case "logout": {
      return null;
    }
    default: {
      // eslint-disable-next-line babel/no-unused-expressions
      (action: empty); // flow cast to empty - this will error if we've forgotten to handle an action
      return state;
    }
  }
}
