// @flow

import type { File, PendingFile, PendingFileList } from "../../../../utils/models.types";

import React, { Component } from "react";
import { ScrollView } from "react-native";
import { withSafeArea } from "react-native-safe-area";
import { Navigation } from "react-native-navigation";
import { screens } from "../../../../screens/";
import InputLabel from "../../../common/forms/input-label/";
import translate from "../../../../locales/";
import Screen from "../../../common/screen";
import FilePickerView from "../../../common/file-picker-view";
import { logAddAwardEvent } from "../../../../utils/analytics";
import { organisationCreationNavigation } from "../../../../utils/navigation";

const NAV_BAR_BUTTON_ID_HOME = "nav_bar_btn_home";

const awardIcon = require("../../../../assets/icons/profile/award.png");

const SafeAreaView = withSafeArea(ScrollView, "padding", "bottom");

type Props = {|
  /**
   * Adds a list of pending award uploads. These will be uploaded at the end of the organisation creation process.
   */
  +addAwardUpload: File => void,

  +removeAwardUpload: PendingFile => void,

  /**
   * A list of award files the user has chosen to upload
   */
  +awardUploads: PendingFileList,

  /**
   * Automatically sent by RNN if mounted in a navigation stack
   */
  +componentId: string,

  +isEdit: boolean
|};

type State = {|
  +awardName: string
|};

export default class OrganisationAwardsScreen extends Component<Props, State> {
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

  _startOrganisationDescription = () => {
    Navigation.push(this.props.componentId, {
      component: {
        ...screens.SIGNUP_ORGANISATION_LISTTEAMMEMBER,
        passProps: {
          isEdit: this.props.isEdit ? true : false
        }
      }
    });
  };

  _previousStep = () => {
    Navigation.pop(this.props.componentId);
  };

  _handleAwardFilesSelected = (file: File) => {
    logAddAwardEvent("clickedOnAddAward");
    this.props.addAwardUpload(file);
  };

  removeItem = (file: PendingFile) => {
    this.props.removeAwardUpload(file);
  };

  render() {
    return (
      <Screen
        scrollComponent={SafeAreaView}
        secondary
        keyboard
        header={translate("addDocumentAwards.details.awardsTitle")}
        subtext={translate("addDocumentAwards.details.awardsSubtext")}
        isNextButtonEnabled={true}
        onPreviousButtonPressed={this._previousStep}
        onNextButtonPressed={this._startOrganisationDescription}
      >
        <InputLabel title={translate("addDocumentAwards.details.uploadAwards")} />

        <FilePickerView
          fileTypeFilter={["pdf", "images"]}
          onDocumentSelected={this._handleAwardFilesSelected}
          selectedFiles={this.props.awardUploads}
          removeFile={this.removeItem}
          icon={awardIcon}
          fileName={translate("addDocumentAwards.details.awardsName")}
          buttonText={translate("addDocumentAwards.details.addAward")}
        />
      </Screen>
    );
  }
}
