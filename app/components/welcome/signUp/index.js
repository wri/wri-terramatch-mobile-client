// @flow

import type { AsyncState } from "../../../redux/redux.types";
import { UserAccept, UserCreate, UserRead } from "wri-api";
import React, { Component } from "react";
import { StyleSheet, ScrollView, Text, Linking, View } from "react-native";
import { withSafeArea } from "react-native-safe-area";
import Styles from "../../../styles/";
import Button from "../../common/button";
import Checkbox from "../../common/checkbox";
import Touchable from "../../common/touchable";
import Screen from "../../common/screen";
import InputLabel from "../../common/forms/input-label/";
import ValidatedTextInput from "../../common/validated-input";
import Validation from "../../../utils/validation";
import textInputProps from "../../../constants/textInputProps";
import translate from "../../../locales/";
import LoadingIndicator from "../../common/loading-indicator";
import Error from "../../common/error";
import { logRegistrationEvent } from "../../../utils/analytics";
import Config from "react-native-config";

type Props = {|
  +accountCreationState: AsyncState<UserRead> | AsyncState<UserAccept>,

  /**
   * Automatically sent by RNN if mounted in a navigation stack
   */
  +componentId: string,

  /**
   * Deep linking email. Pre-filled from email.
   */
  +email: ?string,

  /**
   * A function, that when called, makes a request to sign up the user.
   */
  +onSignUpPressed: ($Shape<UserAccept & UserCreate>) => Promise<any>
|};

type Form = {|
  +firstName: string,
  +lastName: string,
  +email: string,
  +jobTitle: string,
  +password: string,
  +verifiedPassword: string,
  +phoneNumber: string,
  +facebook: ?string,
  +linkedin: ?string,
  +twitter: ?string,
  +instagram: ?string
|};

type State = {|
  hasSubmitted: boolean,
  hasAcceptedTerms: boolean,
  hasAgreedConsent: boolean,
  /**
   * The form and its fields, as they are being entered by the user ready for submission
   */
  +form: Form,

  /**
   * Flag indicating whether or not the form has been submitted.
   */
  +hasSubmitted: boolean,

  /**
   * Keep track of the previous submission so we know whether server-side validation issues have been fixed
   */
  +previousSubmission: ?Form
|};

const SafeAreaView = withSafeArea(ScrollView, "padding", "bottom");

/**
 * Whether or not to autofill the form fields. By default does it when running a development build
 */
const AUTOFILL_FORM = false;

