// @flow

import type { AppState, Dispatch, ComponentProps } from "../../../../../redux/redux.types";
import { UserInvite } from "wri-api";

import SignUpOrganisationInviteTeamMemberScreen from "../../../../../components/welcome/signUp/organisation/teamMember/inviteMember";
import { addUserInviteToForm } from "../../../../../redux/wri-api/organisations/actions";
import { connect } from "react-redux";

type OwnProps = {|
  componentId: string,
  isEdit: boolean,
  pendingItemId: ?number,
  teamMemberListScreenComponentId: string
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  const forbiddenEmails = [
    ...state.wri.organisations.registrationForm.pendingMembers.map(
      item => (item.id !== props.pendingItemId ? item.data.email_address?.toLowerCase?.() : null) ?? ""
    ),
    ...(state.wri.organisations.users.data ?? []).map(user => user.email_address?.toLowerCase?.() ?? ""),
    ...(state.wri.organisations.members.data ?? []).map(member => member.email_address?.toLowerCase?.() ?? "")
  ];

  // Add the logged-in users e-mail (although they should already be part of the org users array added above)
  if (state.wri.users.me.data && state.wri.users.me.data.email_address) {
    forbiddenEmails.push(state.wri.users.me.data.email_address?.toLowerCase?.());
  }

  // Remove the e-mail address of the pending member being modified (if any)
  const pendingItem = state.wri.organisations.registrationForm.pendingMembers.find(
    item => item.id === props.pendingItemId
  );
  const pendingMemberEmail = pendingItem?.base?.email_address;

  return {
    forbiddenEmails: forbiddenEmails.filter(email => !!email && email !== pendingMemberEmail)
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    updateSavedForm: (invite: UserInvite) => {
      dispatch(addUserInviteToForm(invite));
    }
  };
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(SignUpOrganisationInviteTeamMemberScreen);
