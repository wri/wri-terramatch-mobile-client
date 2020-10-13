// @flow

import translate from "../locales";

export type ErrorDomain = "api" | "networking" | "unknown" | "wri";
export type ErrorCode = number;
export type ErrorMessaging = { [ErrorDomain]: { [ErrorCode]: () => string } };

/**
 * Constants defining the module reporting a given error
 *
 * @type {Object}
 */
export const errorDomains = Object.freeze({
  API: "api",
  NETWORKING: "networking",
  UNKNOWN: "unknown",
  WRI: "wri"
});

export const errorCodes = Object.freeze({
  API_UNAUTHORIZED: 401,
  API_PAYMENT_REQUIRED: 402,
  API_FORBIDDEN: 403,
  API_NOT_FOUND: 404,
  API_CONFLICT: 409,
  API_UNPROCESSABLE_ENTITY: 422,
  API_SERVER_ERROR: 500,
  NETWORKING_DISCONNECTED: 2,
  NETWORKING_TIMEOUT: 1,
  UNKNOWN: -1,
  WRI_UNEXPECTED_STATE: 0,
  WRI_COMPLETED_WITH_ERRORS: 1
});

/**
 * Error messaging used throughout the app
 *
 * @const
 */
const errorMessaging: ErrorMessaging = Object.freeze({
  [errorDomains.API]: {
    [errorCodes.API_UNAUTHORIZED]: () => translate("errors.api.unauthorized"),
    [errorCodes.API_FORBIDDEN]: () => translate("errors.api.forbidden"),
    [errorCodes.API_NOT_FOUND]: () => translate("errors.api.not_found"),
    [errorCodes.API_UNPROCESSABLE_ENTITY]: () => translate("errors.api.invalid_input"),
    [errorCodes.API_SERVER_ERROR]: () => translate("errors.api.server")
  },
  [errorDomains.NETWORKING]: {
    [errorCodes.NETWORKING_DISCONNECTED]: () => translate("errors.networking.disconnected"),
    [errorCodes.NETWORKING_TIMEOUT]: () => translate("errors.networking.timeout")
  },
  [errorDomains.UNKNOWN]: {
    [errorCodes.UNKNOWN]: () => translate("errors.unknown.GENERIC")
  },
  [errorDomains.WRI]: {
    [errorCodes.WRI_COMPLETED_WITH_ERRORS]: () => translate("errors.partial_success")
  }
});

export default errorMessaging;
