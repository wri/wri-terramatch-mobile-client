// @flow

import type { AppStore } from "../redux/redux.types";
import { Linking } from "react-native";
import { checkForVerificationTokenInURL } from "../redux/wri-api/auth/actions";
import { Sentry } from "react-native-sentry";
import { launchLoggedInRoot, refreshData } from "../redux/app/actions";
import { createDestinationScreenForDeepLink, displayScreenAsModal } from "../screens";

export function configureDeepLinks(store: AppStore) {
  Linking.addEventListener("url", async event => {
    const url = event.url;
    if (!url) {
      return;
    }

    store.dispatch(refreshData());

    const isLoggedIn = !!store.getState().wri.auth.login.data?.token;
    const linkDestination = createDestinationScreenForDeepLink(url, isLoggedIn);
    if (linkDestination) {
      displayScreenAsModal(linkDestination);
    } else {
      try {
        await store.dispatch(checkForVerificationTokenInURL(url));
      } catch (e) {
        console.warn("3SC", e);
        Sentry.captureException(e);
      } finally {
        store.dispatch(launchLoggedInRoot(true));
      }
    }
  });
}

/**
 * Checks to see if the app was opened through the user clicking on a deep link
 *
 * If so, it returns that url, and discards so next time this function is called it is not returned. This helps
 * with ensuring deep linls are only handled once.
 */
let hasObtainedInitialDeepLink = false;
export async function getInitialDeepLinkAndDiscard(): Promise<?string> {
  if (hasObtainedInitialDeepLink) {
    return null;
  }
  const deepLink = await Linking.getInitialURL();
  hasObtainedInitialDeepLink = true;
  return deepLink;
}

export function resetInitialDeepLink() {
  hasObtainedInitialDeepLink = false;
}
