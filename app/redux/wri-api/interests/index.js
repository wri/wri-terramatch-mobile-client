// @flow

import type { AsyncState, ReducerMap } from "../../redux.types";
import type { FetchReceivedInterestsAction, FetchInitiatedInterestsAction, FetchAllMatchesAction } from "./actions";
import { InterestRead, MatchRead, OfferRead, PitchRead } from "wri-api";
import { combineReducers } from "redux";
import { asyncActionReducer } from "../../asyncActionReducer";
import type { Project } from "../../../utils/models.types";

/**
 * A MatchRead instance but with its offer_id and pitch_id fields resolved to an OfferRead and PitchRead model
 */
export type ResolvedMatch = {
  ...InterestRead,
  ...MatchRead,
  offer: OfferRead,
  pitch: PitchRead,
  mine: Project,
  theirs: Project
};

/**
 * Type definition for the state managed by this reducer and its subreducers
 */
export type State = {|
  +receivedInterests: AsyncState<Array<ResolvedMatch>>,
  +initiatedInterests: AsyncState<Array<ResolvedMatch>>,
  +matches: AsyncState<Array<ResolvedMatch>>
|};

/**
 * Type definition for the actions supported by this reducer and its subreducers
 */
export type Actions = FetchReceivedInterestsAction | FetchInitiatedInterestsAction | FetchAllMatchesAction;

export default combineReducers<ReducerMap<State, any>, any>({
  receivedInterests: asyncActionReducer.bind(this, "wri/interests/received"),
  initiatedInterests: asyncActionReducer.bind(this, "wri/interests/initiated"),
  matches: asyncActionReducer.bind(this, "wri/interests/matches/all")
});
