// @flow

import type { AppState, Dispatch, ComponentProps } from "../../../../redux/redux.types";
import type { ProjectFormProps } from "../../../../screens/projectForms";
import type { PendingOfferContact } from "../../../../redux/wri-api/offers";
import type { PendingPitchContact } from "../../../../redux/wri-api/pitches";
import type { PendingProjectContact } from "../../../../components/pitches/project-creation/team/contactList";
import PitchTeamScreen from "../../../../components/pitches/project-creation/team";
import { connect } from "react-redux";
import { reconcileProjectRegistrationForm } from "../../../../api/wri/helpers";
import {
  OfferContactCreate,
  PitchContactCreate,
  TeamMemberRead,
  TeamMemberReadAll,
  UserRead,
  UserReadAll
} from "wri-api";
import { removeOfferContact, createOfferContacts } from "../../../../redux/wri-api/offers/actions";
import { removePitchContact, createPitchContacts } from "../../../../redux/wri-api/pitches/actions";

type OwnProps = {|
  componentId: string,
  formMetadata: ProjectFormProps
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  const form = reconcileProjectRegistrationForm(state, props.formMetadata);
  const contacts: any = form.contacts;
  return {
    organisationMembers: state.wri.organisations.members?.data ?? new TeamMemberReadAll(),
    organisationUsers: state.wri.organisations.users?.data ?? new UserReadAll(),
    selectedContacts: contacts
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    addTeamMemberAsContact: (member: TeamMemberRead) => {
      if (props.formMetadata.type === "pitch") {
        dispatch(
          createPitchContacts(
            props.formMetadata.formId,
            PitchContactCreate.constructFromObject({
              pitch_id: null,
              team_member_id: member.id,
              user_id: undefined
            })
          )
        );
      } else {
        dispatch(
          createOfferContacts(
            props.formMetadata.formId,
            OfferContactCreate.constructFromObject({
              offer_id: null,
              team_member_id: member.id,
              user_id: undefined
            })
          )
        );
      }
    },
    addUserAsContact: (user: UserRead) => {
      if (props.formMetadata.type === "pitch") {
        dispatch(
          createPitchContacts(
            props.formMetadata.formId,
            PitchContactCreate.constructFromObject({
              pitch_id: null,
              team_member_id: undefined,
              user_id: user.id
            })
          )
        );
      } else {
        dispatch(
          createOfferContacts(
            props.formMetadata.formId,
            OfferContactCreate.constructFromObject({
              offer_id: null,
              team_member_id: undefined,
              user_id: user.id
            })
          )
        );
      }
    },
    removeContact: (contact: PendingProjectContact) => {
      if (props.formMetadata.type === "offer") {
        dispatch(removeOfferContact(props.formMetadata.formId, ((contact: any): PendingOfferContact)));
      } else {
        dispatch(removePitchContact(props.formMetadata.formId, ((contact: any): PendingPitchContact)));
      }
    }
  };
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(PitchTeamScreen);
