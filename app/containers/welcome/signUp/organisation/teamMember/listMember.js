// @flow

import type { AppState, Dispatch, ComponentProps } from "../../../../../redux/redux.types";
import type { PendingTeamMember } from "../../../../../redux/wri-api/organisations";

import SignUpOrganisationListTeamMemberScreen from "../../../../../components/welcome/signUp/organisation/teamMember/listMember";
import { connect } from "react-redux";
import { reconcileOrganisationRegistrationForm } from "../../../../../api/wri/helpers";
import { removeOrganisationTeamMember } from "../../../../../redux/wri-api/organisations/actions";

type OwnProps = {|
  componentId: string,
  isEdit: boolean
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  const form = reconcileOrganisationRegistrationForm(state.wri.organisations.registrationForm);
  return {
    list: form.pendingMembers,
    loggedInUserId: state.wri.users.me.data?.id
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    removeMember: (member: PendingTeamMember): void => {
      dispatch(removeOrganisationTeamMember(member));
    }
  };
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(SignUpOrganisationListTeamMemberScreen);
