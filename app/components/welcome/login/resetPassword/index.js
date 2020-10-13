// @flow

import { AuthReset, Empty } from "wri-api";
import React, { Component } from "react";
import { StyleSheet, ScrollView, Alert } from "react-native";
import { withSafeArea } from "react-native-safe-area";
import Styles from "../../../../styles";
import Button from "../../../common/button";
import Screen from "../../../common/screen";
import InputLabel from "../../../common/forms/input-label";
import ValidatedTextInput from "../../../common/validated-input";
import Validation from "../../../../utils/validation";
import textInputProps from "../../../../constants/textInputProps";
import translate from "../../../../locales";
import Error from "../../../common/error";
import LoadingIndicator from "../../../common/loading-indicator";
import { Navigation } from "react-native-navigation";
import { screens } from "../../../../screens";
import type { AsyncState } from "../../../../redux/redux.types";

const SafeAreaView = withSafeArea(ScrollView, "padding", "bottom");

type Props = {|
  +resetPasswordState: AsyncState<Empty>,

  /**
   * Automatically sent by RNN if mounted in a navigation stack
   */
  +componentId: string,

  /**
   * A function, that when called, makes a request to sign up the user.
   */
  +onResetPressed: AuthReset => Promise<any>
|};

type State = {|
  /**
   * The email to reset password
   */
  +email: string,
  hasSubmitted: boolean
|};

export default class ResetPasswordScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      email: "",
      hasSubmitted: false
    };
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    // Check for when the reset password call transitions from fetching to success and then prompt to check e-mail
    if (
      prevProps.resetPasswordState.isFetching &&
      !this.props.resetPasswordState.isFetching &&
      this.props.resetPasswordState.error === null
    ) {
      Alert.alert(
        translate("reset.reset"),
        translate("reset.resetSuccess"),
        [{ text: "OK", onPress: () => this._returnToMain() }],
        { cancelable: false }
      );
    }
  }

  _returnToMain() {
    Navigation.push(this.props.componentId, {
      component: {
        ...screens.WELCOME_SCREEN
      }
    });
  }

  /**
   * Handle the submit button being pressed.
   *
   * This is designed to only be able to occur when the inputted data is valid.
   */
  onSubmitPressed = () => {
    this.setState({ hasSubmitted: true });
    this.props.onResetPressed(
      AuthReset.constructFromObject({
        email_address: this.state.email
      })
    );
  };

  render() {
    const isEmailValid = Validation.email.validate(this.state.email);
    const isInProgress = this.state.hasSubmitted && this.props.resetPasswordState.isFetching;
    const apiError =
      this.state.hasSubmitted && !this.props.resetPasswordState.isFetching ? this.props.resetPasswordState.error : null;
    const apiValidation = apiError?.data;
    const hasServerSideValidationErrors = (apiValidation?.errors?.length ?? 0) > 0;
    return (
      <Screen
        style={styles.screen}
        scrollComponent={SafeAreaView}
        secondary
        keyboard
        header={translate("reset.reset")}
        subtext={translate("mobile.reset.hint", "Enter the email you signed up with")}
      >
        <InputLabel title={translate("signup.emailAddress")} required />
        <ValidatedTextInput
          style={styles.validatedTextInput}
          editable={!isInProgress}
          message={Validation.email.errorString(this.state.email)}
          onChangeText={text => this.setState({ email: text.trim() })}
          onSubmitEditing={isEmailValid ? this.onSubmitPressed : null}
          returnKeyType="done"
          valid={isEmailValid}
          value={this.state.email}
          {...textInputProps.email}
        />

        {isInProgress && <LoadingIndicator />}
        <Error error={hasServerSideValidationErrors ? apiError : null} />

        <Button
          style={Styles.Buttons.centeredPrimaryButton}
          disabledStyle={Styles.Buttons.centeredPrimaryButtonDisabled}
          enabled={isEmailValid && !isInProgress}
          onPress={this.onSubmitPressed}
          title={translate("reset.reset")}
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
  }
});
