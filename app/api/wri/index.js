// @flow

import type { AppStore } from "../../redux/redux.types";
import {
  ApiClient,
  AuthApi,
  CarbonCertificationsApi,
  CarbonCertificationTypesApi,
  CompatibilityScoresApi,
  ContinentsApi,
  CountriesApi,
  DevicesApi,
  DraftsApi,
  ElevatorVideosApi,
  FundingSourcesApi,
  InterestsApi,
  LandOwnershipsApi,
  LandTypesApi,
  LandSizesApi,
  MatchesApi,
  OfferContactsApi,
  OrganisationCategoriesApi,
  OrganisationDocumentsApi,
  OrganisationsApi,
  OrganisationTypesApi,
  OrganisationVersionsApi,
  OffersApi,
  PitchesApi,
  PitchContactsApi,
  PitchDocumentsApi,
  PitchVersionsApi,
  ReportingFrequenciesApi,
  ReportingLevelsApi,
  RestorationGoalsApi,
  RestorationMethodsApi,
  RestorationMethodMetricsApi,
  RevenueDriversApi,
  SustainableDevelopmentGoalsApi,
  TeamMembersApi,
  TreeSpeciesApi,
  UploadsApi,
  UsersApi,
  NotificationsApi,
  FundingBracketsApi,
  VisibilitiesApi
} from "wri-api";
import Config from "react-native-config";
import NetInfo from "@react-native-community/netinfo";
import { Mutex } from "async-mutex";

import { errorDomains, errorCodes } from "../../constants/errorMessaging";
import { isJwtExpired, isJwtExpiring } from "../../utils/decodeJwt";
import TSCError from "../../utils/tscError";
import { refreshToken } from "../../redux/wri-api/auth/actions";
import { Navigation } from "react-native-navigation";
import { screens } from "../../screens";
import translate from "../../locales";

/**
 * The identifier for the bearer auth mechanism, so that we can keep the access token updated.
 */
const BEARER_AUTH_NAME = "BearerAuth";

ApiClient.instance.basePath = Config.WRI_API_URL;

/**
 * A whitelist of endpoints that don't require auth
 */
const UNAUTHED_ENDPOINTS = [
  "/auth/change",
  "/auth/login",
  "/auth/reset",
  "/carbon_certification_types",
  "/continents",
  "/countries",
  "/funding_brackets",
  "/document_types",
  "/funding_sources",
  "/land_ownerships",
  "/land_sizes",
  "/land_types",
  "/organisation_categories",
  "/organisation_types",
  "/reporting_frequencies",
  "/reporting_levels",
  "/restoration_goals",
  "/restoration_methods",
  "/revenue_drivers",
  "/sustainable_development_goals",
  "/users",
  "/users/accept",
  "/visibilities"
];

const REFRESH_ENDPOINT = "/auth/refresh";

/**
 * API interceptor that performs multipart file uploads with fetch instead of with superagent, which is what the generated
 * Medivet api client uses by default.
 *
 * This is because we were unable to successfully perform an image upload with superagent, as we are unable to specify
 * the type of the uploaded file.
 *
 * @param params
 * @return {*}
 */
