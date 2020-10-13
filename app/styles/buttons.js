import { StyleSheet } from "react-native";

import colours from "./colours";
import Layout from "./layout";
import { textStyles } from "./text";

const BaseButtonStyle = Object.freeze({
  ...StyleSheet.flatten(textStyles.button),
  alignSelf: "stretch",
  borderRadius: Layout.BorderRadius.small,
  borderWidth: 0,
  paddingHorizontal: Layout.Margins.large,
  minHeight: 40,
  textTransform: "uppercase"
});

const PrimaryButtonStyle = Object.freeze({
  ...BaseButtonStyle,
  backgroundColor: colours.primary,
  color: colours.black
});

const PrimaryDisabledButtonStyle = Object.freeze({
  ...BaseButtonStyle,
  backgroundColor: colours.lightGrey,
  color: colours.white
});

const SecondaryButtonStyle = Object.freeze({
  ...BaseButtonStyle,
  backgroundColor: colours.white,
  borderColor: colours.brownGrey,
  borderWidth: 1,
  color: colours.primary
});

const SmallButtonStyle = Object.freeze({
  maxWidth: "45%"
});

const buttonStyles = StyleSheet.create({
  // yellow button with black text
  primary: {
    ...PrimaryButtonStyle
  },
  // yellow button with white text
  reversePrimary: {
    ...SecondaryButtonStyle
  },
  // need designs for this.
  primaryDisabled: {
    ...PrimaryDisabledButtonStyle
  },
  // centered primary button
  centeredPrimaryButton: {
    ...PrimaryButtonStyle,
    marginTop: Layout.Margins.large,
    alignSelf: "center"
  },
  // centered primary button with disabled styling
  centeredPrimaryButtonDisabled: {
    ...PrimaryDisabledButtonStyle,
    marginTop: Layout.Margins.large,
    alignSelf: "center"
  },
  // white button with blue text
  centeredSecondaryButton: {
    ...SecondaryButtonStyle,
    marginTop: Layout.Margins.large,
    alignSelf: "center"
  },
  secondary: {
    ...SecondaryButtonStyle
  },
  // gray button with white text
  tertiary: {
    ...BaseButtonStyle,
    backgroundColor: colours.brownGrey,
    color: colours.white
  },
  // blue button with white text
  quaternary: {
    ...BaseButtonStyle,
    backgroundColor: colours.primary,
    color: colours.white,
    borderWidth: 1,
    borderColor: colours.primary
  },
  // white button with black text and blue border
  quinary: {
    ...SecondaryButtonStyle,
    color: colours.black,
    borderWidth: 1,
    borderColor: colours.primary,
    alignSelf: "center",
    width: "100%"
  },
  hero: {
    ...PrimaryButtonStyle,
    backgroundColor: colours.secondary
  },
  // smaller button variant that appears on forms
  isSmall: {
    ...SmallButtonStyle
  },
  // floating button on funding screen
  fab: {
    alignItems: "center",
    borderRadius: 56 / 2,
    bottom: Layout.Margins.medium,
    justifyContent: "space-around",
    position: "absolute",
    right: Layout.Margins.medium,
    height: 56,
    width: 56
  },
  // wrapper for side by side buttons, used on forms
  buttonWrapper: {
    ...Layout.FlexRow
  }
});

export default buttonStyles;
