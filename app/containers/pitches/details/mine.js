// @flow

import type { AppState, ComponentProps, Dispatch } from "../../../redux/redux.types";
import { connect } from "react-redux";
import PitchScreen from "../../../components/pitches/details/mine";
import wriAPI from "../../../api/wri";

import { PitchRead, PitchComplete } from "wri-api";
import { createOrResumeForm } from "../../../screens/projectForms";
import { inspectOrganisationPitches } from "../../../redux/wri-api/organisations/actions";
import { inspectPitchData } from "../../../redux/wri-api/cache/actions";
import { transformAsyncState } from "../../../redux/asyncActionReducer";
import { findMostRecentOrganisationVersion } from "../../../api/wri/helpers";

type OwnProps = {|
  +componentId: string,
  +filteredId: number,
  +pitchBase: PitchRead,
  +pitchId: number
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  return {
    certificationState: state.wriCache.pitchCertificationVersions,
    contactsState: state.wriCache.pitchContacts,
    documentsState: state.wriCache.pitchDocumentVersions,
    metricsState: state.wriCache.pitchMetricVersions,
    organisationState: transformAsyncState(
      state.wri.organisations.read,
      versions => findMostRecentOrganisationVersion(versions)?.data
    ),
    treeSpeciesState: state.wriCache.pitchTreeSpeciesVersions,
    versionsState: state.wriCache.pitchVersions
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    fetchPitchData: () => {
      dispatch(inspectPitchData(props.pitchId));
    },
    onArchivePitchPressed: async () => {
      await wriAPI.pitches.pitchesIDCompletePatch(
        props.pitchId,
        PitchComplete.constructFromObject({ successful: false })
      );

      const orgId = props.pitchBase.organisation_id;
      if (orgId) {
        dispatch(inspectOrganisationPitches(orgId));
      }
    },
    onEditPitchPressed: async () => {
      await dispatch(createOrResumeForm("pitch", null, null, props.pitchId));
    }
  };
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(PitchScreen);
