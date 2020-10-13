// @flow

import type { AppActions, AsyncAction, AsyncState, Dispatch, DispatchPromise, GetState, Thunk } from "../redux.types";
// $FlowFixMe
import { batch } from "react-redux";
import { fetchNewsContent, fetchProjectsContent } from "../wordpress/actions";
import {
  fetchFundingSources,
  fetchFundingBrackets,
  fetchLandOwnershipTypes,
  fetchLandSizes,
  fetchCarbonTypes,
  fetchLandTypes,
  fetchReportingFrequencies,
  fetchReportingLevels,
  fetchRestorationGoal,
  fetchRestorationMethods,
  fetchRevenueDrivers,
  fetchSustainableDevelopmentGoals,
  fetchVisibilities
} from "../wri-api/projects/actions";
import { fetchReceivedInterests, fetchInitiatedInterests, fetchAllMatches } from "../wri-api/interests/actions";
import { isJwtExpired } from "../../utils/decodeJwt";
import { fetchMyOrganisationData, fetchOrganisationTypes } from "../wri-api/organisations/actions";
import { checkForVerificationToken } from "../wri-api/auth/actions";
import { fetchMe, updateDevice } from "../wri-api/users/actions";
import { launchRoot, type RootId } from "../../screens";
import { fetchContinents, fetchCountries } from "../wri-api/actions";
import { fetchNotifications } from "../wri-api/notifications/actions";

import { checkPermission, fetchPushToken, requestPermission } from "../../utils/pushNotifications";

/**
 * Launches the most appropriate root to show when the app is first launched.
 *
 * The exact root shown will depend on whether the user is logged in and whether they have finished registering their
 * account.
 */
export function launchStartupRoot(): Thunk<void> {
  return (dispatch: Dispatch, getState: GetState) => {
    const appState = getState();
    const loginState = appState.wri.auth.login;
    const authToken = loginState?.data?.token;
    const isUserLoggedIn = !!authToken;
    dispatch(fetchNewsContent());
    dispatch(fetchProjectsContent());

    if (isUserLoggedIn) {
      if (!authToken || isJwtExpired(authToken)) {
        launchRoot("login", false);
      } else {
        dispatch(launchLoggedInRoot(true));
      }
    } else {
      launchRoot("welcome", false);
    }
  };
}

/**
 * Launches the most appropriate root to show when the user logs in.
 *
 * The exact root shown will depend on whether they have finished registering their account.
 */
export function launchLoggedInRoot(
  canReloadData: boolean = false,
  /**
   * This parameter allows the caller to customise exactly how the root is launched, or whether it is even launched at all.
   */
  launcher: (rootId: RootId) => any = rootId => launchRoot(rootId, true)
): Thunk<Promise<void>> {
  return async (dispatch: Dispatch, getState: GetState): Promise<void> => {
    const appState = getState();
    const userData = appState.wri.users.me.data;

    // check that all of the endpoints have been called as pitches/offer forms require this data
    const restorationMethodsData = appState.wri.projects.restorationMethods.data;
    const landSizesData = appState.wri.projects.landSizes.data;
    const continentsData = appState.wri.continents.data;
    const reportingFrequenciesData = appState.wri.projects.reportingFrequencies.data;
    const reportingLevelsData = appState.wri.projects.reportingLevels.data;
    const landOwnershipTypesData = appState.wri.projects.landOwnershipTypes.data;
    const landTypesData = appState.wri.projects.landTypes.data;
    const carbonTypesData = appState.wri.projects.carbonTypes.data;
    const fundingSourcesData = appState.wri.projects.fundingSources.data;
    const restorationGoalsData = appState.wri.projects.restorationGoals.data;
    const sustainableDevelopmentGoalsData = appState.wri.projects.sustainableDevelopmentGoals.data;
    const revenueDriversData = appState.wri.projects.revenueDrivers.data;
    const countriesData = appState.wri.countries.data;
    const visibilitiesData = appState.wri.projects.visibilities.data;
    const organisationTypesData = appState.wri.organisations.types.data;

    const gotAllFormContentData =
      restorationMethodsData &&
      landSizesData &&
      continentsData &&
      reportingFrequenciesData &&
      reportingLevelsData &&
      landOwnershipTypesData &&
      landTypesData &&
      carbonTypesData &&
      fundingSourcesData &&
      restorationGoalsData &&
      sustainableDevelopmentGoalsData &&
      revenueDriversData &&
      countriesData &&
      organisationTypesData &&
      visibilitiesData;

    if (canReloadData || !gotAllFormContentData) {
      // Temporarily launch the sync root whilst we attempt to pull down the latest data
      batch(() => {
        sync(userData, dispatch, appState, launcher);
      });
    } else if (userData) {
      // Make sure the WRI API knows about this device, now that we are logged in
      dispatch(updateDevice());

      const hasVerifiedEmail = !!userData.email_address_verified_at ?? false;
      const possibleOrganisationId = userData.organisation_id;
      const hasSetupOrganisation = !!possibleOrganisationId ?? false;
      if (hasVerifiedEmail && hasSetupOrganisation) {
        dispatch(fetchMyOrganisationData());
        dispatch(fetchAllMatches());
        dispatch(fetchReceivedInterests());
        dispatch(fetchInitiatedInterests());
        dispatch(fetchNotifications());

        // We won't send the user into the main app until they confirm that their organisation has been approved
        // See https://app.zeplin.io/project/5d0a35af2b90ef2cf82ca80e/screen/5d80e8a699ff9b54ca273e95
        const hasUserConfirmedOrgApprovalNotice = appState.wri.users.hasConfirmedOrgApprovalNotice;
        if (!hasUserConfirmedOrgApprovalNotice) {
          launcher("welcome");
        } else {
          launcher("main");
        }

        const enabled = await checkPermission();
        if (!enabled) {
          try {
            await requestPermission();
            fetchPushToken(dispatch);
          } catch (err) {
            console.warn("3SC", "Push Permission Declined");
          }
        } else {
          fetchPushToken(dispatch);
        }
      } else if (!hasVerifiedEmail) {
        launcher("verify");
      } else if (!hasSetupOrganisation) {
        launcher("signup_organisation");
      } else {
        // It would be an error to ever get here because every logical combination should be handled by the above if chain...
        launcher("login");
      }
    } else {
      launcher("login");
    }
  };
}

