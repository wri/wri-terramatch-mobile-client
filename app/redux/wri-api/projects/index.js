// @flow

import type { AsyncState, ReducerMap } from "../../redux.types";
import type {
  FetchCarbonTypesAction,
  FetchFundingSourcesAction,
  FetchFundingBracketsAction,
  FetchLandOwnershipTypesAction,
  FetchLandSizesAction,
  FetchLandTypesAction,
  FetchReportingFrequenciesAction,
  FetchReportingLevelsAction,
  FetchRestorationGoalAction,
  FetchRestorationMethodsAction,
  FetchRevenueDriversAction,
  FetchSustainableDevelopmentGoalsAction,
  FetchVisibilitesAction
} from "./actions";
import {
  CarbonCertificationTypeReadAll,
  FundingSourceReadAll,
  FundingBracketReadAll,
  LandOwnershipReadAll,
  LandSizeReadAll,
  ReportingFrequencyReadAll,
  ReportingLevelReadAll,
  RestorationGoalReadAll,
  RestorationMethodReadAll,
  RevenueDriverReadAll,
  SustainableDevelopmentGoalReadAll,
  VisibilityReadAll
} from "wri-api";
import { combineReducers } from "redux";
import { asyncActionReducer } from "../../asyncActionReducer";

/**
 * Type definition for the state managed by this reducer and its subreducers
 */
export type State = {|
  +carbonTypes: AsyncState<CarbonCertificationTypeReadAll>,
  +fundingSources: AsyncState<FundingSourceReadAll>,
  +fundingBrackets: AsyncState<FundingBracketReadAll>,
  +landOwnershipTypes: AsyncState<LandOwnershipReadAll>,
  +landSizes: AsyncState<LandSizeReadAll>,
  +landTypes: AsyncState<CarbonCertificationTypeReadAll>,
  +reportingFrequencies: AsyncState<ReportingFrequencyReadAll>,
  +reportingLevels: AsyncState<ReportingLevelReadAll>,
  +restorationGoals: AsyncState<RestorationGoalReadAll>,
  +restorationMethods: AsyncState<RestorationMethodReadAll>,
  +revenueDrivers: AsyncState<RevenueDriverReadAll>,
  +sustainableDevelopmentGoals: AsyncState<SustainableDevelopmentGoalReadAll>,
  +visibilities: AsyncState<VisibilityReadAll>
|};

/**
 * Type definition for the actions supported by this reducer and its subreducers
 */
export type Actions =
  | FetchCarbonTypesAction
  | FetchFundingSourcesAction
  | FetchFundingBracketsAction
  | FetchLandOwnershipTypesAction
  | FetchLandSizesAction
  | FetchLandTypesAction
  | FetchReportingFrequenciesAction
  | FetchReportingLevelsAction
  | FetchRestorationGoalAction
  | FetchRestorationMethodsAction
  | FetchRevenueDriversAction
  | FetchSustainableDevelopmentGoalsAction
  | FetchVisibilitesAction;

export default combineReducers<ReducerMap<State, any>, any>({
  carbonTypes: asyncActionReducer.bind(this, "wri/projects/carbon_certification_types"),
  fundingSources: asyncActionReducer.bind(this, "wri/projects/funding_sources"),
  fundingBrackets: asyncActionReducer.bind(this, "wri/projects/funding_brackets"),
  landOwnershipTypes: asyncActionReducer.bind(this, "wri/projects/land_ownership_types"),
  landSizes: asyncActionReducer.bind(this, "wri/projects/land_sizes"),
  landTypes: asyncActionReducer.bind(this, "wri/projects/land_types"),
  reportingFrequencies: asyncActionReducer.bind(this, "wri/projects/reporting_frequency"),
  reportingLevels: asyncActionReducer.bind(this, "wri/projects/reporting_level"),
  restorationGoals: asyncActionReducer.bind(this, "wri/projects/restoration_goals"),
  restorationMethods: asyncActionReducer.bind(this, "wri/projects/restoration_methods"),
  revenueDrivers: asyncActionReducer.bind(this, "wri/projects/revenue_drivers"),
  sustainableDevelopmentGoals: asyncActionReducer.bind(this, "wri/projects/sustainable_development_goals"),
  visibilities: asyncActionReducer.bind(this, "wri/projects/visibilities")
});
