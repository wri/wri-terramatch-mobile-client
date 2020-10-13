// @flow
import type { WriValidationError, WriValidationErrors } from "../api/wri/wri.types";
import errorMessaging, {
  errorCodes,
  errorDomains,
  type ErrorDomain,
  type ErrorMessaging
} from "../constants/errorMessaging";

/**
 * Custom error class for 3 Sided Cube-defined errors.
 *
 * This adds some custom properties to the default Error implementation
 */
export default class TSCError extends Error {
  /**
   * Combine all the TSCErrors into a shape matching what the API uses for validation errors, so that we show
   * them in a standard format
   */
  static combine(errors: Array<?TSCError>): TSCError {
    const validationErrors: Array<WriValidationError> = [];

    errors.forEach(error => {
      if (error) {
        validationErrors.push(...[{ detail: error.format(true) }]);
      }
    });

    return new TSCError({
      domain: errorDomains.WRI,
      code: errorCodes.WRI_COMPLETED_WITH_ERRORS,
      data: {
        errors: validationErrors
      }
    });
  }

  static createFromError(error: TSCError | Error | string): TSCError {
    if (error instanceof TSCError) {
      return error;
    }

    return new TSCError({
      domain: errorDomains.UNKNOWN,
      code: errorCodes.UNKNOWN,
      message: (typeof error === "string" ? error : error.message) ?? ""
    });
  }

  constructor(details: {| domain: ErrorDomain, code: number, message?: string, data?: ?WriValidationErrors |}) {
    super(details.message ?? `TSCError[domain=${details.domain} code${details.code}]`);
    this.domain = details.domain;
    this.code = details.code;
    this.data = details.data;
    this.customMessage = details.message;
  }

  code: number;
  domain: ErrorDomain;
  data: ?WriValidationErrors;
  customMessage: ?string;

  /**
   * formatError - Given an error object, creates a text object that details the error.
   * This can then be displayed in the UI.
   */
  format(isSingleLine: ?boolean = false, messaging: ErrorMessaging = {}): string {
    if (this.customMessage) {
      return this.customMessage;
    }

    const validationData = this?.data?.errors ?? [];
    const errorDetail = validationData
      .map(error => error.detail) // TODO: We could instead attempt to translate the error object here
      .filter(errorDetail => !!errorDetail)
      .map(errorDetail => (isSingleLine ? errorDetail : `• ${errorDetail ?? ""}`))
      .join(isSingleLine ? ". " : "\n");

    // If we've been asked to display only a single line message, and we have some detail, then simply return the detail
    // string
    if (isSingleLine && errorDetail) {
      return errorDetail;
    }

    // Find a generic localised title message for the error based on its domain and code.
    const errorDomain = this.domain ?? errorDomains.UNKNOWN;
    const errorCode = this.code ?? errorCodes.UNKNOWN;
    const errorTitleAndMessage =
      messaging[errorDomain] && messaging[errorDomain][errorCode]
        ? messaging[errorDomain][errorCode]()
        : errorMessaging[errorDomain] && errorMessaging[errorDomain][errorCode]
        ? errorMessaging[errorDomain][errorCode]()
        : messaging[errorDomains.UNKNOWN] && messaging[errorDomains.UNKNOWN][errorCodes.UNKNOWN]
        ? messaging[errorDomains.UNKNOWN][errorCodes.UNKNOWN]()
        : errorMessaging[errorDomains.UNKNOWN][errorCodes.UNKNOWN]();

    return `${errorTitleAndMessage}\n${errorDetail}`;
  }

  withMessagePrefix(prefix: string): TSCError {
    return new TSCError({
      domain: this.domain,
      code: this.code,
      data: this.data,
      message: `${prefix} ${this.format(true)}`
    });
  }
}
