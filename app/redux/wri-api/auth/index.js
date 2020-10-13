// @flow

import type { AsyncState, ReducerMap } from "../../redux.types";
import type { Empty, TokenRead } from "wri-api";
import type {
  LoginAction,
  LogoutAction,
  RefreshTokenAction,
  RequestVerificationAction,
  ResetPasswordAction,
  VerifyAction,
  UpdatePasswordAction
} from "./actions";
import { combineReducers } from "redux";
import { asyncActionReducer } from "../../asyncActionReducer";

/**
 * Type definition for the state managed by this reducer and its subreducers
 */
export type State = {|
  +login: AsyncState<TokenRead>,
  +logout: AsyncState<Empty>,
  +refresh: AsyncState<TokenRead>,
  +reset: AsyncState<Empty>,
  +verify: AsyncState<Empty>,
  +verifyRequest: AsyncState<Empty>,
  +updatePassword: AsyncState<Empty>
|};

/**
 * Type definition for the actions supported by this reducer and its subreducers
 */
export type Actions =
  | LoginAction
  | LogoutAction
  | RefreshTokenAction
  | RequestVerificationAction
  | VerifyAction
  | ResetPasswordAction
  | UpdatePasswordAction;

export default combineReducers<ReducerMap<State, any>, any>({
  login: asyncActionReducer.bind(this, "wri/auth/login"),
  logout: asyncActionReducer.bind(this, "wri/auth/logout"),
  refresh: asyncActionReducer.bind(this, "wri/auth/refresh"),
  reset: asyncActionReducer.bind(this, "wri/auth/reset"),
  verify: asyncActionReducer.bind(this, "wri/auth/verify"),
  verifyRequest: asyncActionReducer.bind(this, "wri/auth/request_verify"),
  updatePassword: asyncActionReducer.bind(this, "wri/auth/update_password")
});
