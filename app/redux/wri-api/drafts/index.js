// @flow

import type { AsyncState, ReducerMap } from "../../redux.types";
import type { CreateDraftAction, FetchDraftOffersAction, FetchDraftPitchesAction } from "./actions";
import { DraftReadAll } from "wri-api";
import { combineReducers } from "redux";
import { asyncActionReducer } from "../../asyncActionReducer";

/**
 * Type definition for the state managed by this reducer and its subreducers
 */
export type State = {|
  +offers: AsyncState<DraftReadAll>,
  +pitches: AsyncState<DraftReadAll>
|};

/**
 * Type definition for the actions supported by this reducer and its subreducers
 */
export type Actions = CreateDraftAction | FetchDraftOffersAction | FetchDraftPitchesAction;

export default combineReducers<ReducerMap<State, any>, any>({
  offers: asyncActionReducer.bind(this, "wri/drafts/offers/list"),
  pitches: asyncActionReducer.bind(this, "wri/drafts/pitches/list")
});
