// @flow

import i18n from "i18next";
import * as RNLocalize from "react-native-localize";
import { I18nManager } from "react-native";

export function getLocale(): string {
  const locales = RNLocalize.getLocales();
  return locales[0].languageTag;
}

/**
 * setI18nConfig - Performs localisation setup, so that the correct language text is used in the UI!
 * This is largely based off of the example here: https://github.com/react-native-community/react-native-localize/blob/master/example/src/SyncExample.js.
 */
export const setI18nConfig = () => {
  // Lazy requires of each language available in the app.
  // When there's more languages available, add them in here & if the device is in the right language, it should automatically use those strings ✨
  const translationPaths = {
    en: () => require("./en_US.json")
    // es: () => require("./es.json")
  };

  // Determine the best language based on the supported locales defined in translationPaths, falling back to EN if none better are available.
  const fallback = { languageTag: "en", isRTL: false };
  const { languageTag, isRTL } = RNLocalize.findBestAvailableLanguage(Object.keys(translationPaths)) || fallback;

  // Tell react-native if this is a right-to-left language.
  I18nManager.forceRTL(isRTL);

  // Configure i18n, with the chosen translations & locale.
  i18n.init({
    fallbackLng: "en",
    interpolation: {
      escapeValue: false // react already safes from xss
    },
    lng: languageTag,
    resources: {
      en: translationPaths.en()
      // es: translationPaths.es()
    }
  });
};

export default function translate(
  key: string,
  fallback: ?string,
  interpolations: ?{ [string]: string | number } = null
): string {
  const result = i18n.t(
    key,
    fallback
      ? {
          defaultValue: fallback,
          replace: interpolations
        }
      : interpolations
  );

  // If there is not a fallback then this translation should exist in the file! Show a warning if it doesn't
  if (!fallback && result === key) {
    console.warn(`Could not find ${key} in translations file.`);
  }

  return result;
}

export function translateAccountType(key: ?string): string {
  return key ? translate(`organisation.categories.${key}`, key) : translate("mobile.common.unknown");
}

export function translateCarbonCertificationType(key: ?string): string {
  return key ? translate(`api.carbon_certification_types.${key}`, key) : translate("mobile.common.unknown");
}

export function translateContinent(key: ?string): string {
  return key ? translate(`api.continents.${key}`, key) : translate("mobile.common.unknown");
}

export function translateCountry(key: ?string): ?string {
  return key ? translate(`api.countries.${key}`, key) : null;
}

export function translateFundingAmount(key: ?string): string {
  return key ? translate(`api.funding_amount.${key}`, key) : translate("mobile.common.unknown");
}

export function translateFundingSource(key: ?string): string {
  return key ? translate(`api.funding_sources.${key}`, key) : translate("mobile.common.unknown");
}

export function translateLandOwnership(key: ?string): string {
  return key ? translate(`api.land_ownerships.${key}`, key) : translate("mobile.common.unknown");
}

export function translateVisibility(projectType: string, key: ?string): ?string {
  return key ? translate(`api.visibilities.${projectType}.${key}`, `${projectType}.${key}`) : null;
}

export function translateLandSize(key: ?string): string {
  return key ? translate(`api.land_sizes.${key}`, key) : translate("mobile.common.unknown");
}

export function translateLandType(key: ?string): string {
  return key ? translate(`api.land_types.${key}`, key) : translate("mobile.common.unknown");
}

export function translateFundingBracket(key: ?string): string {
  return key ? translate(`api.funding_brackets.${key}`, key) : translate("mobile.common.unknown");
}

export function translateOrganisationType(key: ?string): string {
  return key ? translate(`api.organisation_types.${key}`, key) : translate("mobile.common.unknown");
}

export function translateRejectedReason(key: ?string): string {
  return key ? translate(`api.rejected_reasons.${key}`, key) : translate("mobile.common.unknown");
}

export function translateReportingFrequency(key: ?string): string {
  return key ? translate(`api.reporting_frequencies.${key}`, key) : translate("mobile.common.unknown");
}

export function translateReportingLevel(key: ?string): string {
  return key ? translate(`api.reporting_levels.${key}`, key) : translate("mobile.common.unknown");
}

export function translateRestorationGoal(key: ?string): string {
  return key ? translate(`api.restoration_goals.${key}`, key) : translate("mobile.common.unknown");
}

export function translateRestorationMethod(key: ?string): string {
  return key ? translate(`api.restoration_methods.${key}`, key) : translate("mobile.common.unknown");
}

export function translateRevenueDrivers(key: ?string): string {
  return key ? translate(`api.revenue_drivers.${key}`, key) : translate("mobile.common.unknown");
}

export function translateSustainableDevelopmentGoal(key: ?string): string {
  return key ? translate(`api.sustainable_development_goals.${key}`, key) : translate("mobile.common.unknown");
}

export { formatCurrency, formatNumber, getDecimalSeparator } from "./numbers";
