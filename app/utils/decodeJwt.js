// @flow

import { Buffer } from "buffer";

// See https://en.wikipedia.org/wiki/JSON_Web_Token
type DecodedJWT = {
  iss: string,
  iat: number,
  exp: number, // in seconds since epoch
  nbf: number,
  jti: string,
  sub: string,
  prv: string
};

/**
 * Decodes the payload segment of a JWT, but does not perform any cryptographic verification
 *
 * @param {string} token - The JWT do decode
 *
 * @returns {Object} The decoded object that the JWT represents
 */
export default function decodeJwt(token: string): DecodedJWT {
  const tokenSections = token.split(".");

  if (tokenSections.length !== 3) {
    throw new Error("JWT contains an illegal number of sections");
  }

  const payloadSection = tokenSections[1];
  const decodedSection = Buffer.from(payloadSection, "base64").toString();
  return JSON.parse(decodedSection);
}

/**
 * Returns whether the token's expiry time is in the past
 */
export function isJwtExpired(token: string): boolean {
  return decodeJwt(token).exp * 1000 < Date.now();
}

const DEFAULT_EXPIRING_TOLERANCE = 1000 * 60 * 60;
/**
 * Returns whether the token's expiry time is within a certain number of milliseconds
 */
export function isJwtExpiring(token: string, tolerance: number = DEFAULT_EXPIRING_TOLERANCE): boolean {
  const expiryTimeMs = decodeJwt(token).exp * 1000;
  const nowMs = Date.now();
  return expiryTimeMs > nowMs && expiryTimeMs < nowMs + tolerance;
}
