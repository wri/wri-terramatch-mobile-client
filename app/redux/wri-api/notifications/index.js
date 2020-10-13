// @flow

import type { AsyncState, ReducerMap } from "../../redux.types";
import type { FetchNotificationsAction, MarkedReadNotificationsAction } from "./actions";
import { NotificationReadAll } from "wri-api";
import { combineReducers } from "redux";
import { asyncActionReducer } from "../../asyncActionReducer";

/**
 * Type definition for the state managed by this reducer and its subreducers
 */
export type State = {|
  +notifications: AsyncState<NotificationReadAll>
|};

/**
 * Type definition for the actions supported by this reducer and its subreducers
 */
export type Actions = FetchNotificationsAction | MarkedReadNotificationsAction;

export default combineReducers<ReducerMap<State, any>, any>({
  notifications: asyncActionReducer.bind(this, "wri/notifications/list")
});
