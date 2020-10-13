// @flow

import type { AppState, ComponentProps, Dispatch } from "../../../redux/redux.types";
import { connect } from "react-redux";
import ProjectApplyInterestScreen from "../../../components/projects/interest";
import wriAPI from "../../../api/wri";

import { fetchAllMatches, fetchInitiatedInterests } from "../../../redux/wri-api/interests/actions";
import { InterestCreate } from "wri-api";
import type { Project } from "../../../utils/models.types";
import { createOrResumeForm } from "../../../screens/projectForms";

type OwnProps = {|
  +componentId: string,
  +theirProjectId: number,
  +theirProjectType: Project,
  +theirProjectName: string
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  return {
    myInterests: [...(state.wri.interests.initiatedInterests.data ?? []), ...(state.wri.interests.matches.data ?? [])],
    myOffers: state.wri.organisations.offers,
    myPitches: state.wri.organisations.pitches
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    createNewInterest: async (interest: InterestCreate) => {
      await wriAPI.interests.interestsPost(interest);
      dispatch(fetchInitiatedInterests());
      dispatch(fetchAllMatches());
    },
    createNewForm: () => {
      dispatch(createOrResumeForm(props.theirProjectType === "offer" ? "pitch" : "offer", null, null, null));
    }
  };
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(ProjectApplyInterestScreen);
