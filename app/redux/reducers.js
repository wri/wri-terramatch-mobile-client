// @flow

import { combineReducers } from "redux";

import deviceReducer, { type State as DeviceState, type Actions as DeviceActions } from "./device";
import wriReducer, { type State as WRIState, type Actions as WRIActions } from "./wri-api";
import wriCacheReducer, { type State as WRICacheState, type Actions as WRICacheActions } from "./wri-api/cache";
import WordpressReducer, { type State as WordpressState, type Actions as WordpressActions } from "./wordpress";
import type { ReducerMap } from "./redux.types";

/**
 * Type definition for the state managed by this reducer and its subreducers
 */
export type State = {|
  +device: DeviceState,
  +wri: WRIState,
  +wriCache: WRICacheState,
  +wordpress: WordpressState
|};

/**
 * Type definition for the actions supported by this reducer and its subreducers
 */
export type Actions = DeviceActions | WRIActions | WRICacheActions | WordpressActions;

export default combineReducers<ReducerMap<State, any>, any>({
  device: deviceReducer,
  wri: wriReducer,
  wriCache: wriCacheReducer,
  wordpress: WordpressReducer
});
