// @flow

import type { File } from "../../../../../utils/models.types";
import type { PendingTeamMember } from "../../../../../redux/wri-api/organisations";
import React, { Component } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Navigation } from "react-native-navigation";
import { withSafeArea } from "react-native-safe-area";
import { TeamMemberUpdate } from "wri-api";
import Styles from "../../../../../styles";
import translate from "../../../../../locales/";
import ValidatedTextInput from "../../../../common/validated-input";
import InputLabel from "../../../../common/forms/input-label/";
import Validation from "../../../../../utils/validation";
import { logTeamMemberCreationEvent } from "../../../../../utils/analytics";
import textInputProps from "../../../../../constants/textInputProps";
import OrganisationSubmitScreen from "../../../../../containers/welcome/signUp/organisation/submit-screen";
import MediaPickerView from "../../../../common/media-picker-view";
import { organisationCreationNavigation } from "../../../../../utils/navigation";

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
   * If this is supplied it means we are modifying an existing item
   */
  +pendingItem: ?PendingTeamMember,
  +pendingItemId: ?number,

  /**
   * Flag indicating whether or not the organisation form should be submitted to the server when the next button is
   * pressed. If false, then the team member will be saved to the form, but not submitted to the server.
   */
  +submitFormWhenNextPressed: boolean,

  /**
   * The RNN component ID of the team member list screen
   */
  +teamMemberListScreenComponentId: string,

  /**
   * Updates the saved form so that it can be resumed
   */
  updateSavedForm: (?PendingTeamMember, $Shape<TeamMemberUpdate>, ?File) => void
|};

type State = {|
  +form: $Shape<TeamMemberUpdate>,
  +profileIconFile: ?File
|};

const NAV_BAR_BUTTON_ID_HOME = "nav_bar_btn_home";

const SafeAreaView = withSafeArea(ScrollView, "padding", "bottom");

export default class SignUpOrganisationAddTeamMemberScreen extends Component<Props, State> {
  static options(passProps: { isEdit: boolean }) {
    return {
      ...organisationCreationNavigation(passProps.isEdit)
    };
  }

  constructor(props: Props) {
    super(props);
    Navigation.events().bindComponent(this);

    this.state = {
      form: {},
      profileIconFile: null
    };
  }

  navigationButtonPressed(event: any) {
    if (event.buttonId === NAV_BAR_BUTTON_ID_HOME) {
      Navigation.popToRoot(this.props.componentId);
    }
  }

  _addProfileIcon = (file: ?File) => {
    this.setState({ profileIconFile: file });
  };

  _saveForm = () => {
    this.props.updateSavedForm(this.props.pendingItem, this.state.form, this.state.profileIconFile);
  };

  _nextStep = () => {
    logTeamMemberCreationEvent("add");
    Navigation.popTo(this.props.teamMemberListScreenComponentId);
  };

  _previousStep = () => {
    Navigation.pop(this.props.componentId);
  };

  _updateFormField = (fieldName: $Keys<TeamMemberUpdate>, text: any) => {
    this.setState(previous => ({ form: { ...previous.form, [fieldName]: text } }));
  };

