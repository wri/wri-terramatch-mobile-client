// Don't use StyleSheet.hardlineWidth on devices with decimal PixelRatio until https://github.com/facebook/react-native/issues/22927 is resolved
import { Dimensions, PixelRatio, StyleSheet } from "react-native";
import Colours from "./colours";

const hairlineWidth = Number.isInteger(PixelRatio.get()) ? StyleSheet.hairlineWidth : 1;
export const IsSmallDevice = Dimensions.get("window").width <= 320;

export default Object.freeze({
  Margins: {
    tiny: 6,
    small: 10,
    medium: 20,
    large: 40,
    massive: 60
  },
  BorderRadius: {
    small: 4,
    medium: 12,
    large: 16
  },
  FullWidth: {
    width: "100%"
  },
  FlexRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  Dividers: {
    full: {
      borderColor: Colours.boldShadow,
      borderBottomWidth: hairlineWidth,
      height: 0,
      width: "100%"
    },
    partial: {
      borderColor: Colours.boldShadow,
      borderBottomWidth: hairlineWidth,
      height: 0,
      marginLeft: 22
    }
  }
});
