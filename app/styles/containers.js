import { PixelRatio, StyleSheet, Platform } from "react-native";

import colours from "./colours";
import Layout, { IsSmallDevice } from "./layout";

// Don't use StyleSheet.hardlineWidth on devices with decimal PixelRatio until https://github.com/facebook/react-native/issues/22927 is resolved
const hairlineWidth = Number.isInteger(PixelRatio.get()) ? StyleSheet.hairlineWidth : 1;

const containerStyles = StyleSheet.create({
  // dark background screen.
  screen: {
    backgroundColor: colours.background,
    flex: 1,
    padding: IsSmallDevice ? Layout.Margins.small : Layout.Margins.medium,
    borderTopColor: colours.primary,
    borderTopWidth: 4
  },
  // light background screen.
  secondaryScreen: {
    backgroundColor: colours.backgroundSecondary,
    flex: 1,
    padding: IsSmallDevice ? Layout.Margins.small : Layout.Margins.medium,
    borderTopColor: colours.primary,
    borderTopWidth: 4
  },
  // table view divider.
  horizontalSeparator: {
    alignSelf: "stretch",
    backgroundColor: colours.tableDivider,
    height: hairlineWidth,
    marginVertical: Layout.Margins.small
  },
  textInput: {
    backgroundColor: "white",
    borderBottomColor: colours.boldShadow,
    borderBottomWidth: 1,
    flexGrow: 1,
    padding: Layout.Margins.small
  },
  picker: {
    ...Platform.select({
      ios: {
        height: 120
      },
      android: {}
    })
  },
  pickerItems: {
    ...Platform.select({
      ios: {
        height: 120
      },
      android: {}
    })
  },
  tableCell: {
    alignItems: "center",
    flexDirection: "row",
    height: 56,
    paddingLeft: 22
  },
  uploadIcon: {
    height: 28,
    resizeMode: "contain",
    width: 28,
    alignItems: "flex-end",
    tintColor: colours.black38
  },
  uploadText: {
    color: colours.black38,
    fontSize: 15,
    padding: Layout.Margins.small
  },
  uploadContainer: {
    flex: 1,
    marginVertical: Layout.Margins.small,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    borderColor: colours.border,
    borderWidth: 1,
    padding: Layout.Margins.large,
    borderRadius: Layout.BorderRadius.small
  },
  cardShadow: {
    ...Platform.select({
      ios: {
        shadowColor: colours.black54,
        shadowOpacity: 0.5,
        shadowRadius: 2,
        shadowOffset: {
          height: 1,
          width: 1
        }
      },
      android: {
        elevation: 7
      }
    })
  }
});

export default containerStyles;
