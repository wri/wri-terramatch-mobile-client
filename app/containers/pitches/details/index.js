// @flow

import type { AppState, ComponentProps, Dispatch } from "../../../redux/redux.types";
import { connect } from "react-redux";
import PitchScreen from "../../../components/pitches/details";

import { PitchRead } from "wri-api";
import { fetchPitchData } from "../../../redux/wri-api/cache/actions";
import { transformAsyncState } from "../../../redux/asyncActionReducer";
import {
  convertCertificationsToVersions,
  convertPitchesToVersions,
  convertPitchDocumentsToVersions,
  convertRestorationMetricsToVersions,
  convertTreeSpeciesToVersions
} from "../../../api/wri/helpers";

type OwnProps = {|
  +componentId: string,
  +filteredId: number,
  +isOwnedByUser: boolean,
  +pitchBase: ?PitchRead,
  +pitchId: number
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  return {
    certificationState: transformAsyncState(state.wriCache.pitchCertification, data =>
      convertCertificationsToVersions(data)
    ),
    contactsState: state.wriCache.pitchContacts,
    documentsState: transformAsyncState(state.wriCache.pitchDocuments, data => convertPitchDocumentsToVersions(data)),
    metricsState: transformAsyncState(state.wriCache.pitchMetrics, data => convertRestorationMetricsToVersions(data)),
    myOffers: state.wri.organisations.offers,
    myOrganisation: state.wri.organisations.read,
    organisationState: state.wriCache.organisationDetails,
    treeSpeciesState: transformAsyncState(state.wriCache.pitchTreeSpecies, data => convertTreeSpeciesToVersions(data)),
    versionsState: transformAsyncState(
      state.wriCache.pitchDetails,
      pitchDetails => convertPitchesToVersions(([pitchDetails]: Array<PitchRead>)),
      props.pitchBase ? convertPitchesToVersions(([props.pitchBase]: Array<PitchRead>)) : null
    )
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    fetchPitchData: () => {
      dispatch(fetchPitchData(props.pitchId, props.pitchBase?.organisation_id));
    },
    onEditPitchPressed: () => {}
  };
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(PitchScreen);
