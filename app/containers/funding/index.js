// @flow

import type { AppState, ComponentProps, Dispatch } from "../../redux/redux.types";
import { connect } from "react-redux";

import { updateFilteredPitchSearch, updateSearchFilter, updateSortOption } from "../../redux/wri-api/offers/actions";
import FundingScreen from "../../components/funding";
import { FilterCondition, PitchRead } from "wri-api";

type OwnProps = {|
  +componentId: string
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  return {
    pitches: state.wri.organisations.pitches,
    sortOption: state.wri.offers.filtersAndSorting.sortOption,
    filteredPitchId: state.wri.offers.filtersAndSorting.filteredPitchId,
    filterCondition: state.wri.offers.filtersAndSorting.filter,
    organisationVersionsState: state.wri.organisations.read
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    updateSavedForm: (filteredPitch: PitchRead, sortOption: SortAttributeEnum) => {
      dispatch(updateSortOption(sortOption));
      dispatch(updateFilteredPitchSearch(filteredPitch));
    },
    updateFilters: (filters: Array<FilterCondition>, sortOption: SortAttributeEnum) => {
      dispatch(updateSortOption(sortOption));
      dispatch(updateSearchFilter(filters));
    }
  };
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(FundingScreen);
