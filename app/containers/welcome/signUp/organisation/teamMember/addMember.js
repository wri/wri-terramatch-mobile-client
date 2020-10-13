// @flow

import type { AppState, Dispatch, ComponentProps } from "../../../../../redux/redux.types";
import type { File } from "../../../../../utils/models.types";
import type { PendingTeamMember } from "../../../../../redux/wri-api/organisations";
import { TeamMemberCreate, TeamMemberUpdate, UserUpdate } from "wri-api";
import SignUpOrganisationAddTeamMemberScreen from "../../../../../components/welcome/signUp/organisation/teamMember/addMember";
import {
  addTeamMemberToForm,
  updateOrganisationFormTeamMember,
  updateOrganisationFormUser
} from "../../../../../redux/wri-api/organisations/actions";
import { connect } from "react-redux";

type OwnProps = {|
  componentId: string,
  pendingItemId: ?number,
  submitFormWhenNextPressed: boolean,
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
    forbiddenEmails: forbiddenEmails.filter(email => !!email && email !== pendingMemberEmail),
    pendingItem: pendingItem
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    updateSavedForm: (
      item: ?PendingTeamMember,
      modifications: $Shape<TeamMemberUpdate & UserUpdate>,
      avatarFile: ?File
    ) => {
      if (!item) {
        // If there is no base item being modified, that means we are creating a team member from scratch
        dispatch(
          addTeamMemberToForm(
            TeamMemberCreate.constructFromObject({
              first_name: modifications.first_name ?? null,
              last_name: modifications.last_name ?? null,
              job_role: modifications.job_role ?? null,
              email_address: modifications.email_address ?? null,
              phone_number: modifications.phone_number ?? null,
              facebook: modifications.facebook ?? null,
              twitter: modifications.twitter ?? null,
              linkedin: modifications.linkedin ?? null,
              instagram: modifications.instagram ?? null,
              avatar: null
            }),
            avatarFile
          )
        );
        return;
      }

      switch (item.type) {
        case "created_member":
        case "existing_member": {
          dispatch(updateOrganisationFormTeamMember(item.id, modifications, avatarFile));
          break;
        }
        case "existing_user": {
          dispatch(updateOrganisationFormUser(item.id, modifications, avatarFile));
          break;
        }
        case "created_user": {
          console.warn("3SC", "Not possible to modify locally created user with team member form");
          break;
        }
      }
    }
  };
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(SignUpOrganisationAddTeamMemberScreen);
