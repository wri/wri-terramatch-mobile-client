// @flow

import type { Dispatch, GetState, NamedAsyncAction, Thunk } from "../../redux.types";
import { DeviceCreate, DeviceRead, DeviceUpdate, UserAccept, UserCreate, UserRead } from "wri-api";
import wriAPI from "../../../api/wri";
import { createAsyncAction, shouldPerformAsyncAction } from "../../conditionalActions";

import { Platform } from "react-native";
import firebase from "react-native-firebase";
import installationId from "../../../utils/installationId";
import { errorCodes, errorDomains } from "../../../constants/errorMessaging";
import TSCError from "../../../utils/tscError";
import { isJwtExpired } from "../../../utils/decodeJwt";

export type ConfirmOrgApprovalNoticeAction = {|
  +type: "wri/users/confirm_org_approval"
|};
export type CreateAccountAction = NamedAsyncAction<"wri/users/create", UserRead>;
export type AcceptInvitationAction = NamedAsyncAction<"wri/users/accept", UserRead>;
export type FetchMeAction = NamedAsyncAction<"wri/users/me/get", UserRead>;
export type UpdateDeviceAction = NamedAsyncAction<"wri/users/device/update", DeviceRead>;

export function confirmOrgApprovalNotice(): ConfirmOrgApprovalNoticeAction {
  return {
    type: "wri/users/confirm_org_approval"
  };
}

export function createAccount(userDetails: UserCreate): CreateAccountAction {
  return createAsyncAction({
    type: "wri/users/create",
    payload: wriAPI.users.usersPost(userDetails)
  });
}

export function acceptInvitation(userDetails: UserAccept): AcceptInvitationAction {
  return createAsyncAction({
    type: "wri/users/accept",
    payload: wriAPI.users.usersAcceptPost(userDetails)
  });
}

export function fetchMe(): FetchMeAction {
  return createAsyncAction({
    type: "wri/users/me/get",
    payload: wriAPI.auth.authMeGet()
  });
}

export function updateDevice(): Thunk<void> {
  return (dispatch: Dispatch, getState: GetState) => {
    const appState = getState();
    const updateDeviceState = appState.wri.users.device;

    if (!shouldPerformAsyncAction(updateDeviceState)) {
      return;
    }

    const loginState = appState.wri.auth.login;
    const authToken = loginState?.data?.token;
    const isLoggedIn = !!authToken && !isJwtExpired(authToken);

    if (!isLoggedIn) {
      return;
    }

    const updateAction: UpdateDeviceAction = createAsyncAction({
      type: "wri/users/device/update",
      payload: async () => {
        const hasPermission = await firebase.messaging().hasPermission();

        // If we don't have permission, do not continue.
        if (!hasPermission) {
          throw new TSCError({
            domain: errorDomains.WRI,
            code: errorCodes.WRI_UNEXPECTED_STATE,
            message: "Push permissions not yet granted"
          });
        }

        // Fetch basic details for the device this app is currently running on
        const thisDeviceToken =
          Platform.OS === "android" ? await firebase.messaging().getToken() : appState.device.notifications.apnsToken;

        // On iOS, we need to make sure that we have the APNS token.
        // This may be null if the user hasn't given permission, so we need to handle this case.
        if (!thisDeviceToken) {
          throw new TSCError({
            domain: errorDomains.WRI,
            code: errorCodes.WRI_UNEXPECTED_STATE,
            message: "No push token is available"
          });
        }

        const thisDeviceUuid = await installationId();

        if (!thisDeviceUuid) {
          throw new TSCError({
            domain: errorDomains.WRI,
            code: errorCodes.WRI_UNEXPECTED_STATE,
            message: "Could not generate a device UUID"
          });
        }

        // First work out if there is a previous device record we should be updating, to avoid duplicate devices

        // Hopefully the previous device is already in state from when we last made this call
        let previousDevice: ?DeviceRead = updateDeviceState.data;

        // ...but if it's not, then we'll fetch the user's devices from the server and see if there is one with an
        // identical UUID
        if (!previousDevice) {
          // Fetch all the user's device fresh so we know we are in sync
          const devices = await wriAPI.devices.devicesGet();
          previousDevice = devices.find(device => device.uuid === thisDeviceUuid);
        }

        // Now depending on whether we have a previousDevice or not, we do a PATCH or a POST
        let updatedDevice: ?DeviceRead = null;
        const previousDeviceId: ?number = previousDevice?.id;
        if (!previousDeviceId) {
          updatedDevice = await wriAPI.devices.devicesPost(
            DeviceCreate.constructFromObject({
              push_token: thisDeviceToken,
              os: Platform.OS,
              uuid: thisDeviceUuid
            })
          );
        } else if (previousDevice?.push_token === thisDeviceToken && previousDevice?.uuid === thisDeviceUuid) {
          updatedDevice = previousDevice;
        } else {
          updatedDevice = await wriAPI.devices.devicesIDPatch(
            previousDeviceId,
            DeviceUpdate.constructFromObject({
              push_token: thisDeviceToken,
              uuid: thisDeviceUuid
            })
          );
        }
        if (!updatedDevice) {
          throw new TSCError({
            domain: errorDomains.WRI,
            code: errorCodes.WRI_UNEXPECTED_STATE,
            message: "Could not update device"
          });
        }

        return updatedDevice;
      }
    });

    dispatch(updateAction);
  };
}
