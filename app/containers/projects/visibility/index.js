// @flow

import type { AppState, ComponentProps, Dispatch } from "../../../redux/redux.types";
import { connect } from "react-redux";
import ProjectVisibilitiesScreen from "../../../components/projects/visibility";
import type { Project } from "../../../utils/models.types";
import { OfferRead, OfferVisibility, PitchRead, PitchVisibility } from "wri-api";
import wriAPI from "../../../api/wri";
import { inspectOrganisationOffers, inspectOrganisationPitches } from "../../../redux/wri-api/organisations/actions";

type OwnProps = {|
  +componentId: string,
  +project: OfferRead | PitchRead,
  +projectType: Project
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  return {
    visibilities: state.wri.projects.visibilities
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    updateVisibility: async (
      projectType: Project,
      visibility: OfferVisibility | PitchVisibility,
      project: OfferRead | PitchRead
    ) => {
      if (projectType === "pitch") {
        await wriAPI.pitches.pitchesIDVisibilityPatch(project.id, visibility);
        dispatch(inspectOrganisationPitches(project.organisation_id));
      } else if (projectType === "offer") {
        await wriAPI.offers.offersIDVisibilityPatch(project.id, visibility);
        dispatch(inspectOrganisationOffers(project.organisation_id));
      }
    }
  };
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(ProjectVisibilitiesScreen);