/**
 * Thunk that when dispatched will refresh all top-level app data
 */
export function refreshData(): Thunk<void> {
  return (dispatch: Dispatch, getState: GetState) => {
    // Soft launch the app so important user data is refreshed
    batch(() => {
      dispatch(launchLoggedInRoot(false, () => {}));
    });
  };
}

/**
 * Helper function used for the above that will resync user data
 */
async function sync(userData, dispatch, appState, launcher: (rootId: RootId) => any): Promise<void> {
  launcher("sync");
  try {
    try {
      await dispatch(checkForVerificationToken());
    } catch (ignored) {
      // TODO: This means the verify failed... Sometimes this is because the user has already verified
    }
    await Promise.all([
      dispatch(fetchMe()),
      syncData(fetchOrganisationTypes, dispatch, appState.wri.organisations.types),
      syncData(fetchCountries, dispatch, appState.wri.countries),
      syncData(fetchRestorationMethods, dispatch, appState.wri.projects.restorationMethods),
      syncData(fetchFundingBrackets, dispatch, appState.wri.projects.fundingBrackets),
      syncData(fetchContinents, dispatch, appState.wri.continents),
      syncData(fetchLandSizes, dispatch, appState.wri.projects.landSizes),
      syncData(fetchReportingFrequencies, dispatch, appState.wri.projects.reportingFrequencies),
      syncData(fetchReportingLevels, dispatch, appState.wri.projects.reportingLevels),
      syncData(fetchLandOwnershipTypes, dispatch, appState.wri.projects.landOwnershipTypes),
      syncData(fetchLandTypes, dispatch, appState.wri.projects.landTypes),
      syncData(fetchCarbonTypes, dispatch, appState.wri.projects.carbonTypes),
      syncData(fetchFundingSources, dispatch, appState.wri.projects.fundingSources),
      syncData(fetchRestorationGoal, dispatch, appState.wri.projects.restorationGoals),
      syncData(fetchSustainableDevelopmentGoals, dispatch, appState.wri.projects.sustainableDevelopmentGoals),
      syncData(fetchRevenueDrivers, dispatch, appState.wri.projects.revenueDrivers),
      syncData(fetchVisibilities, dispatch, appState.wri.projects.visibilities)
    ]);
  } catch (err) {
    // Ignore issues with sync
    // todo: Handle fails better - perhaps a retry button
    console.warn("3SC", "Error occurred during sync", err);
  } finally {
    dispatch(launchLoggedInRoot(false, launcher));
  }
}

/**
 * Helper function used for the above that will resync app data
 */
function syncData(
  actionCreator: () => AppActions & AsyncAction<any>,
  dispatch: DispatchPromise,
  asyncState: AsyncState<any>
): Promise<any> {
  const action: any = actionCreator();
  if (!asyncState.data) {
    return dispatch(action);
  }
  dispatch(action);
  return Promise.resolve();
}