async function interceptFileUpload(...params) {
  const [
    path,
    method,
    pathParams,
    queryParams, // eslint-disable-line no-unused-vars
    headerParams,
    formParams,
    postBody, // eslint-disable-line no-unused-vars
    authNames, // eslint-disable-line no-unused-vars
    contentTypes, // eslint-disable-line no-unused-vars
    accepts
  ] = params;

  if (isFileUpload(...params)) {
    const url = ApiClient.instance.buildUrl(path, pathParams);

    const formData = new FormData();

    Object.entries(formParams).forEach(([name, data]) => {
      formData.append(name, (data: any));
    });

    // The fetch call below will throw an error if there is no network (e.g. airplane mode is enabled), hence it is wrapped in try-catch
    // However, it will also throw an error for other reasons, such as if the attached file upload cannot be found
    // There is no reliable way to distinguish between these errors, which makes reporting them to the user in a friendly
    // way difficult. Instead, we will manually check if we are connected before attempting the request and throw an
    // error if we aren't.
    const connectionStatus = await NetInfo.fetch();

    if (!connectionStatus.isConnected) {
      throw new TSCError({
        domain: errorDomains.NETWORKING,
        code: errorCodes.NETWORKING_DISCONNECTED
      });
    }

    let response;
    try {
      response = await fetch(url, {
        method: method,
        headers: {
          ...ApiClient.instance.normalizeParams(headerParams),
          Accept: accepts.join(";"),
          "Content-Type": "multipart/form-data",
          Authorization: `${ApiClient.instance.authentications[BEARER_AUTH_NAME].apiKeyPrefix ?? "Bearer"} ${ApiClient
            .instance.authentications[BEARER_AUTH_NAME].apiKey ?? ""}`
        },
        body: formData
      });
    } catch (err) {
      // This seems to happen if the file referred to in the FormData cannot be retrieved locally...
      throw new TSCError({
        domain: errorDomains.UNKNOWN,
        code: errorCodes.UNKNOWN,
        message: translate("errors.upload.file_missing")
      });
    }

    if (!response.status) {
      throw new TSCError({
        domain: errorDomains.NETWORKING,
        code: errorCodes.NETWORKING_DISCONNECTED
      });
    }

    const jsonData = await response.json();

    if (!response.ok) {
      throw new TSCError({
        domain: errorDomains.API,
        code: response.status,
        data: jsonData
      });
    }

    return {
      data: jsonData.data,
      response: null
    };
  }

  return null;
}

function isFileUpload(...params) {
  const contentTypes = params[8];
  return !!contentTypes && contentTypes.includes("multipart/form-data");
}

