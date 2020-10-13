// @flow

import { combineReducers } from "redux";
import notificationsReducer, {
  type State as NotificationsState,
  type Actions as NotificationActions
} from "./notifications";
import type { ReducerMap } from "../redux.types";

/**
 * Type definition for the state managed by this reducer and its subreducers
 */
export type State = {|
  +notifications: NotificationsState
|};

/**
 * Type definition for the actions supported by this reducer and its subreducers
 */
export type Actions = NotificationActions;

export default combineReducers<ReducerMap<State, any>, any>({
  notifications: notificationsReducer
});
