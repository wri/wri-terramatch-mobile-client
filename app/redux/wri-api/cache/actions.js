// @flow

import type { Dispatch, NamedAsyncAction, Thunk } from "../../redux.types";
import {
  CarbonCertificationReadAll,
  CarbonCertificationVersionReadAll,
  OfferContactReadAll,
  OfferRead,
  OfferReadAll,
  OrganisationDocumentReadAll,
  OrganisationRead,
  PitchContactReadAll,
  PitchDocumentReadAll,
  PitchDocumentVersionReadAll,
  PitchRead,
  PitchReadAll,
  PitchVersionReadAll,
  RestorationMethodMetricReadAll,
  RestorationMethodMetricVersionReadAll,
  TeamMemberReadAll,
  TreeSpeciesReadAll,
  TreeSpeciesVersionReadAll,
  UserReadAll
} from "wri-api";
import wriAPI from "../../../api/wri";
import { createAsyncAction } from "../../conditionalActions";

export type FetchOfferContactsAction = NamedAsyncAction<"wri/cache/offer/contacts/fetch", OfferContactReadAll>;
export type FetchOfferDetailsAction = NamedAsyncAction<"wri/cache/offer/details/fetch", OfferRead>;
export type FetchOrganisationDetailsAction = NamedAsyncAction<"wri/cache/organisation/fetch", OrganisationRead>;
export type FetchOrganisationDocumentsAction = NamedAsyncAction<
  "wri/cache/organisation/docs/fetch",
  OrganisationDocumentReadAll
>;
export type FetchOrganisationOffersAction = NamedAsyncAction<"wri/cache/organisation/offers/fetch", OfferReadAll>;
export type FetchOrganisationPitchesAction = NamedAsyncAction<"wri/cache/organisation/pitches/fetch", PitchReadAll>;
export type FetchOrganisationTeamAction = NamedAsyncAction<"wri/cache/organisation/members/fetch", TeamMemberReadAll>;
export type FetchOrganisationUsersAction = NamedAsyncAction<"wri/cache/organisation/users/fetch", UserReadAll>;
export type FetchPitchCertificationAction = NamedAsyncAction<
  "wri/cache/pitch/certification/fetch",
  CarbonCertificationReadAll
>;
export type FetchPitchContactsAction = NamedAsyncAction<"wri/cache/pitch/contacts/fetch", PitchContactReadAll>;
export type FetchPitchDetailsAction = NamedAsyncAction<"wri/cache/pitch/details/fetch", PitchRead>;
export type FetchPitchDocumentsAction = NamedAsyncAction<"wri/cache/pitch/docs/fetch", PitchDocumentReadAll>;
export type FetchPitchMetricsAction = NamedAsyncAction<"wri/cache/pitch/metrics/fetch", RestorationMethodMetricReadAll>;
export type FetchPitchTreeSpeciesAction = NamedAsyncAction<"wri/cache/pitch/species/fetch", TreeSpeciesReadAll>;
export type FetchPitchVersionsAction = NamedAsyncAction<"wri/cache/pitch/versions/fetch", PitchVersionReadAll>;
export type InspectPitchCertificationAction = NamedAsyncAction<
  "wri/cache/pitch/certification/inspect",
  CarbonCertificationVersionReadAll
>;
export type InspectPitchDocumentsAction = NamedAsyncAction<"wri/cache/pitch/docs/inspect", PitchDocumentVersionReadAll>;
export type InspectPitchMetricsAction = NamedAsyncAction<
  "wri/cache/pitch/metrics/inspect",
  RestorationMethodMetricVersionReadAll
>;
export type InspectPitchTreeSpeciesAction = NamedAsyncAction<
  "wri/cache/pitch/species/inspect",
  TreeSpeciesVersionReadAll
>;

export function fetchOfferContacts(id: number): FetchOfferContactsAction {
  return createAsyncAction({
    type: "wri/cache/offer/contacts/fetch",
    payload: wriAPI.offerContacts.offersIDOfferContactsGet(id),
    meta: {
      // Send a cache key so the async action reducer knows when to invalidate state
      cacheKey: id
    }
  });
}

/**
 * Action that when dispatched will fetch all data relating to a pitch
 */
