// @flow

import type { File } from "../../../../utils/models.types";
import React, { Component } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Styles from "../../../../styles";
import { Navigation } from "react-native-navigation";
import ProjectFlowScreen from "../screen";
import MediaPickerView from "../../../common/media-picker-view";
import Error from "../../../common/error";
import translate from "../../../../locales";
import { withSafeArea } from "react-native-safe-area";
import type { ProjectFormProps } from "../../../../screens/projectForms";
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
   * A function that when invoked stores the user's preferred file to use as the pitch cover photo
   */
  +updateCoverPhoto: File => void,

  /**
   * The data being displayed in the form
   */
  +coverPhotoFile: ?File
|};

const SafeAreaView = withSafeArea(ScrollView, "padding", "bottom");

export default class PitchUploadScreen extends Component<Props> {
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

  render() {
    const isCoverPhotoValid = Validation.organisationCoverPhoto.validate(this.props.coverPhotoFile);
    const uploadCoverText = translate("common.upload");

    return (
      <ProjectFlowScreen
        componentId={this.props.componentId}
        formMetadata={this.props.formMetadata}
        scrollComponent={SafeAreaView}
        header={translate("createPitch.details.media")}
        subtext={translate("createPitch.details.mediaHelp")}
        isNextButtonEnabled={isCoverPhotoValid}
      >
        <View style={styles.uploadContainer}>
          <MediaPickerView
            style={styles.uploadCoverView}
            iconStyle={styles.cloudUploadCoverIcon}
            textStyle={styles.uploadCoverText}
            fileTypeFilter={"photo"}
            onMediaSelected={file => {
              this.props.updateCoverPhoto(file);
              this.props.formMetadata.syncDraft();
            }}
            selectedFile={this.props.coverPhotoFile}
            uploadText={uploadCoverText}
          />
        </View>
        {this.props.coverPhotoFile && !isCoverPhotoValid && (
          <Error error={Validation.organisationCoverPhoto.errorString(this.props.coverPhotoFile)} />
        )}
      </ProjectFlowScreen>
    );
  }
}

const styles = StyleSheet.create({
  uploadContainer: {
    marginTop: 50,
    paddingBottom: 50,
    marginHorizontal: -Styles.Layout.Margins.medium
  },
  uploadCoverView: {
    backgroundColor: "#333333",
    width: "100%",
    flexDirection: "row",
    height: 170,
    justifyContent: "center",
    alignItems: "center"
  },
  uploadCoverText: {
    color: "#ffffff",
    textAlign: "center"
  },
  cloudUploadCoverIcon: {
    height: 28,
    resizeMode: "contain",
    width: 28,
    alignItems: "flex-end",
    marginRight: 10,
    tintColor: "#ffffff"
  }
});
