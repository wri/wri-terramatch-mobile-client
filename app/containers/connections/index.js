// @flow

import type { AppState, ComponentProps, Dispatch } from "../../redux/redux.types";
import { connect } from "react-redux";
import wriAPI from "../../api/wri";
import ConnectionsScreen from "../../components/connections";
import {
  fetchReceivedInterests,
  fetchInitiatedInterests,
  fetchAllMatches
} from "../../redux/wri-api/interests/actions";

type OwnProps = {|
  +componentId: string
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  return {
    matchesState: state.wri.interests.matches,
    receivedInterestsState: state.wri.interests.receivedInterests,
    initiatedInterestsState: state.wri.interests.initiatedInterests,
    organisationVersionsState: state.wri.organisations.read
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    refreshData: () => {
      dispatch(fetchReceivedInterests());
      dispatch(fetchInitiatedInterests());
      dispatch(fetchAllMatches());
    },
    withdrawInterest: async (id: number) => {
      await wriAPI.interests.interestsIDDelete(id);
      dispatch(fetchReceivedInterests());
      dispatch(fetchInitiatedInterests());
      dispatch(fetchAllMatches());
    }
  };
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(ConnectionsScreen);