export function fetchOfferData(id: number, organisationId: ?number): Thunk<void> {
  return (dispatch: Dispatch) => {
    dispatch(fetchOfferContacts(id));
    dispatch(fetchOfferDetails(id));

    if (organisationId) {
      dispatch(fetchOrganisationDetails(organisationId));
    }
  };
}

export function fetchOfferDetails(id: number): FetchOfferDetailsAction {
  return createAsyncAction({
    type: "wri/cache/offer/details/fetch",
    payload: wriAPI.offers.offersIDGet(id),
    meta: {
      // Send a cache key so the async action reducer knows when to invalidate state
      cacheKey: id
    }
  });
}

/**
 * Action that when dispatched will fetch all data relating to an organisation
 */
export function fetchOrganisationData(id: number): Thunk<void> {
  return (dispatch: Dispatch) => {
    dispatch(fetchOrganisationDetails(id));
    dispatch(fetchOrganisationDocuments(id));
    dispatch(fetchOrganisationOffers(id));
    dispatch(fetchOrganisationPitches(id));
    dispatch(fetchOrganisationTeamMembers(id));
    dispatch(fetchOrganisationUsers(id));
  };
}

export function fetchOrganisationDetails(id: number): FetchOrganisationDetailsAction {
  return createAsyncAction({
    type: "wri/cache/organisation/fetch",
    payload: wriAPI.organisations.organisationsIDGet(id),
    meta: {
      // Send a cache key so the async action reducer knows when to invalidate state
      cacheKey: id
    }
  });
}

export function fetchOrganisationDocuments(id: number): FetchOrganisationDocumentsAction {
  return createAsyncAction({
    type: "wri/cache/organisation/docs/fetch",
    payload: wriAPI.organisationDocuments.organisationsIDOrganisationDocumentsGet(id),
    meta: {
      // Send a cache key so the async action reducer knows when to invalidate state
      cacheKey: id
    }
  });
}

export function fetchOrganisationOffers(id: number): FetchOrganisationOffersAction {
  return createAsyncAction({
    type: "wri/cache/organisation/offers/fetch",
    payload: wriAPI.offers.organisationsIDOffersGet(id),
    meta: {
      // Send a cache key so the async action reducer knows when to invalidate state
      cacheKey: id
    }
  });
}

export function fetchOrganisationPitches(id: number): FetchOrganisationPitchesAction {
  return createAsyncAction({
    type: "wri/cache/organisation/pitches/fetch",
    payload: wriAPI.pitches.organisationsIDPitchesGet(id),
    meta: {
      // Send a cache key so the async action reducer knows when to invalidate state
      cacheKey: id
    }
  });
}

export function fetchOrganisationTeamMembers(id: number): FetchOrganisationTeamAction {
  return createAsyncAction({
    type: "wri/cache/organisation/members/fetch",
    payload: wriAPI.teamMembers.organisationsIDTeamMembersGet(id),
    meta: {
      // Send a cache key so the async action reducer knows when to invalidate state
      cacheKey: id
    }
  });
}

export function fetchOrganisationUsers(id: number): FetchOrganisationUsersAction {
  return createAsyncAction({
    type: "wri/cache/organisation/users/fetch",
    payload: wriAPI.users.organisationsIDUsersGet(id),
    meta: {
      // Send a cache key so the async action reducer knows when to invalidate state
      cacheKey: id
    }
  });
}

export function fetchPitchCertification(id: number): FetchPitchCertificationAction {
  return createAsyncAction({
    type: "wri/cache/pitch/certification/fetch",
    payload: wriAPI.carbonCertifications.pitchesIDCarbonCertificationsGet(id),
    meta: {
      // Send a cache key so the async action reducer knows when to invalidate state
      cacheKey: id
    }
  });
}

export function fetchPitchContacts(id: number): FetchPitchContactsAction {
  return createAsyncAction({
    type: "wri/cache/pitch/contacts/fetch",
    payload: wriAPI.pitchContacts.pitchesIDPitchContactsGet(id),
    meta: {
      // Send a cache key so the async action reducer knows when to invalidate state
      cacheKey: id
    }
  });
}

/**
 * Action that when dispatched will fetch all data relating to a pitch
 */