const wriApi = {
  auth: new AuthApi(ApiClient.instance),
  compatibilityScores: new CompatibilityScoresApi(ApiClient.instance),
  continents: new ContinentsApi(ApiClient.instance),
  countries: new CountriesApi(ApiClient.instance),
  devices: new DevicesApi(ApiClient.instance),
  drafts: new DraftsApi(ApiClient.instance),
  elevatorVideos: new ElevatorVideosApi(ApiClient.instance),
  fundingSources: new FundingSourcesApi(ApiClient.instance),
  fundingBracket: new FundingBracketsApi(ApiClient.instance),
  landOwnerships: new LandOwnershipsApi(ApiClient.instance),
  landTypes: new LandTypesApi(ApiClient.instance),
  carbonCertifications: new CarbonCertificationsApi(ApiClient.instance),
  carbonCertificationTypes: new CarbonCertificationTypesApi(ApiClient.instance),
  interests: new InterestsApi(ApiClient.instance),
  landSizes: new LandSizesApi(ApiClient.instance),
  matches: new MatchesApi(ApiClient.instance),
  notifications: new NotificationsApi(ApiClient.instance),
  organisationCategories: new OrganisationCategoriesApi(ApiClient.instance),
  organisationDocuments: new OrganisationDocumentsApi(ApiClient.instance),
  organisations: new OrganisationsApi(ApiClient.instance),
  organisationTypes: new OrganisationTypesApi(ApiClient.instance),
  organisationVersions: new OrganisationVersionsApi(ApiClient.instance),
  offers: new OffersApi(ApiClient.instance),
  offerContacts: new OfferContactsApi(ApiClient.instance),
  pitches: new PitchesApi(ApiClient.instance),
  pitchContacts: new PitchContactsApi(ApiClient.instance),
  pitchDocuments: new PitchDocumentsApi(ApiClient.instance),
  pitchVersions: new PitchVersionsApi(ApiClient.instance),
  reportingFrequencies: new ReportingFrequenciesApi(ApiClient.instance),
  reportingLevels: new ReportingLevelsApi(ApiClient.instance),
  restorationGoals: new RestorationGoalsApi(ApiClient.instance),
  restorationMethods: new RestorationMethodsApi(ApiClient.instance),
  restorationMethodMetrics: new RestorationMethodMetricsApi(ApiClient.instance),
  revenueDrivers: new RevenueDriversApi(ApiClient.instance),
  sustainableDevelopmentGoals: new SustainableDevelopmentGoalsApi(ApiClient.instance),
  teamMembers: new TeamMembersApi(ApiClient.instance),
  treeSpecies: new TreeSpeciesApi(ApiClient.instance),
  uploads: new UploadsApi(ApiClient.instance),
  users: new UsersApi(ApiClient.instance),
  visibilities: new VisibilitiesApi(ApiClient.instance),
  authMutex: new Mutex(),

  clearToken: () => {
    ApiClient.instance.authentications[BEARER_AUTH_NAME].apiKey = "";
  },

  /**
   * Ensures we have a valid auth token. Resolves if it is able to ensure this, rejects otherwise.
   *
   * This function uses a mutex to ensure only one request is handled at a time, to avoid situations where e.g. two
   * login screens are displayed because of two concurrent requests requiring auth.
   *
   * @param store
   * @param path
   * @return {Promise<void>}
   */
  ensureAuthenticated: async (store: AppStore, path: string) => {
    if (path === REFRESH_ENDPOINT) {
      // Carry on with the old token for this request!
      return;
    }

    await wriApi.authMutex.runExclusive(async () => {
      const currentAuth = ApiClient.instance.authentications[BEARER_AUTH_NAME];
      const accessToken = currentAuth.apiKey;
      if (!accessToken) {
        console.warn("3SC", "Attempted to make authed request when not logged in to app", path);
      } else if (isJwtExpired(accessToken)) {
        console.warn("3SC", "Auth token has expired... user must login", path);
        await new Promise((resolve, reject) => {
          Navigation.showModal({
            stack: {
              children: [
                {
                  component: {
                    name: screens.LOGIN.name,
                    passProps: {
                      completionCallback: resolve,
                      isModal: true
                    }
                  }
                }
              ]
            }
          });
        });
      } else if (isJwtExpiring(accessToken)) {
        // Exchange the old token for a new token, and then continue with this request
        console.warn("3SC", "Auth token was expiring... refreshing");
        await store.dispatch(refreshToken());
      }
    });
  },

  /**
   * Installs a request interceptor that ensures any access token held in the store is applied to requests that require
   * it.
   *
   * If the token is expired or expiring then this method will navigate the user to a modal where they can log back in
   */
  installAuthInterceptor: (store: AppStore) => {
    // Update the token from the store and then subscribe to future updates
    wriApi.updateToken(store);
    store.subscribe(() => {
      wriApi.updateToken(store);
    });

    const baseCall = ApiClient.instance.callApi.bind(ApiClient.instance);

    // Define an interceptor with the same signature that wraps the default callApi method
    // This interceptor is responsible for automatically refreshing the auth token when required, and for ensuring errors
    // are put into a consistent format
    ApiClient.instance.callApi = async function(...params) {
      const [path] = params;
      const requiresAuth = !UNAUTHED_ENDPOINTS.includes(path);
      if (requiresAuth) {
        await wriApi.ensureAuthenticated(store, path);
      }

      // We intercept file upload requests because they don't work with superagent
      if (isFileUpload(...params)) {
        return await interceptFileUpload(...params);
      }

      // TODO: This is a hack because the auto-generated API sends the founded_date for the POST /organisations request in ISO format...
      // TODO: ...which the server rejects because it expects Y-m-D. This field isn't even collected from the user currently, so let's hardcode it
      const body = (params[6]: any);
      if (body?.founded_at) {
        const formattedDate = body.founded_at.toISOString().split("T")[0];
        body.founded_at = formattedDate;
      }

      try {
        return await baseCall(...params);
      } catch (err) {
        if (!err.status) {
          throw new TSCError({
            domain: errorDomains.NETWORKING,
            code: errorCodes.NETWORKING_DISCONNECTED
          });
        }

        // Try and parse the error body
        const errorBody = err.response?.body;
        throw new TSCError({
          domain: errorDomains.API,
          code: err.status,
          data: errorBody
        });
      }
    };
  },

  /**
   * Updates the medivet API client with the auth0 token contained in the provided store
   *
   * This is usually called automatically if installAuthInterceptor is called.
   *
   * @param store
   */
  updateToken: (store: AppStore) => {
    const appState = store.getState();
    const loginState = appState.wri.auth.login;
    const refreshState = appState.wri.auth.refresh;
    const accessToken =
      refreshState.lastSuccessTime > loginState.lastSuccessTime ? refreshState.data?.token : loginState.data?.token;

    // If the token has changed then update (ignore empty tokens, so that we don't disrupt a logout API call)
    if (!!accessToken && accessToken !== ApiClient.instance.authentications[BEARER_AUTH_NAME]?.apiKey) {
      ApiClient.instance.authentications[BEARER_AUTH_NAME].apiKeyPrefix = "Bearer";
      ApiClient.instance.authentications[BEARER_AUTH_NAME].apiKey = accessToken;
    }
  }
};

export default wriApi;
