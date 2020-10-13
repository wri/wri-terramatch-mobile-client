import { Platform, StyleSheet } from "react-native";

import colours from "./colours";
import Layout from "./layout";

/**
 * On Android bold font variant will be used for anything with weight 500 or above, regular otherwise.
 */
const fontWeights = Object.freeze({
  light: "300",
  lightRegular: "400",
  regular: "500",
  medium: "600",
  heavy: "700",
  heavier: "800"
});

/**
 * Font family name is the file name on Android, and the embedded font name on iOS
 */
export const FONT_FAMILY = Platform.select({ android: "acuminprocond", ios: "Acumin Pro Condensed" });
export const SECONDARY_FONT_FAMILY = "Georgia";

const textColours = Object.freeze({
  accent: colours.primary,
  hero: colours.secondary,
  body: colours.body,
  bodySecondary: colours.bodyHero,
  primary: colours.white,
  heading: colours.black,
  subheading: colours.brownGrey,
  error: colours.red,
  input: colours.black87,
  hint: colours.black38
});

const textStyles = StyleSheet.create({
  // longer bodies of text, such as profile -> about.
  body: {
    backgroundColor: "transparent",
    color: textColours.body,
    fontFamily: SECONDARY_FONT_FAMILY,
    fontSize: 15,
    fontWeight: fontWeights.light,
    lineHeight: 25
  },
  primaryFontBody: {
    fontFamily: FONT_FAMILY,
    fontWeight: fontWeights.light,
    fontCondensed: true
  },
  // small text summaries, such as within the profile card.
  bodyHero: {
    backgroundColor: "transparent",
    color: textColours.bodySecondary,
    fontCondensed: true,
    fontFamily: FONT_FAMILY,
    fontSize: 14,
    fontWeight: fontWeights.lightRegular, // TODO: work out why this is still bold
    lineHeight: 19
  },
  button: {
    color: colours.primary,
    fontCondensed: true,
    fontFamily: FONT_FAMILY,
    fontSize: 14,
    fontWeight: fontWeights.heavy,
    backgroundColor: "transparent"
  },
  centered: {
    textAlign: "center"
  },
  uppercase: {
    textTransform: "uppercase"
  },
  emphasis: {
    fontWeight: fontWeights.medium
  },
  // large black title text, shown on profile screen.
  h1: {
    backgroundColor: "transparent",
    color: textColours.heading,
    fontCondensed: true,
    fontFamily: FONT_FAMILY,
    fontSize: 35,
    fontWeight: fontWeights.heavy,
    lineHeight: 40
  },
  // large white title text, shown on profile screen.
  secondaryH1: {
    backgroundColor: "transparent",
    color: textColours.primary,
    fontCondensed: true,
    fontFamily: FONT_FAMILY,
    fontSize: 35,
    fontWeight: fontWeights.heavy,
    lineHeight: 40
  },
  // large yellow title text, shown on profile screen.
  tertiaryH1: {
    backgroundColor: "transparent",
    color: textColours.hero,
    fontCondensed: true,
    fontFamily: FONT_FAMILY,
    fontSize: 35,
    fontWeight: fontWeights.heavy,
    lineHeight: 40
  },
  // white title text, shown on home screen.
  h2: {
    backgroundColor: "transparent",
    color: textColours.primary,
    fontCondensed: true,
    fontFamily: FONT_FAMILY,
    fontSize: 26,
    fontWeight: fontWeights.heavy,
    lineHeight: 32
  },
  // dark title text, shown in project card
  secondaryH2: {
    backgroundColor: "transparent",
    color: textColours.heading,
    fontCondensed: true,
    fontFamily: FONT_FAMILY,
    fontSize: 26,
    fontWeight: fontWeights.heavy,
    lineHeight: 32
  },
  // black heading text, shown in project card.
  h3: {
    backgroundColor: "transparent",
    color: textColours.heading,
    fontCondensed: true,
    fontFamily: FONT_FAMILY,
    fontSize: 21,
    fontWeight: fontWeights.heavy,
    lineHeight: 25
  },
  h4: {
    backgroundColor: "transparent",
    color: textColours.heading,
    fontCondensed: true,
    fontFamily: FONT_FAMILY,
    fontSize: 16,
    fontWeight: fontWeights.heavy,
    lineHeight: 22
  },
  // subheading, e.g. on Settings screen
  h5: {
    color: textColours.subheading,
    fontCondensed: true,
    fontFamily: FONT_FAMILY,
    fontSize: 16,
    fontWeight: fontWeights.heavy,
    lineHeight: 25
  },
  h6: {
    color: textColours.heading,
    fontSize: 14,
    lineHeight: 25
  },
  h7: {
    color: textColours.subheading,
    fontSize: 14,
    lineHeight: 25
  },
  bodyTiny: {
    fontCondensed: true,
    fontFamily: FONT_FAMILY,
    fontSize: 12,
    lineHeight: 25
  },
  input: {
    backgroundColor: "transparent",
    color: textColours.input,
    fontCondensed: true,
    fontFamily: FONT_FAMILY,
    fontSize: 16,
    fontWeight: fontWeights.light,
    lineHeight: 20
  },
  inputPlaceholder: {
    backgroundColor: "transparent",
    color: textColours.hint,
    fontCondensed: true,
    fontFamily: FONT_FAMILY,
    fontSize: 16,
    fontWeight: fontWeights.light,
    lineHeight: 20
  },
  error: {
    color: textColours.error,
    fontSize: 15,
    fontCondensed: true,
    fontWeight: fontWeights.light,
    fontFamily: FONT_FAMILY,
    backgroundColor: "transparent",
    textAlign: "left"
  },
  tableCellTitle: {
    color: textColours.black87,
    fontCondensed: true,
    fontFamily: FONT_FAMILY,
    fontSize: 18,
    fontWeight: fontWeights.light,
    lineHeight: 24
  },
  videoHeader: {
    color: colours.black,
    fontFamily: FONT_FAMILY,
    fontSize: 20,
    fontWeight: fontWeights.medium,
    marginHorizontal: Layout.Margins.medium,
    marginTop: Layout.Margins.medium,
    textAlign: "center"
  },
  videoSubtitle: {
    color: colours.black,
    fontFamily: SECONDARY_FONT_FAMILY,
    fontSize: 16,
    marginTop: Layout.Margins.small,
    marginEnd: Layout.Margins.medium,
    marginStart: Layout.Margins.medium,
    textAlign: "center"
  },
  videoWarning: {
    color: colours.black,
    fontFamily: SECONDARY_FONT_FAMILY,
    fontSize: 16,
    marginTop: Layout.Margins.medium,
    marginEnd: Layout.Margins.medium,
    marginStart: Layout.Margins.medium,
    textAlign: "center"
  },
  videoHintHeader: {
    color: colours.black,
    fontFamily: FONT_FAMILY,
    fontSize: 20,
    fontWeight: fontWeights.medium,
    marginHorizontal: Layout.Margins.medium
  },
  videoHintSubtitle: {
    color: colours.black,
    fontFamily: SECONDARY_FONT_FAMILY,
    fontSize: 16,
    margin: Layout.Margins.medium
  }
});

export { fontWeights, textStyles, textColours };
