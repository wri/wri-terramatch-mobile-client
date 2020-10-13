// @flow

import type { ProjectFormProps } from "../../../../screens/projectForms";
import React, { Component } from "react";
import { Navigation } from "react-native-navigation";
import { TeamMemberRead, TeamMemberReadAll, UserRead, UserReadAll } from "wri-api";
import ProjectContactList, { type ContactListItem, type PendingProjectContact } from "./contactList";
import ProjectFlowScreen from "../screen";
import translate from "../../../../locales";
import { projectCreationNavigation, projectCreationNavigationEvents } from "../../../../utils/navigation";

type Props = {|
  /**
   * Automatically sent by RNN if mounted in a navigation stack
   */
  +componentId: string,

  +addTeamMemberAsContact: TeamMemberRead => void,

  +addUserAsContact: UserRead => void,

  /**
   * Metadata about the form being modified
   */
  +formMetadata: ProjectFormProps,

  +organisationMembers: TeamMemberReadAll,

  +organisationUsers: UserReadAll,

  +removeContact: PendingProjectContact => void,

  +selectedContacts: Array<PendingProjectContact>
|};

export default class PitchTeamScreen extends Component<Props> {
  static options(passProps: { formMetadata: ProjectFormProps }) {
    return {
      ...projectCreationNavigation(passProps.formMetadata)
    };
  }

  constructor(props: Props) {
    super(props);
    Navigation.events().bindComponent(this);
  }

  navigationButtonPressed(event: any) {
    projectCreationNavigationEvents(event.buttonId, this.props.formMetadata);
  }

  _toggleState = (item: ContactListItem) => {
    if (item.selection) {
      this.props.removeContact(item.selection);
    } else if (item.type === "member") {
      this.props.addTeamMemberAsContact(item.data);
    } else if (item.type === "user") {
      this.props.addUserAsContact(item.data);
    }
    this.props.formMetadata.syncDraft();
  };

  getNumberOfContacts = (): number => {
    let projectContacts = 0;
    this.props.selectedContacts.forEach((item, index) => {
      if (item.type !== "deleted") {
        projectContacts++;
      }
    });
    return projectContacts;
  };

  render() {
    const items: Array<ContactListItem> = [
      ...this.props.organisationMembers.map(member => ({
        type: "member",
        data: member,
        selection: this.props.selectedContacts.find(
          contact => contact.type !== "deleted" && contact.data.team_member_id === member.id
        )
      })),
      ...this.props.organisationUsers
        .filter(user => !!user.email_address_verified_at) // Exclude unverified users (API rejects them)!
        .map(user => ({
          type: "user",
          data: user,
          selection: this.props.selectedContacts.find(
            contact => contact.type !== "deleted" && contact.data.user_id === user.id
          )
        }))
    ];
    const projectTypeKey = this.props.formMetadata.type === "offer" ? "createOffer" : "createPitch";

    return (
      <ProjectFlowScreen
        componentId={this.props.componentId}
        formMetadata={this.props.formMetadata}
        keyboard
        header={translate(`${projectTypeKey}.details.projectTeam`)}
        subtext={translate(`${projectTypeKey}.details.projectTeamHelp`)}
        isNextButtonEnabled={this.getNumberOfContacts() > 0}
      >
        <ProjectContactList items={items} onPress={this._toggleState} />
      </ProjectFlowScreen>
    );
  }
}
