// @flow

import type { File, PendingFileList, PendingFile } from "../../../../utils/models.types";

import React, { Component } from "react";
import { View } from "react-native";
import { Navigation } from "react-native-navigation";

import Styles from "../../../../styles";
import { screens } from "../../../../screens/";
import InputLabel from "../../../common/forms/input-label/";
import translate from "../../../../locales/";
import Screen from "../../../common/screen";
import FilePickerView from "../../../common/file-picker-view";
import Validation from "../../../../utils/validation";
import { organisationCreationNavigation } from "../../../../utils/navigation";

const NAV_BAR_BUTTON_ID_HOME = "nav_bar_btn_home";

const documentIcon = require("../../../../assets/icons/profile/document.png");

type Props = {|
  /**
   * Adds a list of pending uploads. These will be uploaded at the end of the organisation creation process.
   */
  +addDocumentUpload: File => void,
  +removeDocumentUpload: (file: PendingFile) => void,

  /**
   * Automatically sent by RNN if mounted in a navigation stack
   */
  +componentId: string,

  /**
   * A list of video files the user has chosen to upload
   */
  +documentUpload: PendingFileList,

  +isEdit: boolean
|};

export default class OrganisationDocumentsScreen extends Component<Props> {
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
    switch (event.buttonId) {
      case NAV_BAR_BUTTON_ID_HOME: {
        Navigation.popToRoot(this.props.componentId);
        break;
      }
    }
  }

  _handleDocumentsSelected = (file: File) => {
    this.props.addDocumentUpload(file);
  };

  removeItem = (file: PendingFile) => {
    this.props.removeDocumentUpload(file);
  };

  _previousStep = () => {
    Navigation.pop(this.props.componentId);
  };

  _startOrganisationAwards = () => {
    Navigation.push(this.props.componentId, {
      component: {
        ...screens.SIGNUP_ORGANISATION_AWARDS,
        passProps: {
          isEdit: this.props.isEdit ? true : false
        }
      }
    });
  };

  render() {
    const atLeastOneDocumentAdded = Validation.organsationDocuments.validate(this.props.documentUpload);

    return (
      <Screen
        secondary
        keyboard
        header={translate("addDocumentAwards.details.title", "Organisation Documents ")}
        subtext={translate("addDocumentAwards.details.subtext")}
        isNextButtonEnabled={atLeastOneDocumentAdded}
        onPreviousButtonPressed={this._previousStep}
        onNextButtonPressed={this._startOrganisationAwards}
      >
        <InputLabel title={translate("addDocumentAwards.details.uploadDocuments")} required />

        <FilePickerView
          fileTypeFilter={["pdf"]}
          onDocumentSelected={this._handleDocumentsSelected}
          selectedFiles={this.props.documentUpload}
          removeFile={this.removeItem}
          icon={documentIcon}
        />

        <View style={Styles.Utilities.flexGrow} />
      </Screen>
    );
  }
}
