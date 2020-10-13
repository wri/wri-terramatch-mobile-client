// @flow

import translate, { getLocale } from "./index";
import * as RNLocalize from "react-native-localize";

export function formatCurrency(amount: ?number, formatOptions: {} = {}) {
  const locale = getLocale();
  const isEnglishLocale = locale.startsWith("en");

  // Override for english locale because Intl.NumberFormat by default does "US$" instead of "$"
  if (isEnglishLocale) {
    const number = formatNumber(amount, formatOptions);
    if (!number && number !== 0.0) {
      return translate("common.unspecified");
    }
    return `$${number}`;
  }

  const currencyFormatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    currencyDisplay: "symbol",
    ...formatOptions
  });

  if (!amount && amount !== 0.0) {
    return "";
  } else {
    return currencyFormatter.format(amount);
  }
}

export function formatNumber(amount: ?number, formatOptions: {} = {}) {
  const numberFormatter = new Intl.NumberFormat(getLocale(), {
    style: "decimal",
    ...formatOptions
  });

  if (!amount && amount !== 0.0) {
    return "";
  } else {
    return numberFormatter.format(amount);
  }
}

export function getDecimalSeparator(locale: string): string {
  return RNLocalize.getNumberFormatSettings().decimalSeparator;
}
