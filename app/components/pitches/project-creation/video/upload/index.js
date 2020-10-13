// @flow

import type { File } from "../../../../../utils/models.types";
import React, { Component } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import Styles from "../../../../../styles";
import { Navigation } from "react-native-navigation";
import ProjectFlowScreen from "../../screen";
import MediaPickerView from "../../../../common/media-picker-view";
import Error from "../../../../common/error";
import translate from "../../../../../locales";
import { withSafeArea } from "react-native-safe-area";
import type { ProjectFormProps } from "../../../../../screens/projectForms";
import Validation from "../../../../../utils/validation";
import colours from "../../../../../styles/colours";
import InputLabel from "../../../../common/forms/input-label";
import VideoPlayer from "../../../../common/video-player";
import Button from "../../../../common/button";
import Layout from "../../../../../styles/layout";
import { projectCreationNavigation, projectCreationNavigationEvents } from "../../../../../utils/navigation";
import LoadingIndicator from "../../../../common/loading-indicator";
import { compressVideo } from "../../../../../utils/copyExternalFileToAppCache";
import { screens } from "../../../../../screens";

const playIcon = require("../../../../../assets/video/play-icon.png");

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
   * A function that when invoked stores the user's preferred file to use as the pitch video
   */
  +updateVideo: (?File) => void,

  /**
   * The data being displayed in the form
   */
  +videoFile: ?File
|};

type State = {|
  processingVideo: boolean
|};

const SafeAreaView = withSafeArea(ScrollView, "padding", "bottom");
export default class PitchUploadVideoScreen extends Component<Props, State> {
  static options(passProps: { formMetadata: ProjectFormProps }) {
    return {
      ...projectCreationNavigation(passProps.formMetadata)
    };
  }

  constructor(props: Props) {
    super(props);
    Navigation.events().bindComponent(this);
    this.state = { processingVideo: false };
  }

  componentDidDisappear() {
    this.videoPlayer?.pauseVideo?.();
  }

  navigationButtonPressed(event: any) {
    projectCreationNavigationEvents(event.buttonId, this.props.formMetadata);
  }

  _previousStep = () => {
    Navigation.pop(this.props.componentId);
  };

  _nextStep = () => {
    Navigation.push(this.props.componentId, {
      component: {
        ...screens.PROJECTS_REVIEW_SCREEN,
        passProps: {
          formMetadata: this.props.formMetadata
        }
      }
    });
  };

  removeVideo = () => {
    this.videoPlayer?.pauseVideo?.();
    this.confirmDeleteVideo();
  };

  confirmDeleteVideo = () => {
    Alert.alert(translate("createPitch.video.remove.title"), translate("createPitch.video.remove.subtext"), [
      {
        text: translate("common.yes"),
        onPress: () => {
          this.props.updateVideo(null);
        }
      },
      {
        text: translate("common.cancel"),
        style: "cancel"
      }
    ]);
  };

  async updateFile(file: ?File) {
    this.setState({ processingVideo: true });
    const compressedVideo = await compressVideo(file?.uri ?? "");
    let copiedFile = file;
    if (compressedVideo) {
      copiedFile = {
        size: file?.size ?? null,
        name: file?.name ?? "video",
        type: file?.type ?? "video/mp4",
        uri: compressedVideo
      };
    }
    this.props.updateVideo(copiedFile);
    this.props.formMetadata.syncDraft();
    this.setState({ processingVideo: false });
  }

  renderLoadingMessage() {
    return (
      <>
        <LoadingIndicator size={"large"} />
        <Text style={styles.processingVideo}>{translate("createPitch.video.processing")}</Text>
      </>
    );
  }

  render() {
    const isVideoValid = Validation.organisationAvatar.validate(this.props.videoFile);
    const uploadVideoText = translate("signup.createOrganisation.uploadLogo", "Upload Video");

    return (
      <ProjectFlowScreen
        componentId={this.props.componentId}
        formMetadata={this.props.formMetadata}
        scrollComponent={SafeAreaView}
        secondary
        header={translate("createPitch.video.upload.title")}
        subtext={translate("createPitch.video.upload.subtext")}
        isNextButtonEnabled={isVideoValid}
        onPreviousButtonPressed={this._previousStep}
        onNextButtonPressed={this._nextStep}
      >
        <View style={styles.uploadContainer}>
          <InputLabel title={translate("createPitch.video.upload.uploadVideo")} />
          <Text style={Styles.Text.h7}>{translate("createPitch.video.upload.hint")}</Text>
          {!this.props.videoFile && (
            <MediaPickerView
              style={styles.uploadLogoView}
              iconStyle={styles.cloudUploadLogoIcon}
              textStyle={[Styles.Text.bodyHero, styles.uploadLogoText]}
              fileTypeFilter={"video"}
              onMediaSelected={file => {
                this.updateFile(file);
              }}
              selectedFile={this.props.videoFile}
              uploadText={uploadVideoText}
            />
          )}
        </View>
        {this.props.videoFile && !isVideoValid && (
          <Error error={Validation.organisationVideo.errorString(this.props.videoFile)} />
        )}
        {this.state.processingVideo && this.renderLoadingMessage()}
        {this.props.videoFile && (
          <View>
            <VideoPlayer
              componentId={this.props.componentId}
              video={{ uri: this.props.videoFile.uri }}
              ref={component => {
                this.videoPlayer = component;
              }}
              style={styles.video}
              thumbnailPlayIcon={playIcon}
            />
            <Button
              style={styles.remove}
              onPress={this.removeVideo}
              title={translate("createPitch.video.upload.remove")}
            />
          </View>
        )}
      </ProjectFlowScreen>
    );
  }
}

const styles = StyleSheet.create({
  uploadContainer: {
    marginTop: 10
  },
  uploadLogoView: {
    backgroundColor: colours.lightGrey,
    flexDirection: "row",
    aspectRatio: 16 / 9,
    justifyContent: "center",
    alignItems: "center"
  },
  uploadLogoText: {
    color: colours.white,
    textAlign: "center"
  },
  cloudUploadLogoIcon: {
    height: 28,
    resizeMode: "contain",
    width: 28,
    alignItems: "flex-end",
    tintColor: colours.white
  },
  remove: {
    backgroundColor: colours.red,
    color: colours.white,
    alignSelf: "stretch",
    borderRadius: Layout.BorderRadius.small,
    borderWidth: 0,
    paddingHorizontal: Layout.Margins.large,
    minHeight: 40,
    textTransform: "uppercase",
    marginTop: 10
  },
  video: { aspectRatio: 16 / 9 },
  processingVideo: {
    color: colours.primary,
    marginTop: Layout.Margins.small,
    alignSelf: "center"
  }
});