export default class SignUpScreen extends Component<Props, State> {
  static options(passProps: Props) {
    return {
      topBar: {
        title: {
          text: translate("signup.title"),
          alignment: "fill"
        }
      }
    };
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      hasSubmitted: false,
      hasAcceptedTerms: false,
      hasAgreedConsent: false,
      form: AUTOFILL_FORM
        ? {
            firstName: "Test",
            lastName: "McName",
            email: `mobile+${Date.now()}@3sidedcube.com`,
            jobTitle: "Life coach",
            password: "Password123",
            verifiedPassword: "Password123",
            phoneNumber: "01202611612",
            facebook: null,
            instagram: null,
            linkedin: null,
            twitter: null
          }
        : {
            firstName: "",
            lastName: "",
            email: this.props.email ?? "",
            jobTitle: "",
            password: "",
            verifiedPassword: "",
            phoneNumber: "",
            facebook: null,
            instagram: null,
            linkedin: null,
            twitter: null
          },
      previousSubmission: null
    };
  }

  _onSignUpPressed = async () => {
    await this.setState(previous => ({
      hasSubmitted: true,
      previousSubmission: previous.form
    }));
    let user: ?$Shape<UserAccept & UserCreate> = null;
    if (this.props.email === undefined) {
      user = {
        email_address: this.state.form.email.trim(),
        first_name: this.state.form.firstName.trim(),
        last_name: this.state.form.lastName.trim(),
        job_role: this.state.form.jobTitle.trim(),
        password: this.state.form.password.trim(),
        phone_number: this.state.form.phoneNumber.trim(),
        facebook: null,
        twitter: null,
        instagram: null,
        linkedin: null
      };
      logRegistrationEvent("signup");
    } else {
      user = {
        email_address: this.props.email,
        first_name: this.state.form.firstName.trim(),
        last_name: this.state.form.lastName.trim(),
        job_role: this.state.form.jobTitle.trim(),
        password: this.state.form.password.trim(),
        phone_number: this.state.form.phoneNumber.trim(),
        facebook: null,
        twitter: null,
        instagram: null,
        linkedin: null
      };
    }
    await this.props.onSignUpPressed(user);
  };

  _trimFormField = (fieldName: $Keys<Form>) => {
    this.setState(previous => ({
      form: { ...previous.form, [fieldName]: (previous.form[fieldName] ? previous.form[fieldName] : "").trim() }
    }));
  };

  _updateFormField = (fieldName: $Keys<Form>, text: string) => {
    this.setState(previous => ({ form: { ...previous.form, [fieldName]: text } }));
  };

  _updateTermsCheckboxState = () => {
    this.setState(prevState => ({ hasAcceptedTerms: !prevState.hasAcceptedTerms }));
  };

  _updateConsentCheckboxState = () => {
    this.setState(prevState => ({ hasAgreedConsent: !prevState.hasAgreedConsent }));
  };

  openPrivacyPolicy() {
    Linking.openURL(Config.PRIVACY_POLICY);
  }

  openTerms() {
    Linking.openURL(Config.TERMS_OF_SERVICE);
  }

  render() {
    const { form, previousSubmission } = this.state;

    // Ignore any API error or fetching flag held in state until the form is submitted
    const isInProgress = this.state.hasSubmitted && this.props.accountCreationState.isFetching;
    const apiError =
      this.state.hasSubmitted && !this.props.accountCreationState.isFetching
        ? this.props.accountCreationState.error
        : null;
    const apiValidation = apiError?.data;
    const hasServerSideValidationErrors = (apiValidation?.errors?.length ?? 0) > 0;

    // Keep track of whether the user has changed the field values since they last submitted to the server
    // If this is true for a field it means we will present server-side API validation errors to the user beneath that field
    // If false then the user has changed the field since it was submitted server-side, so don't show that error
    const isUnfixed = {
      firstName: form.firstName === previousSubmission?.firstName,
      lastName: form.lastName === previousSubmission?.lastName,
      email: form.email === previousSubmission?.email,
      jobTitle: form.jobTitle === previousSubmission?.jobTitle,
      password: form.password === previousSubmission?.password,
      phoneNumber: form.phoneNumber === previousSubmission?.phoneNumber,
      facebook: form.facebook === previousSubmission?.facebook,
      instagram: form.instagram === previousSubmission?.instagram,
      twitter: form.twitter === previousSubmission?.twitter,
      linkedin: form.linkedin === previousSubmission?.linkedin
    };

    // Apply both local validation and server-side validation (in the form of API error messages) to the form fields
    const isFirstNameValid = Validation.firstName.validate(form.firstName, isUnfixed.firstName ? apiValidation : null);
    const isLastNameValid = Validation.lastName.validate(form.lastName, isUnfixed.lastName ? apiValidation : null);
    const isEmailValid = Validation.email.validate(form.email, isUnfixed.email ? apiValidation : null);
    const isPhoneNumberValid = Validation.mobileNumber.validate(
      form.phoneNumber,
      isUnfixed.phoneNumber ? apiValidation : null
    );
    const isJobTitleValid = Validation.jobTitle.validate(form.jobTitle, isUnfixed.jobTitle ? apiValidation : null);
    const isPasswordValid = Validation.password.validate(form.password, isUnfixed.password ? apiValidation : null);
    const isTermsAccepted = Validation.acceptedTerms.validate(this.state.hasAcceptedTerms);
    const isConsentAgreed = Validation.agreedConsent.validate(this.state.hasAgreedConsent);

    const passwordsMatch = form.password === form.verifiedPassword;
    const arePasswordsValid = isPasswordValid && passwordsMatch;
    const allInputsValid =
      isFirstNameValid &&
      isLastNameValid &&
      isEmailValid &&
      isPhoneNumberValid &&
      isJobTitleValid &&
      arePasswordsValid &&
      isTermsAccepted &&
      isConsentAgreed;
    const canSubmit = allInputsValid && !isInProgress;

    // Always show API error unless it is about validation issues that are now fixed
    const isAllUnfixed = Object.values(isUnfixed).every(val => val);
    const showApiError = hasServerSideValidationErrors ? !allInputsValid || isAllUnfixed : true;

    return (
      <Screen
        scrollComponent={SafeAreaView}
        secondary
        keyboard
        header={translate("signup.title")}
        subtext={translate("signup.subtext")}
      >
        <InputLabel title={translate("signup.firstName")} required />

        <ValidatedTextInput
          autoFocus={!AUTOFILL_FORM}
          key="first-name-input"
          ref="first-name-input"
          placeholder={translate("signup.firstName")}
          editable={!isInProgress}
          valid={isFirstNameValid}
          value={form.firstName}
          message={Validation.firstName.errorString(form.firstName, apiValidation)}
          onChangeText={this._updateFormField.bind(this, "firstName")}
          onBlur={this._trimFormField.bind(this, "firstName")}
          onSubmitEditing={() => {
            this.refs["last-name-input"].focus();
          }}
          returnKeyType="next"
          style={styles.validatedTextInput}
          {...textInputProps.firstName}
        />

        <InputLabel title={translate("signup.lastName")} required />

        <ValidatedTextInput
          key="last-name-input"
          ref="last-name-input"
          placeholder={translate("signup.lastName")}
          editable={!isInProgress}
          valid={isLastNameValid}
          value={form.lastName}
          message={Validation.lastName.errorString(form.lastName, apiValidation)}
          onChangeText={this._updateFormField.bind(this, "lastName")}
          onBlur={this._trimFormField.bind(this, "lastName")}
          onSubmitEditing={() => {
            this.refs["phone-input"].focus();
          }}
          returnKeyType="next"
          style={styles.validatedTextInput}
          {...textInputProps.lastName}
        />

        <InputLabel title={translate("signup.phoneNumber")} required />

        <ValidatedTextInput
          key="phone-input"
          ref="phone-input"
          placeholder={translate("signup.phoneNumber")}
          editable={!isInProgress}
          valid={isPhoneNumberValid}
          value={form.phoneNumber}
          message={Validation.mobileNumber.errorString(form.phoneNumber, apiValidation)}
          onChangeText={this._updateFormField.bind(this, "phoneNumber")}
          onBlur={this._trimFormField.bind(this, "phoneNumber")}
          onSubmitEditing={() => {
            this.refs["job-title-input"].focus();
          }}
          returnKeyType="done"
          style={styles.validatedTextInput}
          {...textInputProps.mobileNumber}
        />

        <InputLabel title={translate("signup.jobRole")} required />

        <ValidatedTextInput
          key="job-title-input"
          ref="job-title-input"
          placeholder={translate("signup.jobRole")}
          editable={!isInProgress}
          valid={isJobTitleValid}
          value={form.jobTitle}
          message={Validation.jobTitle.errorString(form.jobTitle, apiValidation)}
          onChangeText={this._updateFormField.bind(this, "jobTitle")}
          onBlur={this._trimFormField.bind(this, "jobTitle")}
          onSubmitEditing={() => {
            this.refs["email-input"].focus();
          }}
          returnKeyType="next"
          style={styles.validatedTextInput}
          textContentType={"none"}
          {...textInputProps.jobTitle}
        />

        <InputLabel title={translate("signup.emailAddress")} required />

        <ValidatedTextInput
          key="email-input"
          ref="email-input"
          placeholder={translate("signup.emailAddress")}
          editable={this.props.email === undefined}
          valid={isEmailValid}
          value={form.email}
          message={Validation.email.errorString(form.email, apiValidation)}
          onChangeText={this._updateFormField.bind(this, "email")}
          onBlur={this._trimFormField.bind(this, "email")}
          onSubmitEditing={() => {
            this.refs["password1-input"].focus();
          }}
          returnKeyType="next"
          style={styles.validatedTextInput}
          {...textInputProps.email}
        />

        <InputLabel title={translate("signup.password")} required />

        <ValidatedTextInput
          key="password1-input"
          ref="password1-input"
          placeholder={translate("signup.password")}
          editable={!isInProgress}
          valid={isPasswordValid}
          value={form.password}
          message={Validation.password.errorString(form.password, apiValidation)}
          onChangeText={this._updateFormField.bind(this, "password")}
          onBlur={this._trimFormField.bind(this, "password")}
          onSubmitEditing={() => {
            this.refs["password2-input"].focus();
          }}
          returnKeyType="next"
          style={styles.validatedTextInput}
          textContentType={"newPassword"}
          {...textInputProps.password}
        />

        <InputLabel title={translate("signup.repeatPassword")} required />

        <ValidatedTextInput
          key="password2-input"
          ref="password2-input"
          placeholder={translate("signup.repeatPassword")}
          editable={!isInProgress}
          valid={passwordsMatch}
          returnKeyType="go"
          value={form.verifiedPassword}
          message={passwordsMatch ? "" : translate("errors.repeat_password.REPEAT")}
          onChangeText={this._updateFormField.bind(this, "verifiedPassword")}
          onBlur={this._trimFormField.bind(this, "verifiedPassword")}
          style={styles.validatedTextInput}
          textContentType={"newPassword"}
          {...textInputProps.password}
        />

        <Text style={[Styles.Text.bodyTiny, Styles.Text.emphasis]}>{translate("signup.termsDescription")}</Text>

        <Checkbox
          style={styles.checkboxOverride}
          isSelected={this.state.hasAcceptedTerms ?? false}
          onPress={this._updateTermsCheckboxState}
          checkboxLabel={translate("mobile.signup.agreeTerms")}
        />

        <Touchable onPress={this.openPrivacyPolicy} accessibilityRole={"button"}>
          <Text style={styles.footerLinks}>{translate("mobile.signup.viewPrivacy")}</Text>
        </Touchable>

        <Touchable onPress={this.openTerms} accessibilityRole={"button"}>
          <Text style={styles.footerLinks}>{translate("mobile.signup.viewTerms")}</Text>
        </Touchable>

        <Checkbox
          style={styles.checkboxOverride}
          isSelected={this.state.hasAgreedConsent ?? false}
          onPress={this._updateConsentCheckboxState}
          checkboxLabel={translate("signup.agreeConsent")}
        />

        <View style={styles.divider} />

        {isInProgress && <LoadingIndicator />}
        <Error error={showApiError ? apiError : null} />

        <Button
          style={Styles.Buttons.centeredPrimaryButton}
          disabledStyle={Styles.Buttons.centeredPrimaryButtonDisabled}
          enabled={canSubmit}
          onPress={this._onSignUpPressed}
          title={translate("signup.title")}
        />
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  validatedTextInput: {
    ...Styles.textInput,
    marginBottom: Styles.Layout.Margins.small
  },
  footerLinks: {
    color: Styles.Colours.brownGrey,
    fontWeight: "700",
    paddingVertical: Styles.Layout.Margins.small
  },
  divider: {
    borderBottomColor: Styles.Colours.boldShadow,
    borderBottomWidth: 1,
    paddingBottom: Styles.Layout.Margins.small
  },
  checkboxOverride: {
    borderBottomWidth: 0
  }
});
