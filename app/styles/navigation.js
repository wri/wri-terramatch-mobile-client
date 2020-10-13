import { Platform } from "react-native";

import Colours from "./colours";
import { FONT_FAMILY, textColours } from "./text";

/**
 * Defines the default navigator style.
 * Each screen has this applied by default, and can then be overriden within screens like:
 *
 * ```
   static options(passProps) {
     return {
       topBar: {
         title: {
           text: "Home"
         }
       }
     };
   }
 * ```
 * Docs available here: https://wix.github.io/react-native-navigation/#/docs/styling
 */
export default {
  default: {
    bottomTab: {
      // we only want certain font styling for the tab bar on Android.
      fontFamily: Platform.select({
        ios: undefined,
        android: FONT_FAMILY
      }),
      fontSize: Platform.select({
        ios: undefined,
        android: 14
      }),
      iconColor: Colours.black,
      selectedFontSize: Platform.select({
        ios: undefined,
        android: 14
      }),
      selectedIconColor: Colours.primary,
      selectedTextColor: Colours.primary,
      textColor: Colours.black
    },
    bottomTabs: {
      backgroundColor: Colours.white,
      drawBehind: true,
      titleDisplayMode: "alwaysShow", // only affects Android.
      visible: false
    },
    layout: {
      backgroundColor: Colours.white, // only one screen has a black background, so the default colour is different.
      orientation: "portrait"
    },
    statusBar: {
      backgroundColor: Colours.white,
      style: "dark"
    },
    topBar: {
      background: {
        color: Colours.white
      },
      // todo: change to use icon once exported.
      backButton: {
        color: Colours.black,
        title: "Back"
      },
      buttonColor: Colours.black,
      drawBehind: false,
      elevation: 16,
      noBorder: false,
      subtitle: {
        color: "black"
      },
      title: {
        color: textColours.black,
        fontFamily: `${FONT_FAMILY}_bold`,
        fontSize: 24
      },
      visible: true
    }
  }
};
