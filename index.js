/**
 * @format
 */

import { AppRegistry, Platform, UIManager } from "react-native";
import { Navigation } from "react-native-navigation";
import Config from "react-native-config";
import { Sentry } from "react-native-sentry";

import App from "./App";
import BackgroundMessagingHandler from "./BackgroundMessagingHandler";

// Setup crash logging before doing anything else
if (!__DEV__) {
  Sentry.config(Config.SENTRY_DSN).install();
  Sentry.setShouldSendCallback(event => true);
}

// Enable animations on Android
if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(false);
  require("intl"); // import intl object
  //Spanish locales
  require("intl/locale-data/jsonp/es-AR"); // load the required locale details
  require("intl/locale-data/jsonp/es-BO"); // load the required locale details
  require("intl/locale-data/jsonp/es-CL"); // load the required locale details
  require("intl/locale-data/jsonp/es-CO"); // load the required locale details
  require("intl/locale-data/jsonp/es-CR"); // load the required locale details
  require("intl/locale-data/jsonp/es-DO"); // load the required locale details
  require("intl/locale-data/jsonp/es-EC"); // load the required locale details
  require("intl/locale-data/jsonp/es-SV"); // load the required locale details
  require("intl/locale-data/jsonp/es-GT"); // load the required locale details
  require("intl/locale-data/jsonp/es-HN"); // load the required locale details
  require("intl/locale-data/jsonp/es-MX"); // load the required locale details
  require("intl/locale-data/jsonp/es-NI"); // load the required locale details
  require("intl/locale-data/jsonp/es-PA"); // load the required locale details
  require("intl/locale-data/jsonp/es-PY"); // load the required locale details
  require("intl/locale-data/jsonp/es-PE"); // load the required locale details
  require("intl/locale-data/jsonp/es-PR"); // load the required locale details
  require("intl/locale-data/jsonp/es-ES"); // load the required locale details
  require("intl/locale-data/jsonp/es-UY"); // load the required locale details
  require("intl/locale-data/jsonp/es-VE"); // load the required locale details

  //English locales
  require("intl/locale-data/jsonp/en-AU"); // load the required locale details
  require("intl/locale-data/jsonp/en-BZ"); // load the required locale details
  require("intl/locale-data/jsonp/en-CA"); // load the required locale details
  require("intl/locale-data/jsonp/en-GB"); // load the required locale details
  require("intl/locale-data/jsonp/en-IN"); // load the required locale details
  require("intl/locale-data/jsonp/en-IE"); // load the required locale details
  require("intl/locale-data/jsonp/en-JM"); // load the required locale details
  require("intl/locale-data/jsonp/en-NZ"); // load the required locale details
  require("intl/locale-data/jsonp/en-PH"); // load the required locale details
  require("intl/locale-data/jsonp/en-ZA"); // load the required locale details
  require("intl/locale-data/jsonp/en-TT"); // load the required locale details
  require("intl/locale-data/jsonp/en-US"); // load the required locale details
}

const app = new App();

Navigation.events().registerAppLaunchedListener(() => {
  app.setupApp();
});

AppRegistry.registerHeadlessTask("RNFirebaseBackgroundMessage", () => BackgroundMessagingHandler);

export default app;
