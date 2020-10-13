// @flow

import type { AsyncState, ReducerMap } from "../redux.types";
import type { fetchNewsContentAction, fetchTestimonialContentAction, fetchProjectsContentAction } from "./actions";
import { combineReducers } from "redux";
import { asyncActionReducer } from "../asyncActionReducer";

/**
 * Type definition for the state managed by this reducer and its subreducers
 */
export type State = {|
  +news: AsyncState<any>,
  +testimonials: AsyncState<any>,
  +projects: AsyncState<any>
|};

/**
 * Type definition for the actions supported by this reducer and its subreducers
 */
export type Actions = fetchNewsContentAction | fetchTestimonialContentAction | fetchProjectsContentAction;

export default combineReducers<ReducerMap<State, any>, any>({
  news: asyncActionReducer.bind(this, "wordpress/news/fetch_details"),
  testimonials: asyncActionReducer.bind(this, "wordpress/testimonials/fetch_details"),
  projects: asyncActionReducer.bind(this, "wordpress/projects/fetch_details")
});
