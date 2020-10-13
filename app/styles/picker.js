import { StyleSheet } from "react-native";

import colours from "./colours";
import Layout from "./layout";

const pickerSelectStyles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-unused-styles
  inputIOSContainer: {
    padding: Layout.Margins.medium,
    borderColor: colours.border,
    borderWidth: 1,
    flex: 1,
    justifyContent: "center",
    paddingRight: 50
  },
  inputAndroidContainer: {
    borderColor: colours.border,
    borderRadius: Layout.BorderRadius.small,
    borderWidth: 1,
    justifyContent: "center"
  }
});

export default pickerSelectStyles;
