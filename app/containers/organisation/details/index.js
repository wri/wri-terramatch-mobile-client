// @flow

import type { AppState, ComponentProps, Dispatch } from "../../../redux/redux.types";
import { connect } from "react-redux";
import OrganisationDetailsScreen from "../../../components/organisation/details";
import { fetchOrganisationData } from "../../../redux/wri-api/cache/actions";
import { initialAsyncState, transformAsyncState } from "../../../redux/asyncActionReducer";
import {
  convertOrganisationDocumentsToVersions,
  convertOrganisationsToVersions,
  convertPitchesToVersions
} from "../../../api/wri/helpers";
import { OrganisationRead } from "wri-api";
import type { TabName } from "../../../components/organisation/details/base-view";

/**
 * Props that will need to be passed when pushing to this screen through react-native-navigation
 */
export type RnnPassProps = {|
  +isOwnedByUser: boolean,
  +organisationId: number,
  +selectedTab?: TabName
|};

type OwnProps = {|
  ...RnnPassProps,
  +componentId: string
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  const orgDetailsState = state.wriCache.organisationDetails ?? initialAsyncState;
  const orgDocsState = state.wriCache.organisationDocuments ?? initialAsyncState;
  const orgMembersState = state.wriCache.organisationTeamMembers ?? initialAsyncState;
  const orgOffersState = state.wriCache.organisationOffers ?? initialAsyncState;
  const orgPitchesState = state.wriCache.organisationPitches ?? initialAsyncState;
  const orgUsersState = state.wriCache.organisationUsers ?? initialAsyncState;

  return {
    documentsState: transformAsyncState(orgDocsState, orgDocs => convertOrganisationDocumentsToVersions(orgDocs)),
    membersState: orgMembersState,
    offersState: orgOffersState,
    pitchesState: transformAsyncState(orgPitchesState, orgPitches => convertPitchesToVersions(orgPitches)),
    usersState: orgUsersState,
    versionsState: transformAsyncState(orgDetailsState, orgDetails =>
      convertOrganisationsToVersions(([orgDetails]: Array<OrganisationRead>))
    )
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    fetchOrganisationData: () => {
      dispatch(fetchOrganisationData(props.organisationId));
    }
  };
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(OrganisationDetailsScreen);
