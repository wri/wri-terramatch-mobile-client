import { Platform } from "react-native";

export default {
  addressLine: {
    autoCapitalize: "words",
    autoCorrect: true,
    // Work around https://github.com/facebook/react-native/issues/8932 by definined undefined keyboard on Android
    keyboardType: Platform.select({ android: undefined, ios: "default" })
  },
  email: {
    autoCapitalize: "none",
    autoComplete: "email",
    autoCorrect: Platform.OS === "ios", // Must be on for textContentType to work!
    keyboardType: "email-address",
    textContentType: "emailAddress"
  },
  firstName: {
    autoCapitalize: "words",
    autoComplete: "name",
    autoCorrect: true,
    textContentType: "givenName",
    // Work around https://github.com/facebook/react-native/issues/8932 by definined undefined keyboard on Android
    keyboardType: Platform.select({ android: undefined, ios: "name-phone-pad" })
  },
  lastName: {
    autoCapitalize: "words",
    autoComplete: "name",
    autoCorrect: true,
    textContentType: "familyName",
    // Work around https://github.com/facebook/react-native/issues/8932 by definined undefined keyboard on Android
    keyboardType: Platform.select({ android: undefined, ios: "name-phone-pad" })
  },
  jobTitle: {
    autoCapitalize: "words",
    autoComplete: "name",
    autoCorrect: true,
    // Work around https://github.com/facebook/react-native/issues/8932 by definined undefined keyboard on Android
    keyboardType: Platform.select({ android: undefined, ios: "default" })
  },
  mobileNumber: {
    autoCapitalize: "none",
    autoComplete: "tel",
    autoCorrect: Platform.OS === "ios", // Must be on for textContentType to work!
    textContentType: "telephoneNumber",
    keyboardType: Platform.select({ android: "phone-pad", ios: "number-pad" })
  },
  password: {
    autoCapitalize: "none",
    autoCorrect: false,
    secureTextEntry: true,
    selectTextOnFocus: false,
    textContentType: "password"
  },
  postalCode: {
    autoCapitalize: "characters",
    autoComplete: "postal-code",
    autoCorrect: true,
    textContentType: "postalCode",
    // Work around https://github.com/facebook/react-native/issues/8932 by definined undefined keyboard on Android
    keyboardType: Platform.select({ android: undefined, ios: "default" })
  },
  organisation: {
    autoCapitalize: "words",
    autoCorrect: true,
    textContentType: "none",
    // Work around https://github.com/facebook/react-native/issues/8932 by definined undefined keyboard on Android
    keyboardType: Platform.select({ android: undefined, ios: "default" })
  },
  address1: {
    autoCapitalize: "words",
    autoCorrect: true,
    textContentType: "streetAddressLine1",
    // Work around https://github.com/facebook/react-native/issues/8932 by definined undefined keyboard on Android
    keyboardType: Platform.select({ android: undefined, ios: "default" })
  },
  address2: {
    autoCapitalize: "words",
    autoCorrect: true,
    textContentType: "streetAddressLine2",
    // Work around https://github.com/facebook/react-native/issues/8932 by definined undefined keyboard on Android
    keyboardType: Platform.select({ android: undefined, ios: "default" })
  },
  city: {
    autoCapitalize: "words",
    autoCorrect: true,
    textContentType: "addressCity",
    // Work around https://github.com/facebook/react-native/issues/8932 by definined undefined keyboard on Android
    keyboardType: Platform.select({ android: undefined, ios: "default" })
  },
  stateProvince: {
    autoCapitalize: "words",
    autoCorrect: true,
    textContentType: "addressState",
    // Work around https://github.com/facebook/react-native/issues/8932 by definined undefined keyboard on Android
    keyboardType: Platform.select({ android: undefined, ios: "default" })
  },
  website: {
    autoCapitalize: "none",
    autoCorrect: true,
    // Work around https://github.com/facebook/react-native/issues/8932 by definined undefined keyboard on Android
    keyboardType: Platform.select({ android: undefined, ios: "default" }),
    textContentType: "URL"
  },
  country: {
    autoCapitalize: "words",
    autoCorrect: true,
    textContentType: "countryName",
    // Work around https://github.com/facebook/react-native/issues/8932 by definined undefined keyboard on Android
    keyboardType: Platform.select({ android: undefined, ios: "default" })
  },
  organisationName: {
    autoCapitalize: "words",
    autoCorrect: true,
    textContentType: "none",
    // Work around https://github.com/facebook/react-native/issues/8932 by definined undefined keyboard on Android
    keyboardType: Platform.select({ android: undefined, ios: "default" })
  },
  organisationDescription: {
    autoCapitalize: "none",
    autoCorrect: true,
    // Work around https://github.com/facebook/react-native/issues/8932 by definined undefined keyboard on Android
    keyboardType: Platform.select({ android: undefined, ios: "default" }),
    multiline: true,
    textAlignVertical: "top"
  },
  projectName: {
    autoCapitalize: "words",
    autoCorrect: true,
    // Work around https://github.com/facebook/react-native/issues/8932 by definined undefined keyboard on Android
    keyboardType: Platform.select({ android: undefined, ios: "default" })
  },
  integer: {
    autoCapitalize: "none",
    autoCorrect: false,
    keyboardType: Platform.select({ android: "phone-pad", ios: "number-pad" }),
    numberFormat: {
      maximumFractionDigits: 0
    }
  },
  decimal: {
    autoCapitalize: "none",
    autoCorrect: false,
    keyboardType: Platform.select({ android: "phone-pad", ios: "decimal-pad" }),
    numberFormat: {
      maximumFractionDigits: 2
    }
  },
  text: {
    autoCapitalize: "words",
    autoCorrect: true,
    // Work around https://github.com/facebook/react-native/issues/8932 by definined undefined keyboard on Android
    keyboardType: Platform.select({ android: undefined, ios: "default" })
  },
  multiLineText: {
    autoCapitalize: "none",
    autoCorrect: true,
    // Work around https://github.com/facebook/react-native/issues/8932 by definined undefined keyboard on Android
    keyboardType: Platform.select({ android: undefined, ios: "default" }),
    multiline: true,
    textAlignVertical: "top"
  }
};
