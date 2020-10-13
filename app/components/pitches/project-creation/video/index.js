// @flow

import React, { Component } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import Styles from "../../../../styles";
import { Navigation } from "react-native-navigation";
import ProjectFlowScreen from "../screen";
import translate from "../../../../locales";
import { withSafeArea } from "react-native-safe-area";
import type { ProjectFormProps } from "../../../../screens/projectForms";
import { screens } from "../../../../screens";
import Video from "react-native-video";
import VideoPlayer, { type VideoState } from "../../../common/video-player";
import Button from "../../../common/button";
import type { File } from "../../../../utils/models.types";
import colours from "../../../../styles/colours";
import { projectCreationNavigation, projectCreationNavigationEvents } from "../../../../utils/navigation";

const SafeAreaView = withSafeArea(ScrollView, "padding", "bottom");
const ExampleVideo = require("../../../../assets/video/wri_demo.mp4"); // todo: update with correct video
const playIcon = require("../../../../assets/video/play-icon.png");

type Props = {|
  /**
   * Automatically sent by RNN if mounted in a navigation stack
   */
  +componentId: string,
  +formMetadata: ProjectFormProps,
  +state?: ?VideoState,
  +projectVideo: ?File,
  /**
   * A function that when invoked stores the user's preferred file to use as the pitch video
   */
  +updateVideo: (?File) => void
|};
type State = {|
  videoOption: string
|};

const ButtonsOptions = Object.freeze({
  UPLOAD: "upload_video",
  RECORD: "record_video"
});

export default class PitchVideoElevatorScreen extends Component<Props, State> {
  videoPlayer: Video;
  static options(passProps: { formMetadata: ProjectFormProps }) {
    return {
      ...projectCreationNavigation(passProps.formMetadata)
    };
  }

  constructor(props: Props) {
    super(props);
    Navigation.events().bindComponent(this);
  }

  _previousStep = () => {
    Navigation.pop(this.props.componentId);
  };

  _nextStep = () => {
    this.props.formMetadata.pushNextScreen(this.props.componentId);
  };

  onUploadVideoPressed = () => {
    Navigation.push(this.props.componentId, {
      component: {
        ...screens.PROJECTS_VIDEO_UPLOAD,
        passProps: {
          formMetadata: { ...this.props.formMetadata, popBackScreen: this.props.componentId }
        }
      }
    });
  };

  onPatchVideoPressed = () => {
    Navigation.push(this.props.componentId, {
      component: {
        ...screens.PROJECTS_GUIDE_VIDEO_ELEVATOR_SCREEN,
        passProps: {
          formMetadata: { ...this.props.formMetadata, popBackScreen: this.props.componentId }
        }
      }
    });
  };

  componentDidDisappear() {
    this.videoPlayer?.pauseVideo?.();
  }

  navigationButtonPressed(event: any) {
    projectCreationNavigationEvents(event.buttonId, this.props.formMetadata);
  }

  confirmDeleteVideo = (option: any) => {
    Alert.alert(translate("createPitch.video.remove.title"), translate("createPitch.video.remove.subtext"), [
      {
        text: translate("common.confirm"),
        onPress: () => {
          if (option === ButtonsOptions.RECORD) {
            this.onPatchVideoPressed();
          } else {
            this.onUploadVideoPressed();
          }
          this.props.updateVideo(null);
        }
      },
      {
        text: translate("common.cancel"),
        style: "cancel"
      }
    ]);
  };

  renderEditScreen = () => {
    return (
      <ProjectFlowScreen
        componentId={this.props.componentId}
        formMetadata={this.props.formMetadata}
        scrollComponent={SafeAreaView}
        style={styles.screen}
        isNextButtonEnabled={true}
        onPreviousButtonPressed={this._previousStep}
        onNextButtonPressed={this._nextStep}
      >
        <View style={styles.titleContainer}>
          {this.props.projectVideo && (
            <VideoPlayer
              componentId={this.props.componentId}
              video={{ uri: this.props.projectVideo.uri }}
              ref={component => {
                this.videoPlayer = component;
              }}
              style={styles.video}
              thumbnailPlayIcon={playIcon}
            />
          )}
        </View>
        <View style={styles.uploadEditContainer}>
          <Text style={Styles.Text.videoHeader}>{translate("createPitch.video.edit.title")}</Text>
          <Text style={Styles.Text.videoSubtitle}>{translate("createPitch.video.edit.subtext")}</Text>
          <Button
            style={[Styles.Buttons.quinary, styles.buttons]}
            onPress={() => {
              this.confirmDeleteVideo(ButtonsOptions.UPLOAD);
            }}
            title={translate("createPitch.video.elevator.uploadNewVideo")}
          />
          <Button
            style={[Styles.Buttons.quinary, styles.buttons]}
            onPress={() => {
              this.confirmDeleteVideo(ButtonsOptions.RECORD);
            }}
            title={translate("createPitch.video.elevator.recordNewVideo")}
          />
        </View>
      </ProjectFlowScreen>
    );
  };

  renderAddVideo = () => {
    return (
      <ProjectFlowScreen
        componentId={this.props.componentId}
        formMetadata={this.props.formMetadata}
        scrollComponent={SafeAreaView}
        header={translate("createPitch.video.elevator.title")}
        subtext={translate("createPitch.video.elevator.subtext")}
        isNextButtonEnabled={true}
        onPreviousButtonPressed={this._previousStep}
        onNextButtonPressed={this._nextStep}
        nextTitle={translate("common.nextAndSkip")}
      >
        <View style={styles.uploadContainer}>
          <Button
            style={Styles.Buttons.primary}
            onPress={this.onUploadVideoPressed}
            title={translate("createPitch.video.elevator.uploadVideo")}
          />
          <Button
            style={[Styles.Buttons.primary, styles.buttons]}
            onPress={this.onPatchVideoPressed}
            title={translate("createPitch.video.elevator.recordVideo")}
          />
          <View style={styles.container}>
            <VideoPlayer
              componentId={this.props.componentId}
              video={ExampleVideo}
              ref={component => {
                this.videoPlayer = component;
              }}
              style={styles.video}
              state={this.props.state}
              thumbnailText={translate("common.exampleVideo")}
              thumbnailPlayIcon={playIcon}
            />
          </View>
        </View>
      </ProjectFlowScreen>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        {this.props.projectVideo && this.renderEditScreen()}
        {!this.props.projectVideo && this.renderAddVideo()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  uploadContainer: {
    margin: 20
  },
  container: {
    flex: 1
  },
  buttons: { marginTop: 20, marginBottom: 20 },
  video: { aspectRatio: 16 / 9 },
  screen: { margin: 0, padding: 0, backgroundColor: colours.white },
  titleContainer: {
    aspectRatio: 16 / 9,
    backgroundColor: colours.primary,
    justifyContent: "center",
    paddingBottom: 4
  },
  uploadEditContainer: {
    marginRight: 40,
    marginLeft: 40,
    marginTop: 20
  }
});
