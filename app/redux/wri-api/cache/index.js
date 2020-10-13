// @flow

import type { AsyncState, ReducerMap } from "../../redux.types";
import type {
  FetchOfferContactsAction,
  FetchOfferDetailsAction,
  FetchOrganisationDetailsAction,
  FetchOrganisationDocumentsAction,
  FetchOrganisationOffersAction,
  FetchOrganisationPitchesAction,
  FetchOrganisationTeamAction,
  FetchOrganisationUsersAction,
  FetchPitchCertificationAction,
  FetchPitchContactsAction,
  FetchPitchDetailsAction,
  FetchPitchDocumentsAction,
  FetchPitchMetricsAction,
  FetchPitchVersionsAction,
  FetchPitchTreeSpeciesAction,
  InspectPitchCertificationAction,
  InspectPitchDocumentsAction,
  InspectPitchMetricsAction,
  InspectPitchTreeSpeciesAction
} from "./actions";
import { combineReducers } from "redux";
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

import { asyncActionReducer } from "../../asyncActionReducer";

/**
 * Type definition for the state managed by this reducer and its subreducers
 */
export type State = {|
  +offerContacts: AsyncState<OfferContactReadAll>,
  +offerDetails: AsyncState<OfferRead>,
  +organisationDetails: AsyncState<OrganisationRead>,
  +organisationDocuments: AsyncState<OrganisationDocumentReadAll>,
  +organisationOffers: AsyncState<OfferReadAll>,
  +organisationPitches: AsyncState<PitchReadAll>,
  +organisationTeamMembers: AsyncState<TeamMemberReadAll>,
  +organisationUsers: AsyncState<UserReadAll>,
  +pitchCertification: AsyncState<CarbonCertificationReadAll>,
  +pitchCertificationVersions: AsyncState<CarbonCertificationVersionReadAll>,
  +pitchContacts: AsyncState<PitchContactReadAll>,
  +pitchDetails: AsyncState<PitchRead>,
  +pitchDocuments: AsyncState<PitchDocumentReadAll>,
  +pitchDocumentVersions: AsyncState<PitchDocumentVersionReadAll>,
  +pitchMetrics: AsyncState<RestorationMethodMetricReadAll>,
  +pitchMetricVersions: AsyncState<RestorationMethodMetricVersionReadAll>,
  +pitchTreeSpecies: AsyncState<TreeSpeciesReadAll>,
  +pitchTreeSpeciesVersions: AsyncState<TreeSpeciesVersionReadAll>,
  +pitchVersions: AsyncState<PitchVersionReadAll>
|};

/**
 * Type definition for the actions supported by this reducer and its subreducers
 */

export type Actions =
  | FetchOfferContactsAction
  | FetchOfferDetailsAction
  | FetchOrganisationDetailsAction
  | FetchOrganisationDocumentsAction
  | FetchOrganisationOffersAction
  | FetchOrganisationPitchesAction
  | FetchOrganisationTeamAction
  | FetchOrganisationUsersAction
  | FetchPitchCertificationAction
  | FetchPitchContactsAction
  | FetchPitchDetailsAction
  | FetchPitchDocumentsAction
  | FetchPitchMetricsAction
  | FetchPitchTreeSpeciesAction
  | FetchPitchVersionsAction
  | InspectPitchCertificationAction
  | InspectPitchDocumentsAction
  | InspectPitchMetricsAction
  | InspectPitchTreeSpeciesAction;

export default combineReducers<ReducerMap<State, any>, any>({
  offerContacts: asyncActionReducer.bind(this, "wri/cache/offer/contacts/fetch"),
  offerDetails: asyncActionReducer.bind(this, "wri/cache/offer/details/fetch"),
  organisationDetails: asyncActionReducer.bind(this, "wri/cache/organisation/fetch"),
  organisationDocuments: asyncActionReducer.bind(this, "wri/cache/organisation/docs/fetch"),
  organisationOffers: asyncActionReducer.bind(this, "wri/cache/organisation/offers/fetch"),
  organisationPitches: asyncActionReducer.bind(this, "wri/cache/organisation/pitches/fetch"),
  organisationTeamMembers: asyncActionReducer.bind(this, "wri/cache/organisation/members/fetch"),
  organisationUsers: asyncActionReducer.bind(this, "wri/cache/organisation/users/fetch"),
  pitchCertification: asyncActionReducer.bind(this, "wri/cache/pitch/certification/fetch"),
  pitchCertificationVersions: asyncActionReducer.bind(this, "wri/cache/pitch/certification/inspect"),
  pitchContacts: asyncActionReducer.bind(this, "wri/cache/pitch/contacts/fetch"),
  pitchDetails: asyncActionReducer.bind(this, "wri/cache/pitch/details/fetch"),
  pitchDocuments: asyncActionReducer.bind(this, "wri/cache/pitch/docs/fetch"),
  pitchDocumentVersions: asyncActionReducer.bind(this, "wri/cache/pitch/docs/inspect"),
  pitchMetrics: asyncActionReducer.bind(this, "wri/cache/pitch/metrics/fetch"),
  pitchMetricVersions: asyncActionReducer.bind(this, "wri/cache/pitch/metrics/inspect"),
  pitchTreeSpecies: asyncActionReducer.bind(this, "wri/cache/pitch/species/fetch"),
  pitchTreeSpeciesVersions: asyncActionReducer.bind(this, "wri/cache/pitch/species/inspect"),
  pitchVersions: asyncActionReducer.bind(this, "wri/cache/pitch/versions/fetch")
});
