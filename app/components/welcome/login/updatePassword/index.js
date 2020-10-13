// @flow

import { AuthChange, Empty } from "wri-api";
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
  /**
   * Automatically sent by RNN if mounted in a navigation stack
   */
  +componentId: string,

  /**
   * A function, that when called, makes a request to sign up the user.
   */
  +onUpdatePasswordPressed: AuthChange => Promise<any>,

  +token: string,

  +updatePasswordState: AsyncState<Empty>
|};

type State = {|
  +password: string,
  +repeatPassword: string,
  +hasSubmitted: boolean
|};

export default class UpdatePasswordScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      password: "",
      repeatPassword: "",
      hasSubmitted: false
    };
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    // Check for when the reset password call transitions from fetching to success and then prompt to check e-mail
    if (
      prevProps.updatePasswordState.isFetching &&
      !this.props.updatePasswordState.isFetching &&
      this.props.updatePasswordState.error === null
    ) {
      Alert.alert(
        translate("reset.reset"),
        translate("reset.changeSuccess"),
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
    this.props.onUpdatePasswordPressed(
      AuthChange.constructFromObject({
        token: this.props.token,
        password: this.state.password
      })
    );
  };

  render() {
    const isPasswordValid = Validation.password.validate(this.state.password);
    const isRepeatPasswordValid = Validation.password.validate(this.state.repeatPassword);
    const passwordsMatch = this.state.password === this.state.repeatPassword;
    const isValidInput = isPasswordValid && isRepeatPasswordValid && passwordsMatch;
    const isInProgress = this.state.hasSubmitted && this.props.updatePasswordState.isFetching;
    const apiError =
      this.state.hasSubmitted && !this.props.updatePasswordState.isFetching
        ? this.props.updatePasswordState.error
        : null;
    const apiValidation = apiError?.data;
    const hasServerSideValidationErrors = (apiValidation?.errors?.length ?? 0) > 0;
    return (
      <Screen
        style={styles.screen}
        scrollComponent={SafeAreaView}
        secondary
        keyboard
        header={translate("reset.reset")}
        subtext={translate("reset.resetSubText")}
      >
        <InputLabel title={translate("reset.newPasswordLabel")} required />
        <ValidatedTextInput
          style={styles.validatedTextInput}
          editable={!isInProgress}
          message={Validation.password.errorString(this.state.password)}
          onChangeText={text => this.setState({ password: text.trim() })}
          returnKeyType="done"
          valid={isPasswordValid}
          value={this.state.password}
          {...textInputProps.password}
        />

        <InputLabel title={translate("signup.repeatPassword")} required />
        <ValidatedTextInput
          style={styles.validatedTextInput}
          editable={!isInProgress}
          message={passwordsMatch ? "" : translate("errors.repeat_password.REPEAT")}
          onChangeText={text => this.setState({ repeatPassword: text.trim() })}
          returnKeyType="done"
          valid={passwordsMatch}
          value={this.state.repeatPassword}
          {...textInputProps.password}
        />

        {isInProgress && <LoadingIndicator />}
        <Error error={hasServerSideValidationErrors ? apiError : null} />

        <Button
          style={Styles.Buttons.centeredPrimaryButton}
          disabledStyle={Styles.Buttons.centeredPrimaryButtonDisabled}
          enabled={isValidInput && !isInProgress}
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
