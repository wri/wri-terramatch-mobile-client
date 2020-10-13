// @flow

import type { File } from "../../../../utils/models.types";

import React, { Component } from "react";
import { StyleSheet, ScrollView, Text } from "react-native";
import { Navigation } from "react-native-navigation";
import { withSafeArea } from "react-native-safe-area";
import { OrganisationCreate } from "wri-api";

import Styles from "../../../../styles";
import { screens } from "../../../../screens/";
import InputLabel from "../../../common/forms/input-label/";
import ValidatedTextInput from "../../../common/validated-input";
import translate from "../../../../locales/";
import Screen from "../../../common/screen";
import Validation from "../../../../utils/validation";
import textInputProps from "../../../../constants/textInputProps";
import MediaPickerView from "../../../common/media-picker-view";
import Error from "../../../common/error";
import { organisationCreationNavigation } from "../../../../utils/navigation";

const NAV_BAR_BUTTON_ID_HOME = "nav_bar_btn_home";
const ALLOW_VIDEO_SELECTION = false;

const SafeAreaView = withSafeArea(ScrollView, "padding", "bottom");

type Props = {|
  /**
   * Adds a list of pending uploads. These will be uploaded at the end of the organisation creation process.
   */
  +addVideoUpload: File => void,

  /**
   * Automatically sent by RNN if mounted in a navigation stack
   */
  +componentId: string,

  /**
   * Optional property that if present indicates the initial values that should be displayed in the form
   */
  +form: $Shape<OrganisationCreate>,

  +isEdit: boolean,

  /**
   * Updates the saved form so that it can be resumed
   */
  +updateSavedForm: ($Shape<OrganisationCreate>) => void,

  /**
   * A list of video files the user has chosen to upload
   */
  +videoUpload: ?File
|};

export default class OrganisationDescriptionScreen extends Component<Props> {
  static options(passProps: Props) {
    return {
      ...organisationCreationNavigation(passProps.isEdit)
    };
  }

  constructor(props: Props) {
    super(props);
    Navigation.events().bindComponent(this);
  }

  navigationButtonPressed(event: any) {
    if (event.buttonId === NAV_BAR_BUTTON_ID_HOME) {
      {
        Navigation.popToRoot(this.props.componentId);
      }
    }
  }

  _handleVideosSelected = (file: File) => {
    this.props.addVideoUpload(file);
  };

  _previousStep = () => {
    Navigation.pop(this.props.componentId);
  };

  _startOrganisationAwards = () => {
    Navigation.push(this.props.componentId, {
      component: {
        ...screens.SIGNUP_ORGANISATION_DOCUMENTS,
        passProps: {
          isEdit: this.props.isEdit ? true : false
        }
      }
    });
  };

  _updateFormField = (fieldName: $Keys<OrganisationCreate>, text: string) => {
    this.props.updateSavedForm({
      [fieldName]: text
    });
  };

  render() {
    const isDescriptionValid = Validation.organisationDescription.validate(this.props.form.description ?? "");
    const isVideoValid = !ALLOW_VIDEO_SELECTION || Validation.organisationVideo.validate(this.props.videoUpload);
    const allInputsValid = isDescriptionValid && isVideoValid;

    return (
      <Screen
        scrollComponent={SafeAreaView}
        secondary
        keyboard
        header={translate("createOrganisation.description.title")}
        subtext={translate("createOrganisation.description.subtext")}
        isNextButtonEnabled={allInputsValid}
        onPreviousButtonPressed={this._previousStep}
        onNextButtonPressed={this._startOrganisationAwards}
      >
        <InputLabel title={translate("createOrganisation.description.description")} required />

        <ValidatedTextInput
          key="organisation-description-input"
          ref="organisation-description-input"
          placeholder={translate("createOrganisation.description.description")}
          valid={isDescriptionValid}
          value={this.props.form.description}
          message={Validation.organisationDescription.errorString(this.props.form.description ?? "")}
          onChangeText={this._updateFormField.bind(this, "description")}
          onSubmitEditing={allInputsValid ? this._startOrganisationAwards : null}
          returnKeyType={"next"}
          style={styles.inputText}
          {...textInputProps.organisationDescription}
        />

        {ALLOW_VIDEO_SELECTION && (
          <>
            <InputLabel title={translate("mobile.description.uploadTitle", "Upload Media")} required />
            <Text style={[Styles.Text.bodyHero, { marginTop: Styles.Layout.Margins.tiny }]}>
              {translate("mobile.description.uploadTitle.uploadDescription", "i.e. A video about your organisation")}
            </Text>

            <MediaPickerView
              fileTypeFilter={"video"}
              onMediaSelected={this._handleVideosSelected}
              selectedFile={this.props.videoUpload}
            />
          </>
        )}
        {this.props.videoUpload && !isVideoValid && (
          <Error error={Validation.organisationVideo.errorString(this.props.videoUpload)} />
        )}
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  inputText: {
    height: 172,
    borderColor: Styles.Colours.border,
    borderWidth: 1,
    borderRadius: Styles.Layout.BorderRadius.small
  }
});
