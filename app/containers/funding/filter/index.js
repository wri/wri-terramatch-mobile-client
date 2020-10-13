// @flow

import type { AppState, Dispatch, ComponentProps } from "../../../redux/redux.types";
import { connect } from "react-redux";
import SearchFilterScreen from "../../../components/projects/filter";
import { updateSearchFilter } from "../../../redux/wri-api/offers/actions";
import { FilterCondition } from "wri-api";

type OwnProps = {|
  componentId: string
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  return {
    sortingOption: state.wri.offers.filtersAndSorting.sortOption,
    filterCondition: state.wri.offers.filtersAndSorting.filter,
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
    type: "offer"
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    updateFilters: (filter: Array<FilterCondition>, sortOption: string) => {
      dispatch(updateSearchFilter(filter));
    }
  };
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(SearchFilterScreen);
