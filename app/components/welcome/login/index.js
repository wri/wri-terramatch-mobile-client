// @flow

import type { AsyncState } from "../../../redux/redux.types";
import { AuthLogIn, TokenRead } from "wri-api";
import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { withSafeArea } from "react-native-safe-area";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { screens } from "../../../screens";
import Styles from "../../../styles/";
import Button from "../../common/button";
import Screen from "../../common/screen";
import InputLabel from "../../common/forms/input-label/";
import ValidatedTextInput from "../../common/validated-input";
import Validation from "../../../utils/validation";
import textInputProps from "../../../constants/textInputProps";
import translate from "../../../locales/";
import LoadingIndicator from "../../common/loading-indicator";
import Error from "../../common/error";
import { logSignInEvent } from "../../../utils/analytics";
import { errorDomains, errorCodes } from "../../../constants/errorMessaging";
import { Navigation } from "react-native-navigation";

type Props = {|
  /**
   * Callback invoked when login has successfully completed
   */
  +completionCallback?: () => void,

  /**
   * Automatically sent by RNN if mounted in a navigation stack
   */
  +componentId: string,

  /**
   * An initial email address to populate the form with.
   *
   * If this prop is provided then the screen is assumed to be in a "re-auth" context.
   * In this situation the e-mail field is pre-populated.
   */
  +initialEmailAddress: ?string,

  /**
   * Whether or not the login screen is being displayed as a modal dialog
   */
  +isModal?: boolean,

  +loginState: AsyncState<TokenRead>,

  /**
   * A function, that when called, makes a request to sign up the user.
   */
  +onLoginPressed: (AuthLogIn, boolean) => Promise<any>
|};

type Form = {|
  +email: string,
  +password: string
|};

type State = {|
  /**
   * The form and its fields, as they are being entered by the user ready for submission
   */
  +form: Form,

  /**
   * Flag indicating whether or not the form has been submitted.
   */
  +hasSubmitted: boolean
|};

const SafeAreaView = withSafeArea(KeyboardAwareScrollView, "padding", "bottom");

export default class LoginScreen extends Component<Props, State> {
  static options(passProps: Props) {
    return {
      topBar: {
        title: {
          text: translate("login.login"),
          alignment: "fill"
        }
      }
    };
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      hasSubmitted: false,
      form: {
        email: props.initialEmailAddress ?? "",
        password: ""
      }
    };
  }

  _onResetPasswordPressed = () => {
    Navigation.push(this.props.componentId, {
      component: {
        ...screens.RESET_PASSWORD
      }
    });
  };

  _onSubmitPressed = async () => {
    // analytics
    logSignInEvent();
    await this.setState({
      hasSubmitted: true
    });

    //Check if the initial email is equal to the login email
    const isModified =
      this.props.initialEmailAddress !== undefined &&
      this.props.initialEmailAddress !== null &&
      this.props.initialEmailAddress !== this.state.form.email.trim();
    await this.props.onLoginPressed(
      AuthLogIn.constructFromObject({
        email_address: this.state.form.email.trim(),
        password: this.state.form.password.trim()
      }),
      isModified
    );
  };

  _trimFormField = (fieldName: $Keys<Form>) => {
    this.setState(previous => ({ form: { ...previous.form, [fieldName]: previous.form[fieldName].trim() } }));
  };

  _updateFormField = (fieldName: $Keys<Form>, text: string) => {
    this.setState(previous => ({ form: { ...previous.form, [fieldName]: text } }));
  };

  render() {
    const { form } = this.state;

    // Ignore any API error or fetching flag held in state until the form is submitted
    const isInProgress = this.state.hasSubmitted && this.props.loginState.isFetching;
    const apiError = this.state.hasSubmitted && !this.props.loginState.isFetching ? this.props.loginState.error : null;

    // Apply both local validation and server-side validation (in the form of API error messages) to the form fields
    const isEmailValid = Validation.email.validate(form.email, null);
    const isPasswordValid = Validation.passwordLogin.validate(form.password, null);
    const allInputsValid = isEmailValid && isPasswordValid;
    const canSubmit = allInputsValid && !isInProgress;

    return (
      <Screen
        style={styles.screen}
        scrollComponent={SafeAreaView}
        secondary
        keyboard
        header={translate("login.login")}
        subtext={translate("mobile.login.hint", "Enter the details you signed up with")}
        // set scrollReset to false to resolve issue with  keyboard-aware-scroll-view:
        // https://3sidedcube.atlassian.net/browse/WRM-1491
        // https://github.com/APSL/react-native-keyboard-aware-scroll-view/issues/313
        enableResetScrollToCoords={false}
      >
        <InputLabel title={translate("signup.emailAddress")} required />

        <ValidatedTextInput
          key="email-input"
          ref="email-input"
          placeholder={translate("signup.emailAddress")}
          editable={!isInProgress}
          valid={isEmailValid}
          value={form.email}
          message={Validation.email.errorString(form.email)}
          onChangeText={this._updateFormField.bind(this, "email")}
          onBlur={this._trimFormField.bind(this, "email")}
          onSubmitEditing={() => {
            this.refs["password-input"].focus();
          }}
          returnKeyType="next"
          style={styles.validatedTextInput}
          {...textInputProps.email}
          textContentType={"username"}
        />

        <InputLabel title={translate("signup.password")} required />

        <ValidatedTextInput
          key="password-input"
          ref="password-input"
          placeholder={translate("signup.password")}
          editable={!isInProgress}
          valid={isPasswordValid}
          value={form.password}
          message={Validation.passwordLogin.errorString(form.password)}
          onChangeText={this._updateFormField.bind(this, "password")}
          onBlur={this._trimFormField.bind(this, "password")}
          onSubmitEditing={canSubmit ? this._onSubmitPressed : null}
          returnKeyType="go"
          style={styles.validatedTextInput}
          textContentType={"password"}
          {...textInputProps.password}
        />

        <View style={Styles.Utilities.flexGrow}>
          {isInProgress && <LoadingIndicator />}
          <Error
            error={apiError}
            errorMessagingOverrides={{
              [errorDomains.API]: {
                [errorCodes.API_UNAUTHORIZED]: () => translate("login.errors.incorrectDetails")
              },
              [errorDomains.UNKNOWN]: {
                [errorCodes.UNKNOWN]: () => translate("login.errors.problem")
              }
            }}
          />
        </View>
        <Text style={styles.underline} onPress={this._onResetPasswordPressed}>
          {translate("reset.reset")}
        </Text>

        <Button
          style={Styles.Buttons.primary}
          disabledStyle={Styles.Buttons.primaryDisabled}
          enabled={canSubmit}
          onPress={this._onSubmitPressed}
          title={translate("login.login")}
        />
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    paddingBottom: Styles.Layout.Margins.large
  },
  validatedTextInput: {
    ...Styles.textInput,
    marginBottom: Styles.Layout.Margins.small
  },

  underline: { textDecorationLine: "underline", marginTop: 30, marginBottom: 60, fontSize: 10, textAlign: "center" }
});
