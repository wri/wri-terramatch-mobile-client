// @flow

import React, { Component } from "react";
import { ScrollView } from "react-native";
import { Navigation } from "react-native-navigation";
import { withSafeArea } from "react-native-safe-area";
import { UserInvite } from "wri-api";
import Styles from "../../../../../styles";
import translate from "../../../../../locales/";
import ValidatedTextInput from "../../../../common/validated-input";
import InputLabel from "../../../../common/forms/input-label/";
import Validation from "../../../../../utils/validation";
import { logTeamMemberCreationEvent } from "../../../../../utils/analytics";
import { organisationCreationNavigation } from "../../../../../utils/navigation";

import textInputProps from "../../../../../constants/textInputProps";
import Screen from "../../../../common/screen";

type Props = {|
  /**
   * Automatically sent by RNN if mounted in a navigation stack
   */
  +componentId: string,

  /**
   *  Emails of the organisations team members. Each member should have a unique email
   */
  +forbiddenEmails: Array<string>,

  /**
   * The RNN component ID of the team member list screen
   */
  +teamMemberListScreenComponentId: string,

  +isEdit: boolean,

  /**
   * Updates the saved form so that it can be resumed
   */
  updateSavedForm: UserInvite => void
|};

type State = {|
  +email: string
|};

const NAV_BAR_BUTTON_ID_HOME = "nav_bar_btn_home";

const SafeAreaView = withSafeArea(ScrollView, "padding", "bottom");

/**
 * Whether or not to autofill the form fields. By default does it when running a development build
 */
const AUTOFILL_FORM = __DEV__;

export default class SignUpOrganisationInviteTeamMemberScreen extends Component<Props, State> {
  static options(passProps: { isEdit: boolean }) {
    return {
      ...organisationCreationNavigation(passProps.isEdit)
    };
  }

  constructor(props: Props) {
    super(props);
    Navigation.events().bindComponent(this);

    if (AUTOFILL_FORM) {
      this.state = {
        email: "bonginkosi@mdladlan.com"
      };
    } else {
      this.state = {
        email: ""
      };
    }
  }

  navigationButtonPressed(event: any) {
    if (event.buttonId === NAV_BAR_BUTTON_ID_HOME) {
      {
        Navigation.popToRoot(this.props.componentId);
      }
    }
  }

  _addProfile() {
    /**
     * TODO add a new screen for thee new social media
     */
  }

  _startListMember = () => {
    this._saveForm();
    logTeamMemberCreationEvent("invite");
    Navigation.popTo(this.props.teamMemberListScreenComponentId);
  };

  _previousStep = () => {
    Navigation.pop(this.props.componentId);
  };

  _saveForm = () => {
    this.props.updateSavedForm(
      UserInvite.constructFromObject({
        email_address: this.state.email
      })
    );
  };

  _updateFormField = (fieldName: $Keys<State>, text: string) => {
    this.setState(previous => ({ ...previous, [fieldName]: text }));
  };

  render() {
    const isEmailValid = Validation.email.validate(this.state.email, null, this.props.forbiddenEmails);

    return (
      <Screen
        scrollComponent={SafeAreaView}
        secondary
        keyboard
        header={translate("addTeamMember.details.title")}
        subtext={translate("addTeamMember.details.needsAccountSubtext")}
        isNextButtonEnabled={isEmailValid}
        onPreviousButtonPressed={this._previousStep}
        onNextButtonPressed={this._startListMember}
      >
        <InputLabel title={translate("addTeamMember.details.email")} required />

        <ValidatedTextInput
          key="member-email-input"
          ref="member-email-input"
          placeholder={translate("addTeamMember.details.email")}
          message={Validation.email.errorString(this.state.email, null, this.props.forbiddenEmails)}
          value={this.state.email}
          valid={isEmailValid}
          onChangeText={this._updateFormField.bind(this, "email")}
          style={{ marginBottom: Styles.Layout.Margins.small }}
          {...textInputProps.email}
        />
      </Screen>
    );
  }
}
