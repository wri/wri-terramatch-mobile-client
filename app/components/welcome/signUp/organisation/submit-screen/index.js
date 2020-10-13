// @flow

import type { AsyncState } from "../../../../../redux/redux.types";
import React, { Component, type ElementConfig, type ElementRef } from "react";
import { Keyboard, StyleSheet } from "react-native";
import { OrganisationVersionRead } from "wri-api";
import translate from "../../../../../locales/";
import Screen from "../../../../common/screen";
import Styles from "../../../../../styles";
import LoadingIndicator from "../../../../common/loading-indicator";
import Button from "../../../../common/button";
import Error from "../../../../common/error";
import { logAddProjectEvent } from "../../../../../utils/analytics";
import { errorCodes, errorDomains } from "../../../../../constants/errorMessaging";

type Props = {|
  ...ElementConfig<typeof Screen>,

  createOrganisationState: AsyncState<OrganisationVersionRead>,
  errorStyle?: any,
  onPreSubmit?: () => void,
  onPostSubmit?: () => void,

  submitForm: () => Promise<void>,

  submitFormWhenNextPressed: boolean
|};

type State = {|
  hasSubmitted: boolean,
  isInProgress: boolean
|};

/**
 * Screen wrapper to turn any form into one where the submission step will upload the organisation details to the server
 */
export default class OrganisationSubmitScreenWrapper extends Component<Props, State> {
  screenRef: { current: null | ElementRef<typeof Screen> };

  constructor(props: Props) {
    super(props);
    this.state = {
      hasSubmitted: false,
      isInProgress: false
    };

    this.screenRef = React.createRef();
  }

  _submit = async () => {
    Keyboard.dismiss();

    // Scroll to the top to show the progress indicator...
    if (this.screenRef.current && this.props.submitFormWhenNextPressed) {
      this.screenRef.current.scrollToTop();
    }

    try {
      if (this.props.onPreSubmit) {
        this.props.onPreSubmit();
      }

      if (this.props.submitFormWhenNextPressed) {
        logAddProjectEvent("submit");
        this.setState({
          hasSubmitted: true,
          isInProgress: true
        });
        await this.props.submitForm();
      }

      if (this.props.onPostSubmit) {
        this.props.onPostSubmit();
      }
    } catch (err) {
      // Scroll to the top to show the error bar, if an error occurs
      if (this.screenRef.current && this.props.submitFormWhenNextPressed) {
        this.screenRef.current.scrollToTop();
      }
    } finally {
      this.setState({
        isInProgress: false
      });
    }
  };

  render() {
    const {
      createOrganisationState,
      errorStyle = {},
      isNextButtonEnabled = true,
      onPreSubmit, // eslint-disable-line no-unused-vars
      onPostSubmit,
      submitForm, // eslint-disable-line no-unused-vars
      submitFormWhenNextPressed,
      ...rest
    } = this.props;
    const isFetching = this.state.isInProgress;
    const nextTitle = isFetching
      ? translate("common.saving")
      : this.state.hasSubmitted
      ? translate("common.retry")
      : translate("common.submit");
    return (
      <Screen
        ref={this.screenRef}
        isNextButtonEnabled={isNextButtonEnabled && !isFetching}
        onNextButtonPressed={this._submit}
        nextTitle={nextTitle}
        {...rest}
      >
        {submitFormWhenNextPressed && (
          <>
            {isFetching && <LoadingIndicator />}
            {this.state.hasSubmitted && !isFetching && !!createOrganisationState.error && (
              <Error
                style={[styles.error, errorStyle]}
                textStyle={styles.errorText}
                error={createOrganisationState.error}
                errorMessagingOverrides={{
                  [errorDomains.NETWORKING]: {
                    [errorCodes.NETWORKING_DISCONNECTED]: () =>
                      translate("mobile.createOrganisation.review.network_error"),
                    [errorCodes.NETWORKING_TIMEOUT]: () => translate("mobile.createOrganisation.review.network_error")
                  }
                }}
              >
                {createOrganisationState.error?.code === errorCodes.WRI_COMPLETED_WITH_ERRORS && (
                  <Button
                    style={[Styles.Buttons.centeredSecondaryButton, styles.errorButton]}
                    onPress={onPostSubmit}
                    title={translate("mobile.common.continue_anyway")}
                  />
                )}
              </Error>
            )}
          </>
        )}
        {this.props.children}
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  error: {
    backgroundColor: Styles.Colours.red,
    marginHorizontal: -Styles.Layout.Margins.medium,
    padding: Styles.Layout.Margins.medium
  },
  errorText: {
    color: "white"
  },
  errorButton: {
    marginTop: Styles.Layout.Margins.small
  }
});
