// @flow

import type { AsyncState, ReducerMap } from "../redux.types";
import type { FetchContinentsAction, FetchCountriesAction } from "./actions";
import { combineReducers } from "redux";
import { ContinentReadAll, CountryReadAll } from "wri-api";

import authReducer, { type State as AuthState, type Actions as AuthActions } from "./auth";
import organisationsReducer, {
  type State as OrganisationsState,
  type Actions as OrganisationsActions
} from "./organisations";
import interestsReducer, { type State as InterestsState, type Actions as InterestsActions } from "./interests";
import pitchesReducer, { type State as PitchesState, type Actions as PitchesActions } from "./pitches";
import projectsReducer, { type State as ProjectsState, type Actions as ProjectsActions } from "./projects";
import usersReducer, { type State as UsersState, type Actions as UsersActions } from "./users";
import draftsReducer, { type State as DraftsState, type Actions as DraftsActions } from "./drafts";
import offersReducer, { type State as OffersState, type Actions as OffersActions } from "./offers";
import { asyncActionReducer } from "../asyncActionReducer";
import notificationReducer, {
  type State as NotificationsState,
  type Actions as NotificationsActions
} from "./notifications";

/**
 * Type definition for the state managed by this reducer and its subreducers
 */
export type State = {|
  +auth: AuthState,
  +continents: AsyncState<ContinentReadAll>,
  +countries: AsyncState<CountryReadAll>,
  +drafts: DraftsState,
  +interests: InterestsState,
  +notifications: NotificationsState,
  +offers: OffersState,
  +organisations: OrganisationsState,
  +pitches: PitchesState,
  +projects: ProjectsState,
  +users: UsersState
|};

/**
 * Type definition for the actions supported by this reducer and its subreducers
 */

export type Actions =
  | AuthActions
  | FetchContinentsAction
  | FetchCountriesAction
  | DraftsActions
  | InterestsActions
  | NotificationsActions
  | OffersActions
  | OrganisationsActions
  | PitchesActions
  | ProjectsActions
  | UsersActions;

export default combineReducers<ReducerMap<State, any>, any>({
  auth: authReducer,
  continents: asyncActionReducer.bind(this, "wri/continents"),
  countries: asyncActionReducer.bind(this, "wri/countries"),
  drafts: draftsReducer,
  interests: interestsReducer,
  notifications: notificationReducer,
  offers: offersReducer,
  organisations: organisationsReducer,
  pitches: pitchesReducer,
  projects: projectsReducer,
  users: usersReducer
});
