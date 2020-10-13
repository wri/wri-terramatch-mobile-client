// @flow

import type { AppState, ComponentProps, Dispatch } from "../../../redux/redux.types";
import type { OrganisationRegistrationForm } from "../../../redux/wri-api/organisations";
import type { ProjectDraftRead } from "../../../api/wri/wri.types";
import type { TabName } from "../../../components/organisation/details/base-view";
import { connect } from "react-redux";

import MyOrganisationDetailsScreen from "../../../components/organisation/details/mine";
import {
  createOrganisationRegistrationForm,
  fetchMyOrganisationData
} from "../../../redux/wri-api/organisations/actions";

import { createOrResumeForm } from "../../../screens/projectForms";

type OwnProps = {|
  +componentId: string,
  +selectedTab: TabName
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  return {
    draftOffers: state.wri.drafts.offers,
    draftPitches: state.wri.drafts.pitches,
    documentsState: state.wri.organisations.documents,
    membersState: state.wri.organisations.members,
    loggedInUserId: state.wri.users.me.data?.id,
    offersState: state.wri.organisations.offersInspect,
    organisationId:
      state.wri.users.me.data?.organisation_id ?? state.wri.users.createAccount.data?.organisation_id ?? 0,
    pitchesState: state.wri.organisations.pitchVersions,
    usersState: state.wri.organisations.users,
    versionsState: state.wri.organisations.read
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    createOrganisationForm: async (): Promise<OrganisationRegistrationForm> => {
      return await dispatch(createOrganisationRegistrationForm());
    },
    fetchOrganisationData: () => {
      dispatch(fetchMyOrganisationData());
    },
    onEditDraftPressed: async (project: ProjectDraftRead): Promise<void> => {
      await dispatch(
        createOrResumeForm(project.type === "pitch_draft" ? "pitch" : "offer", null, project.draftId, null)
      );
    }
  };
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(MyOrganisationDetailsScreen);
