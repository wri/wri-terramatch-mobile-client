// @flow

import type { AppStore } from "./app/redux/redux.types";
import { Platform } from "react-native";
import MapboxGL from "@react-native-mapbox-gl/maps";
import Config from "react-native-config";
import { Navigation } from "react-native-navigation";
import firebase from "react-native-firebase";
import { Sentry } from "react-native-sentry";

// Redux imports
import { Provider } from "react-redux";
import createStore from "./app/redux/configureStore";

import wriApi from "./app/api/wri";

import { getAnalyticsNameFor, registerScreens } from "./app/screens";
import { setI18nConfig } from "./app/locales/";

// Utils
import { configurePushNotifications, resetInitialNotification } from "./app/utils/pushNotifications";
import { configureDeepLinks, resetInitialDeepLink } from "./app/utils/deepLinks";

import Styles from "./app/styles";
import { launchStartupRoot } from "./app/redux/app/actions";

export default class App {
  store: ?AppStore;

  constructor() {
    this.store = null;
    // Initialise the MapBox
    MapboxGL.setAccessToken(Config.MAPBOX_TOKEN);
  }

  async launchRoot() {
    setI18nConfig();

    await Navigation.setDefaultOptions({
      ...Styles.Navigator.default
    });

    if (this.store) {
      this.store.dispatch(launchStartupRoot());
    }
  }

  addAnalyticsObservers() {
    Navigation.events().registerComponentDidAppearListener(({ componentId, componentName }) => {
      try {
        const analyticsName = getAnalyticsNameFor(componentName);
        if (analyticsName) {
          firebase.analytics().setCurrentScreen(analyticsName, analyticsName);
        }
      } catch (e) {
        console.warn("3SC", e);
        Sentry.captureException(e);
      }
    });
  }

  setupApp() {
    if (__DEV__) {
      // only enable analytic events if the app is not in development mode
      firebase.analytics().setAnalyticsCollectionEnabled(false);
    }

    if (this.store) {
      if (Platform.OS === "android") {
        resetInitialNotification();
        resetInitialDeepLink();
      }
      this.launchRoot();
      return;
    }

    const { store } = createStore(async () => {
      wriApi.installAuthInterceptor(store);
      registerScreens(store, Provider);
      configurePushNotifications(store);
      configureDeepLinks(store);
      this.addAnalyticsObservers();
      this.store = store;
      await this.launchRoot();
    });
  }
}