  render() {
    // Reconcile the modifications with the original form
    const formModifications = this.state.form;
    const priorModifications = this.props.pendingItem?.data;
    const baseForm = this.props.pendingItem?.base;
    const form = {
      ...(baseForm ?? {}),
      ...(priorModifications ?? {}),
      ...formModifications
    };

    const canEditEmail = this.props.pendingItem?.type !== "existing_user";

    const isNameValid = Validation.firstName.validate(form.first_name);
    const isLastNameValid = Validation.lastName.validate(form.last_name);
    const isJobRoleValid = Validation.jobTitle.validate(form.job_role);
    const isEmailValid = Validation.email.validate(form.email_address, null, this.props.forbiddenEmails);
    const isNumberValid = Validation.mobileNumber.validate(form.phone_number);
    const allInputsValid = isNameValid && isLastNameValid && isJobRoleValid && isNumberValid && isEmailValid;
    const hasMadeModifications = !!this.state.profileIconFile || Object.keys(this.state.form).length > 0;

    const baseAvatarUri = this.props.pendingItem?.base?.avatar;
    const avatarFile =
      this.state.profileIconFile ??
      this.props.pendingItem?.avatarFile ??
      (baseAvatarUri ? { uri: baseAvatarUri, name: "", size: null, type: null } : null);
    return (
      <OrganisationSubmitScreen
        scrollComponent={SafeAreaView}
        secondary
        keyboard
        header={translate("addTeamMember.details.title")}
        subtext={translate("addTeamMember.details.noAccountSubtext")}
        isNextButtonEnabled={allInputsValid && hasMadeModifications}
        onPreviousButtonPressed={this._previousStep}
        submitFormWhenNextPressed={this.props.submitFormWhenNextPressed}
        onPreSubmit={this._saveForm}
        onPostSubmit={this._nextStep}
      >
        <InputLabel style={Styles.Text.centered} title={translate("addTeamMember.details.addTeamMemberProfile")} />

        <MediaPickerView
          style={styles.avatar}
          fileTypeFilter={"photo"}
          onMediaSelected={file => {
            this._addProfileIcon(file);
          }}
          selectedFile={avatarFile}
          uploadText={translate("common.upload")}
        />

        <InputLabel title={translate("addTeamMember.details.firstName")} required />

        <ValidatedTextInput
          key="member-firstName-input"
          ref="member-firstName-input"
          placeholder={translate("addTeamMember.details.firstName")}
          valid={isNameValid}
          value={form.first_name}
          message={Validation.firstName.errorString(form.first_name)}
          onChangeText={this._updateFormField.bind(this, "first_name")}
          onSubmitEditing={() => {
            this.refs["member-lastName-input"].focus();
          }}
          returnKeyType="next"
          style={{ marginBottom: Styles.Layout.Margins.small }}
          {...textInputProps.firstName}
        />

        <InputLabel title={translate("addTeamMember.details.lastName")} required />

        <ValidatedTextInput
          key="member-lastName-input"
          ref="member-lastName-input"
          placeholder={translate("addTeamMember.details.lastName")}
          valid={isLastNameValid}
          value={form.last_name}
          message={Validation.lastName.errorString(form.last_name)}
          onChangeText={this._updateFormField.bind(this, "last_name")}
          onSubmitEditing={() => {
            this.refs["member-jobRole-input"].focus();
          }}
          returnKeyType="next"
          style={{ marginBottom: Styles.Layout.Margins.small }}
          {...textInputProps.lastName}
        />

        <InputLabel title={translate("addTeamMember.details.jobRole")} required />

        <ValidatedTextInput
          key="member-jobRole-input"
          ref="member-jobRole-input"
          placeholder={translate("addTeamMember.details.jobRole")}
          valid={isJobRoleValid}
          value={form.job_role}
          message={Validation.jobTitle.errorString(form.job_role)}
          onChangeText={this._updateFormField.bind(this, "job_role")}
          onSubmitEditing={() => {
            if (canEditEmail) {
              this.refs["member-email-input"].focus();
            } else {
              this.refs["member-phone-input"].focus();
            }
          }}
          returnKeyType="next"
          style={{ marginBottom: Styles.Layout.Margins.small }}
          {...textInputProps.jobTitle}
        />

        <InputLabel title={translate("addTeamMember.details.email")} required />

        <ValidatedTextInput
          key="member-email-input"
          ref="member-email-input"
          placeholder={translate("addTeamMember.details.email")}
          value={form.email_address}
          valid={isEmailValid}
          editable={canEditEmail}
          onChangeText={this._updateFormField.bind(this, "email_address")}
          message={Validation.email.errorString(form.email_address, null, this.props.forbiddenEmails)}
          onSubmitEditing={() => {
            this.refs["member-phone-input"].focus();
          }}
          returnKeyType="next"
          style={{ marginBottom: Styles.Layout.Margins.small }}
          {...textInputProps.email}
        />

        <InputLabel title={translate("addTeamMember.details.phoneNumber")} required />

        <ValidatedTextInput
          key="member-phone-input"
          ref="member-phone-input"
          placeholder={translate("addTeamMember.details.phoneNumber")}
          valid={isNumberValid}
          value={form.phone_number}
          message={Validation.mobileNumber.errorString(form.phone_number)}
          onChangeText={this._updateFormField.bind(this, "phone_number")}
          onSubmitEditing={allInputsValid ? null : null}
          returnKeyType={allInputsValid ? "go" : "done"}
          style={{ marginBottom: Styles.Layout.Margins.small }}
          {...textInputProps.mobileNumber}
        />
      </OrganisationSubmitScreen>
    );
  }
}

const styles = StyleSheet.create({
  avatar: {
    alignSelf: "center",
    width: 144,
    height: 144,
    borderColor: Styles.Colours.border,
    borderRadius: Styles.Layout.BorderRadius.medium,
    borderWidth: 1,
    marginEnd: Styles.Layout.Margins.small
  }
});
