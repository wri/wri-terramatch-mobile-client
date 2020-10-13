// @flow

import type { AppState, Dispatch, ComponentProps } from "../../../redux/redux.types";
import { connect } from "react-redux";
import SearchFilterScreen from "../../../components/projects/filter";
import { updateSearchFilter } from "../../../redux/wri-api/pitches/actions";
import { FilterCondition } from "wri-api";

type OwnProps = {|
  componentId: string
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  return {
    sortingOption: state.wri.pitches.filtersAndSorting.sortOption,
    filterCondition: state.wri.pitches.filtersAndSorting.filter,
    fundingSource: state.wri.projects.fundingSources,
    fundingBrackets: state.wri.projects.fundingBrackets,
    landOwnership: state.wri.projects.landOwnershipTypes,
    landTypes: state.wri.projects.landTypes,
    landSizes: state.wri.projects.landSizes,
    restorationMethod: state.wri.projects.restorationMethods,
    sustainableGoal: state.wri.projects.sustainableDevelopmentGoals,
    restorationGoal: state.wri.projects.restorationGoals,
    reportingFrequencies: state.wri.projects.reportingFrequencies,
    reportingLevels: state.wri.projects.reportingLevels,
    continents: state.wri.continents,
    type: "pitch"
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    updateFilters: (option: Array<FilterCondition>, sortOption: string) => {
      dispatch(updateSearchFilter(option));
    }
  };
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(SearchFilterScreen);
