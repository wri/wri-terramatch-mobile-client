// @flow

import type { AppState, ComponentProps, Dispatch } from "../../redux/redux.types";
import { connect } from "react-redux";
import { updateFilteredOfferSearch, updateSearchFilter, updateSortOption } from "../../redux/wri-api/pitches/actions";
import ProjectsScreen from "../../components/projects";
import { FilterCondition, OfferRead } from "wri-api";

type OwnProps = {|
  +componentId: string
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  return {
    offers: state.wri.organisations.offers,
    sortOption: state.wri.pitches.filtersAndSorting.sortOption,
    filterCondition: state.wri.pitches.filtersAndSorting.filter,
    filteredOfferId: state.wri.pitches.filtersAndSorting.filteredOfferId,
    organisationVersionsState: state.wri.organisations.read
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    updateSavedForm: (filteredOffer: OfferRead, sortOption: SortAttributeEnum) => {
      dispatch(updateSortOption(sortOption));
      dispatch(updateFilteredOfferSearch(filteredOffer));
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
)(ProjectsScreen);
