// @flow

import type { OrganisationRegistrationForm, PendingTeamMember } from "../../../redux/wri-api/organisations";
import React, { Component, type ElementConfig } from "react";
import { Navigation } from "react-native-navigation";

import translate from "../../../locales/";
import OrganisationDetailsScreen from "./index";
import debounceFunc from "../../../utils/debounceFunc";
import { screens } from "../../../screens";

const editIcon = require("../../../assets/icons/profile/edit.png");

const NAV_BAR_BUTTON_ID_EDIT = "nav_bar_btn_edit";

type BaseProps = ElementConfig<typeof OrganisationDetailsScreen>;
type BasePropsWithoutProvided = $Rest<
  BaseProps,
  {|
    +isOwnedByUser: any
  |}
>;

type Props = {|
  ...BasePropsWithoutProvided,

  +createOrganisationForm: () => Promise<OrganisationRegistrationForm>,

  /**
   * User ID of the current logged in user
   */
  +loggedInUserId: ?number
|};

export default class MyOrganisationDetailsScreen extends Component<Props> {
  static options(passProps: {}) {
    return {
      topBar: {
        rightButtons: [
          {
            id: NAV_BAR_BUTTON_ID_EDIT,
            icon: editIcon,
            showAsAction: "always"
          }
        ],
        title: {
          text: translate("profile.title")
        }
      }
    };
  }

  constructor(props: Props) {
    super(props);
    Navigation.events().bindComponent(this);
  }

  navigationButtonPressed(event: { buttonId: string }) {
    if (event.buttonId === NAV_BAR_BUTTON_ID_EDIT) {
      this._onEditOrganisationPressed();
    }
  }

  _handleContactPress = async (item: PendingTeamMember) => {
    // When a contact is pressed then open up the edit screen
    const createdForm = await this.props.createOrganisationForm();

    // Find the item in the created form that we will be editing
    let itemToEdit = null;

    switch (item.type) {
      case "existing_member": {
        const memberId = item.base.id;
        itemToEdit = createdForm.pendingMembers.find(
          item => item.type === "existing_member" && item.base.id === memberId
        );
        break;
      }
      case "existing_user": {
        const userId = item.base.id;
        if (userId === this.props.loggedInUserId) {
          itemToEdit = createdForm.pendingMembers.find(
            item => item.type === "existing_user" && item.base.id === userId
          );
        }
        break;
      }
      default: {
        break;
      }
    }

    if (!itemToEdit) {
      console.warn("3SC", "Cannot edit contact of this type", item);
      return;
    }

    Navigation.push(this.props.componentId, {
      component: {
        ...screens.SIGNUP_ORGANISATION_ADDTEAMMEMBER,
        passProps: {
          teamMemberListScreenComponentId: this.props.componentId,
          isEdit: true,
          pendingItemId: itemToEdit.id,
          submitFormWhenNextPressed: true
        }
      }
    });
  };

  _onEditOrganisationPressed = debounceFunc(async () => {
    await this.props.createOrganisationForm();
    Navigation.push(this.props.componentId, {
      component: {
        name: screens.SIGNUP_ORGANISATION_DETAILS.name,
        passProps: {
          isEdit: true
        }
      }
    });
  });

  render() {
    // eslint-disable-next-line no-unused-vars
    const { createOrganisationForm, loggedInUserId, onEditOrganisationPressed, ...rest } = this.props;
    return (
      <OrganisationDetailsScreen
        {...rest}
        isOwnedByUser={true}
        onContactPress={this._handleContactPress}
        onEditOrganisationPressed={this._onEditOrganisationPressed}
      />
    );
  }
}
