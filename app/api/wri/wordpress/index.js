import Config from "react-native-config";

import { errorCodes, errorDomains } from "../../../constants/errorMessaging";

/**
 * Creates an error from a networking `TypeError` (If the user doesn't have internet connection)
 *
 * @param {Object} error - The error that was returned
 *
 * @returns {Object} - The error object
 */
function createNetworkingError(error) {
  return {
    domain: errorDomains.NETWORKING,
    code: errorCodes.NETWORKING_DISCONNECTED,
    message: error.message
  };
}

/**
 * Creates an error from the API response
 *
 * @param {Object} apiResponse - The response back from the call to `fetch`
 *
 * @returns {Function} - A promise which resolves to an object representing the error
 */
function createError(apiResponse) {
  return apiResponse
    .json()
    .then(parsedBody => {
      let details = undefined;
      if (parsedBody?.error?.details) {
        details = {};

        parsedBody.error.details.forEach(errorDetail => {
          if (!!errorDetail.path && errorDetail.path.length > 0) {
            details[errorDetail.path[0]] = errorDetail.message || `Unknown error with ${errorDetail.path[0]}`;
          }
        });
      }

      return {
        domain: errorDomains.API,
        code: apiResponse.status || parsedBody.status,
        url: apiResponse.url,
        status: apiResponse.status,
        message: parsedBody.message,
        details: details
      };
    })
    .catch(() => {
      return {
        domain: errorDomains.API,
        code: apiResponse.status || apiResponse.error_code,
        url: apiResponse.url,
        status: apiResponse.status
      };
    });
}

class ApiClient {
  constructor() {
    this.commonHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json"
    };
  }

  /**
   * A request which fetches the content on Wordpress
   *
   * @param {number} category - The category to fetch details for
   *
   * @return {Promise} A promise to perform the above request
   */
  fetchWordpressDetails(category) {
    const url = `${Config.WORDPRESS_API_URL}/${Config.WORDPRESS_API_ENDPOINT}/${category}`;
    return fetch(url, {
      method: "GET",
      headers: this.commonHeaders
    })
      .catch(error => {
        throw createNetworkingError(error);
      })
      .then(response => {
        if (!response.ok) {
          return createError(response).then(error => { // eslint-disable-line
            throw error;
          });
        }
        return response.json();
      });
  }
}

const wordpressClient = new ApiClient();
export default wordpressClient;
