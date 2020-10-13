// @flow

import type { File, PendingFile, PendingFileList } from "../../../../utils/models.types";
import type { ProjectFormProps } from "../../../../screens/projectForms";
import React, { Component } from "react";
import { ScrollView } from "react-native";
import { Navigation } from "react-native-navigation";
import ProjectFlowScreen from "../screen";
import InputLabel from "../../../common/forms/input-label/";
import FilePickerView from "../../../common/file-picker-view";
import translate from "../../../../locales";
import { withSafeArea } from "react-native-safe-area";
import Validation from "../../../../utils/validation";
import { projectCreationNavigation, projectCreationNavigationEvents } from "../../../../utils/navigation";

type Props = {|
  /**
   * Automatically sent by RNN if mounted in a navigation stack
   */
  +componentId: string,

  /**
   * The ID of the project form that is being modified
   */
  +formMetadata: ProjectFormProps,
  /**
   * Adds a list of pending uploads. These will be uploaded at the end of the pitch creation process.
   */
  +addDocumentUpload: File => void,
  +removeDocumentUpload: PendingFile => void,
  /**
   * A list of files the user has chosen to upload
   */
  +documentUpload: PendingFileList
|};

const SafeAreaView = withSafeArea(ScrollView, "padding", "bottom");
const documentIcon = require("../../../../assets/icons/profile/document.png");

export default class PitchDocumentsScreen extends Component<Props> {
  static options(passProps: { formMetadata: ProjectFormProps }) {
    return {
      ...projectCreationNavigation(passProps.formMetadata)
    };
  }

  constructor(props: Props) {
    super(props);
    Navigation.events().bindComponent(this);
  }

  navigationButtonPressed(event: any) {
    projectCreationNavigationEvents(event.buttonId, this.props.formMetadata);
  }

  _handleDocumentsSelected = (file: File) => {
    this.props.addDocumentUpload(file);
    this.props.formMetadata.syncDraft();
  };

  removeItem = (file: PendingFile) => {
    this.props.removeDocumentUpload(file);
    this.props.formMetadata.syncDraft();
  };

  render() {
    const atLeastOneDocumentAdded = Validation.pitchDocuments.validate(this.props.documentUpload);
    const projectTypeKey = this.props.formMetadata.type === "offer" ? "createOffer" : "createPitch";

    return (
      <ProjectFlowScreen
        componentId={this.props.componentId}
        formMetadata={this.props.formMetadata}
        scrollComponent={SafeAreaView}
        header={translate(`${projectTypeKey}.details.addDocumentsTitle`)}
        subtext={translate(`${projectTypeKey}.details.addDocumentsSubtext`)}
        isNextButtonEnabled={atLeastOneDocumentAdded}
      >
        <InputLabel title={translate(`${projectTypeKey}.details.addDocumentsTitle`)} />
        <FilePickerView
          fileTypeFilter={["pdf"]}
          onDocumentSelected={this._handleDocumentsSelected}
          selectedFiles={this.props.documentUpload}
          removeFile={this.removeItem}
          icon={documentIcon}
        />
      </ProjectFlowScreen>
    );
  }
}
