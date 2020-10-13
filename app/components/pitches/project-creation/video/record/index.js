// @flow

import AudioSession from "react-native-audio-session";
import React, { Component } from "react";
import { StyleSheet, Text, View, Platform, BackHandler } from "react-native";
import Styles from "../../../../../styles";
import { Navigation } from "react-native-navigation";
import ProjectFlowScreen from "../../screen";
import translate from "../../../../../locales";
import type { ProjectFormProps } from "../../../../../screens/projectForms";
import colours from "../../../../../styles/colours";
// eslint-disable-next-line import/default
import ImagePicker from "react-native-image-picker";
import Layout from "../../../../../styles/layout";
import type { File } from "../../../../../utils/models.types";
import { screens } from "../../../../../screens";
import type { OfferUploadTypes } from "../../../../../redux/wri-api/offers/actions";
import type { PitchUploadTypes } from "../../../../../redux/wri-api/pitches/actions";
import VideoPlayer from "../../../../common/video-player";
import { projectCreationNavigation, projectCreationNavigationEvents } from "../../../../../utils/navigation";
import LoadingIndicator from "../../../../common/loading-indicator";
import copyExternalFileToAppCache, { compressVideo } from "../../../../../utils/copyExternalFileToAppCache";
const playIcon = require("../../../../../assets/video/play-icon.png");

type Props = {|
  /**
   * Automatically sent by RNN if mounted in a navigation stack
   */
  +componentId: string,
  +formMetadata: ProjectFormProps,
  +video: OfferUploadTypes | PitchUploadTypes,
  /**
   * A function that when invoked stores the user's preferred file to use as the pitch video introduction
   */
  +updateVideo: File => void
|};

type State = {|
  processingVideo: boolean
|};
export default class PitchPatchVideoScreen extends Component<Props, State> {
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
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this._previousStep);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this._previousStep);
  }

  componentDidDisappear() {
    this.videoPlayer?.pauseVideo?.();
  }

  navigationButtonPressed(event: any) {
    projectCreationNavigationEvents(event.buttonId, this.props.formMetadata, true);
  }

  _previousStep = () => {
    Navigation.pop(this.props.componentId);
    return true;
  };

  _nextStep = () => {
    this.videoPlayer?.pauseVideo?.();
    const videoPickerOptions = {
      mediaType: "video",
      cameraType: "back",
      noData: true,
      durationLimit: 30,
      videoQuality: Platform.select({
        android: "high",
        ios: "medium"
      }),
      storageOptions: {
        skipBackup: true,
        allowsEditing: true,
        waitUntilSaved: true
      },
      permissionDenied: {
        title: "Camera and Storage permission needed",
        text: "We need you to give camera and storage permissions so we can let you upload photos.",
        reTryTitle: "Okay",
        okTitle: "Cancel"
      }
    };
    // Open Image Library:
    ImagePicker.launchCamera(videoPickerOptions, async response => {
      this.setState({ processingVideo: true });

      // Fire and forget, if the user has recorded a video the system sets the audio category
      // to one which ignores the mute switch! We need to undo this work...
      if (Platform.OS === "ios") {
        // SoloAmbient is the default AVAudioSession category
        AudioSession.setCategory("SoloAmbient");
      }

      if (response.uri) {
        const compressedUri = await compressVideo(response.path ?? response.uri);

        let file = {
          name: "video.mp4",
          size: null,
          type: null,
          uri: compressedUri
        };

        file = await copyExternalFileToAppCache(file);

        this.props.updateVideo(file);
        Navigation.push(this.props.componentId, {
          component: {
            ...screens.PROJECTS_VIDEO_RECORD_REVIEW,
            passProps: {
              formMetadata: this.props.formMetadata,
              video: this.props.video
            }
          }
        });
      }
      this.setState({ processingVideo: false });
    });
  };

  getVideoUrl = (): number => {
    switch (this.props.video) {
      case "videoIntroduction":
        return require("../../../../../assets/video/videoIntroduction.mp4");
      case "videoGoals":
        return require("../../../../../assets/video/videoGoals.mp4");
      case "videoSignificance":
        return require("../../../../../assets/video/videoSignificance.mp4");
      default:
        return require("../../../../../assets/video/wri_demo.mp4");
    }
  };

  renderLoadingMessage() {
    return (
      <>
        <LoadingIndicator size={"large"} />
        <Text style={styles.processingVideo}>{translate("createPitch.video.processing")}</Text>
      </>
    );
  }

  render() {
    return (
      <ProjectFlowScreen
        componentId={this.props.componentId}
        formMetadata={this.props.formMetadata}
        style={styles.screen}
        nextTitle={translate("createPitch.video.record.record")}
        isNextButtonEnabled={!this.state.processingVideo}
        onPreviousButtonPressed={this._previousStep}
        onNextButtonPressed={this._nextStep}
      >
        <View style={styles.titleContainer}>
          <VideoPlayer
            componentId={this.props.componentId}
            video={this.getVideoUrl()}
            ref={component => {
              this.videoPlayer = component;
            }}
            style={styles.video}
            thumbnailText={translate("common.exampleVideo")}
            thumbnailPlayIcon={playIcon}
          />
        </View>
        <View>
          <Text style={Styles.Text.videoHeader}>{translate(`createPitch.video.record.${this.props.video}.step`)}</Text>
          <Text style={Styles.Text.videoSubtitle}>
            {translate(`createPitch.video.record.${this.props.video}.subtext`)}
          </Text>
          {this.state.processingVideo && this.renderLoadingMessage()}
          <View style={styles.yellowDivider} />
          <Text style={Styles.Text.videoHintHeader}>{translate("common.hint")}</Text>
          <Text style={Styles.Text.videoHintSubtitle}>
            {translate(`createPitch.video.record.${this.props.video}.hints`)}
          </Text>
        </View>
      </ProjectFlowScreen>
    );
  }
}

const styles = StyleSheet.create({
  screen: { margin: 0, padding: 0, backgroundColor: colours.white },
  video: {
    aspectRatio: 16 / 9
  },
  yellowDivider: {
    height: 4,
    backgroundColor: colours.primary,
    marginTop: Layout.Margins.medium,
    marginBottom: Layout.Margins.medium
  },
  titleContainer: {
    aspectRatio: 16 / 9,
    backgroundColor: colours.primary,
    justifyContent: "center",
    paddingBottom: 4
  },
  processingVideo: {
    color: colours.primary,
    marginTop: Layout.Margins.small,
    alignSelf: "center"
  }
});
