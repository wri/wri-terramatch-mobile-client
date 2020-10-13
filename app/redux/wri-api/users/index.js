// @flow

import type { AsyncState, LogoutAction, ReducerMap } from "../../redux.types";

import type { DeviceRead, UserRead } from "wri-api";
import type {
  AcceptInvitationAction,
  ConfirmOrgApprovalNoticeAction,
  CreateAccountAction,
  FetchMeAction,
  UpdateDeviceAction
} from "./actions";
import { combineReducers } from "redux";
import { asyncActionReducer } from "../../asyncActionReducer";

/**
 * Type definition for the state managed by this reducer and its subreducers
 */
export type State = {|
  +createAccount: AsyncState<UserRead>,
  +device: AsyncState<DeviceRead>,
  +acceptInvitation: AsyncState<UserRead>,
  +hasConfirmedOrgApprovalNotice: boolean,
  +me: AsyncState<UserRead>
|};

/**
 * Type definition for the actions supported by this reducer and its subreducers
 */

export type Actions =
  | AcceptInvitationAction
  | ConfirmOrgApprovalNoticeAction
  | CreateAccountAction
  | FetchMeAction
  | UpdateDeviceAction;

export default combineReducers<ReducerMap<State, any>, any>({
  createAccount: asyncActionReducer.bind(this, "wri/users/create"),
  device: asyncActionReducer.bind(this, "wri/users/device/update"),
  acceptInvitation: asyncActionReducer.bind(this, "wri/users/accept"),
  hasConfirmedOrgApprovalNotice: orgApprovalNoticeConfirmationReducer,
  me: asyncActionReducer.bind(this, "wri/users/me/get")
});

function orgApprovalNoticeConfirmationReducer(
  state: boolean = false,
  action: ConfirmOrgApprovalNoticeAction | LogoutAction
): boolean {
  switch (action.type) {
    case "wri/users/confirm_org_approval": {
      return true;
    }
    case "logout": {
      return false;
    }
    default: {
      // eslint-disable-next-line babel/no-unused-expressions
      (action: empty); // flow cast to empty - this will error if we've forgotten to handle an action
      return state;
    }
  }
}