export function fetchPitchData(id: number, organisationId: ?number): Thunk<void> {
  return (dispatch: Dispatch) => {
    dispatch(fetchPitchCertification(id));
    dispatch(fetchPitchContacts(id));
    dispatch(fetchPitchDetails(id));
    dispatch(fetchPitchDocuments(id));
    dispatch(fetchPitchMetrics(id));
    dispatch(fetchPitchTreeSpecies(id));

    if (organisationId) {
      dispatch(fetchOrganisationDetails(organisationId));
    }
  };
}

export function fetchPitchDetails(id: number): FetchPitchDetailsAction {
  return createAsyncAction({
    type: "wri/cache/pitch/details/fetch",
    payload: wriAPI.pitches.pitchesIDGet(id),
    meta: {
      // Send a cache key so the async action reducer knows when to invalidate state
      cacheKey: id
    }
  });
}

export function fetchPitchDocuments(id: number): FetchPitchDocumentsAction {
  return createAsyncAction({
    type: "wri/cache/pitch/docs/fetch",
    payload: wriAPI.pitchDocuments.pitchesIDPitchDocumentsGet(id),
    meta: {
      // Send a cache key so the async action reducer knows when to invalidate state
      cacheKey: id
    }
  });
}

export function fetchPitchMetrics(id: number): FetchPitchMetricsAction {
  return createAsyncAction({
    type: "wri/cache/pitch/metrics/fetch",
    payload: wriAPI.restorationMethodMetrics.pitchesIDRestorationMethodMetricsGet(id),
    meta: {
      // Send a cache key so the async action reducer knows when to invalidate state
      cacheKey: id
    }
  });
}

export function fetchPitchTreeSpecies(id: number): FetchPitchTreeSpeciesAction {
  return createAsyncAction({
    type: "wri/cache/pitch/species/fetch",
    payload: wriAPI.treeSpecies.pitchesIDTreeSpeciesGet(id),
    meta: {
      // Send a cache key so the async action reducer knows when to invalidate state
      cacheKey: id
    }
  });
}

export function fetchPitchVersions(id: number): FetchPitchVersionsAction {
  return createAsyncAction({
    type: "wri/cache/pitch/versions/fetch",
    payload: wriAPI.pitchVersions.pitchesIDPitchVersionsGet(id),
    meta: {
      // Send a cache key so the async action reducer knows when to invalidate state
      cacheKey: id
    }
  });
}

export function inspectPitchCertification(id: number): InspectPitchCertificationAction {
  return createAsyncAction({
    type: "wri/cache/pitch/certification/inspect",
    payload: wriAPI.carbonCertifications.pitchesIDCarbonCertificationsInspectGet(id),
    meta: {
      // Send a cache key so the async action reducer knows when to invalidate state
      cacheKey: id
    }
  });
}

/**
 * Action that when dispatched will fetch all data relating to a pitch
 */
export function inspectPitchData(id: number): Thunk<void> {
  return (dispatch: Dispatch) => {
    dispatch(fetchPitchContacts(id));
    dispatch(fetchPitchVersions(id));
    dispatch(inspectPitchCertification(id));
    dispatch(inspectPitchDocuments(id));
    dispatch(inspectPitchMetrics(id));
    dispatch(inspectPitchTreeSpecies(id));

    // No need to fetch org data because it will already be in state for the user's organisation
  };
}

export function inspectPitchDocuments(id: number): InspectPitchDocumentsAction {
  return createAsyncAction({
    type: "wri/cache/pitch/docs/inspect",
    payload: wriAPI.pitchDocuments.pitchesIDPitchDocumentsInspectGet(id),
    meta: {
      // Send a cache key so the async action reducer knows when to invalidate state
      cacheKey: id
    }
  });
}

export function inspectPitchMetrics(id: number): InspectPitchMetricsAction {
  return createAsyncAction({
    type: "wri/cache/pitch/metrics/inspect",
    payload: wriAPI.restorationMethodMetrics.pitchesIDRestorationMethodMetricsInspectGet(id),
    meta: {
      // Send a cache key so the async action reducer knows when to invalidate state
      cacheKey: id
    }
  });
}

export function inspectPitchTreeSpecies(id: number): InspectPitchTreeSpeciesAction {
  return createAsyncAction({
    type: "wri/cache/pitch/species/inspect",
    payload: wriAPI.treeSpecies.pitchesIDTreeSpeciesInspectGet(id),
    meta: {
      // Send a cache key so the async action reducer knows when to invalidate state
      cacheKey: id
    }
  });
}
