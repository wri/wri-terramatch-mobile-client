// @flow

import { ACTION_TYPE_LOGOUT, type Dispatch, type GetState, type NamedAsyncAction, type Thunk } from "../../redux.types";
import { AuthChange, AuthLogIn, AuthReset, AuthVerify, Empty, TokenRead } from "wri-api";

import { Linking } from "react-native";
import Config from "react-native-config";
import { parse as parseUrl } from "url";

import wriAPI from "../../../api/wri";
import { createAsyncAction } from "../../conditionalActions";
import firebase from "react-native-firebase";
import { isJwtExpired } from "../../../utils/decodeJwt";

export type LoginAction = NamedAsyncAction<"wri/auth/login", TokenRead>;
export type LogoutAction = NamedAsyncAction<"wri/auth/logout", Empty>;
export type RefreshTokenAction = NamedAsyncAction<"wri/auth/refresh", TokenRead>;
export type RequestVerificationAction = NamedAsyncAction<"wri/auth/request_verify", Empty>;
export type VerifyAction = NamedAsyncAction<"wri/auth/verify", Empty>;
export type ResetPasswordAction = NamedAsyncAction<"wri/auth/reset", Empty>;
export type UpdatePasswordAction = NamedAsyncAction<"wri/auth/update_password", Empty>;

/**
 * Creates a thunk that when dispatched will parse the URL (if any) used to launch the app to see if it was a verification
 * link.
 *
 * If it was a verification link then it will automatically send the parsed token to the verify endpoint.
 */
export function checkForVerificationToken(): Thunk<Promise<any>> {
  return async (dispatch: Dispatch) => {
    const initialUrl = await Linking.getInitialURL();

    // todo: investigate missing initialUrl on iOS
    if (!initialUrl) {
      return;
    }

    await dispatch(checkForVerificationTokenInURL(initialUrl));
  };
}

/**
 * Creates a thunk that when dispatched will parse the URL passed into see if it was a verification
 * link.
 *
 * If it was a verification link then it will automatically send the parsed token to the verify endpoint.
 */
export function checkForVerificationTokenInURL(url: string, retry: boolean = true): Thunk<Promise<any>> {
  return async (dispatch: Dispatch) => {
    const parsedUrl = parseUrl(url, true);

    if (parsedUrl.host !== Config.WRI_SITE_DOMAIN) {
      return;
    }

    if (parsedUrl.pathname !== "/verify") {
      return;
    }

    const verificationToken = parsedUrl.query?.token;

    if (!verificationToken) {
      return;
    }

    try {
      await dispatch(
        verifyEmail(
          AuthVerify.constructFromObject({
            token: verificationToken
          })
        )
      );
    } catch (e) {
      // Only retry if retry === true, and only retry once.
      // We retry due to this issue on iOS: https://github.com/AFNetworking/AFNetworking/issues/4279#issuecomment-447108981
      if (retry) {
        await dispatch(
          verifyEmail(
            AuthVerify.constructFromObject({
              token: verificationToken
            })
          )
        );
      }
    }
  };
}

export function logIn(loginDetails: AuthLogIn): LoginAction {
  return createAsyncAction({
    type: "wri/auth/login",
    payload: wriAPI.auth.authLoginPost(loginDetails)
  });
}

export function logout(): Thunk<void> {
  return (dispatch: Dispatch, getState: GetState) => {
    firebase.messaging().deleteToken();

    const appState = getState();

    const loginState = appState.wri.auth.login;
    const authToken = loginState?.data?.token;
    const isLoggedIn = !!authToken && !isJwtExpired(authToken);

    if (isLoggedIn) {
      const deviceState = appState.wri.users.device;
      const deviceID = deviceState.data?.id;

      // Fire-and-forget request to the WRI server to clear our state
      // This has to come before the call below because we still need the auth token present in state to make the WRI logout call
      const action: LogoutAction = createAsyncAction({
        type: "wri/auth/logout",
        payload: async () => {
          if (deviceID) {
            try {
              await wriAPI.devices.devicesIDDelete(deviceID);
            } catch (err) {
              console.warn("3SC", "Could not delete device on logout");
            }
          }

          try {
            return await wriAPI.auth.authLogoutGet();
          } catch (err) {
            console.warn("3SC", "Could not de-authenticate token on server");
            throw err;
          } finally {
            wriAPI.clearToken();
          }
        }
      });
      dispatch(action);
    }

    // Immediately logout by clearing all local state
    dispatch({
      type: ACTION_TYPE_LOGOUT
    });
  };
}

export function refreshToken(): RefreshTokenAction {
  return createAsyncAction({
    type: "wri/auth/refresh",
    payload: wriAPI.auth.authRefreshGet()
  });
}

export function requestVerificationEmail(): RequestVerificationAction {
  return createAsyncAction({
    type: "wri/auth/request_verify",
    payload: wriAPI.auth.authResendGet()
  });
}

export function resetPassword(resetDetails: AuthReset): ResetPasswordAction {
  return createAsyncAction({
    type: "wri/auth/reset",
    payload: wriAPI.auth.authResetPost(resetDetails)
  });
}

export function updatePassword(updatedDetails: AuthChange): UpdatePasswordAction {
  return createAsyncAction({
    type: "wri/auth/update_password",
    payload: wriAPI.auth.authChangePatch(updatedDetails)
  });
}

export function verifyEmail(token: AuthVerify): VerifyAction {
  return createAsyncAction({
    type: "wri/auth/verify",
    payload: wriAPI.auth.authVerifyPatch(token).catch(error => {
      // If we got code 422 it could mean user is already verified, and because we occasionally retry
      // this request due to iOS networking error, we'll ignore said errors.
      if (error.code === 422) {
        // Doesn't matter what is returned here as long as we don't throw, as this state isn't used elsewhere,
        // but this is what the API call returns
        return new Empty();
      }
      throw error;
    })
  });
}
