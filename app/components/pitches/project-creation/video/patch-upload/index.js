// @flow

import React, { Component } from "react";
import { Alert, BackHandler, Image, StyleSheet, Text, View } from "react-native";
import Styles from "../../../../../styles";
import { Navigation } from "react-native-navigation";
import ProjectFlowScreen from "../../screen";
import translate from "../../../../../locales";
import type { ProjectFormProps } from "../../../../../screens/projectForms";
import colours from "../../../../../styles/colours";
import VideoPlayer from "../../../../common/video-player";
import LoadingIndicator from "../../../../common/loading-indicator";
import { screens } from "../../../../../screens";
import type { PitchRegistrationForm } from "../../../../../redux/wri-api/pitches";
import { ElevatorVideoRead } from "wri-api";
import { ElevatorStatus } from "../../../../../utils/models.types";
import { projectCreationNavigation, projectCreationNavigationEvents } from "../../../../../utils/navigation";
import NetInfo from "@react-native-community/netinfo";
import CONNECTIVITY_ICON from "../../../../../assets/icons/projects/video/connectivity.png";
import Button from "../../../../common/button";

type Props = {|
  /**
   * Automatically sent by RNN if mounted in a navigation stack
   */
  +componentId: string,
  +formMetadata: ProjectFormProps,
  +form: PitchRegistrationForm,
  +uploadVideos: PitchRegistrationForm => Promise<ElevatorVideoRead>,
  +uploadFinished: number => Promise<ElevatorVideoRead>,
  +fallbackComponentId: string
|};
type Error = "connectivity" | "server" | "time-out";
type State = {|
  isWaiting: boolean,
  error: ?Error
|};

export default class PitchPatchVideoUploadScreen extends Component<Props, State> {
  static options(passProps: { formMetadata: ProjectFormProps }) {
    return {
      ...projectCreationNavigation(passProps.formMetadata)
    };
  }

  constructor(props: Props) {
    super(props);
    Navigation.events().bindComponent(this);
    this.state = {
      isWaiting: true,
      error: null
    };
  }

  navigationButtonPressed(event: any) {
    projectCreationNavigationEvents(event.buttonId, this.props.formMetadata, true);
  }

  componentDidDisappear() {
    this.videoPlayer?.pauseVideo?.();
  }

  componentDidMount(): void {
    BackHandler.addEventListener("hardwareBackPress", this.confirmDeleteVideo);

    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        this.setState({
          isWaiting: false,
          error: "connectivity"
        });
        return false;
      } else {
        this.uploadVideos();
        return true;
      }
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.confirmDeleteVideo);
  }

  uploadVideos = async () => {
    try {
      this.setState({
        isWaiting: true,
        error: null
      });
      const response = await this.props.uploadVideos(this.props.form);
      if (response.id) {
        while (this.state.isWaiting) {
          await new Promise(resolve => setTimeout(resolve, 10000)); // wait ten secs
          await this.uploadFinished(response.id);
        }
      } else {
        this.setState({ isWaiting: false, error: "server" });
      }
    } catch (e) {
      this.setState({ isWaiting: false, error: "server" });
    }
  };

  confirmDeleteVideo = () => {
    Alert.alert(
      translate("createPitch.video.record.cancel.title"),
      translate("createPitch.video.record.cancel.subtext"),
      [
        {
          text: translate("common.yes"),
          onPress: () => {
            this.setState({ isWaiting: false });
            Navigation.pop(this.props.componentId);
          }
        },
        {
          text: translate("common.cancel"),
          style: "cancel"
        }
      ]
    );
    return true;
  };

  uploadFinished = async (id: number) => {
    const response = await this.props.uploadFinished(id);
    if (this.state.isWaiting) {
      if (response.status === ElevatorStatus.FINISHED) {
        this.setState({ isWaiting: false });
        Navigation.push(this.props.componentId, {
          component: {
            ...screens.PROJECTS_VIDEO_REVIEW_SCREEN,
            passProps: {
              formMetadata: this.props.formMetadata,
              video: response,
              fallbackComponentId: this.props.fallbackComponentId
            }
          }
        });
      } else if (response.status === ElevatorStatus.ERRORED) {
        this.setState({ isWaiting: false, error: "server" });
      } else if (response.status === ElevatorStatus.TIMEOUT) {
        this.setState({ isWaiting: false, error: "time-out" });
      }
    }
  };

  getContentByError = (): [string, string] => {
    switch (this.state.error) {
      case "connectivity": {
        return [translate("createPitch.video.connectivity.title"), translate("createPitch.video.connectivity.subtext")];
      }
      case "server": {
        return [translate("createPitch.video.error.title"), translate("createPitch.video.error.subtext")];
      }
      case "time-out":
        return [translate("createPitch.video.error.title"), translate("createPitch.video.timeOut")];

      default: {
        return ["", ""];
      }
    }
  };

  renderError() {
    const [title, subtext] = this.getContentByError();
    return (
      <>
        <View style={styles.overlay}>
          <Image style={styles.center} source={CONNECTIVITY_ICON} resizeMode={"contain"} />
        </View>
        <Text style={Styles.Text.videoHeader}>{title}</Text>
        <Text style={Styles.Text.videoSubtitle}>{subtext}</Text>
        <Button
          style={[Styles.Buttons.primary, styles.button]}
          onPress={this.uploadVideos}
          title={translate("common.retry")}
        />
      </>
    );
  }

  renderUploading() {
    return (
      <>
        <View style={styles.overlay}>
          {this.state.isWaiting && <LoadingIndicator style={styles.progressBar} size={"large"} />}
        </View>
        <Text style={Styles.Text.videoHeader}>{translate("createPitch.video.patch.title")}</Text>
        <Text style={Styles.Text.videoSubtitle}>{translate("createPitch.video.patch.subtext")}</Text>
      </>
    );
  }

  render() {
    return (
      <ProjectFlowScreen
        componentId={this.props.componentId}
        formMetadata={this.props.formMetadata}
        style={styles.screen}
        isNextButtonEnabled={!this.state.isWaiting}
        onPreviousButtonPressed={this.confirmDeleteVideo}
        onNextButtonPressed={this.props.formMetadata.pushNextScreen.bind(this, this.props.componentId)}
      >
        <View style={styles.titleContainer}>
          {this.props.form.uploads.videoIntroduction && (
            <VideoPlayer
              componentId={this.props.componentId}
              ref={component => {
                this.videoPlayer = component;
              }}
              showControl={false}
              video={{ uri: this.props.form.uploads.videoIntroduction.uri }}
              style={styles.video}
            />
          )}
        </View>
        {!this.state.isWaiting && this.state.error && this.renderError()}
        {this.state.error === null && this.renderUploading()}
      </ProjectFlowScreen>
    );
  }
}

const styles = StyleSheet.create({
  screen: { margin: 0, padding: 0, backgroundColor: colours.white },
  titleContainer: {
    aspectRatio: 16 / 9,
    backgroundColor: colours.primary,
    justifyContent: "center",
    paddingBottom: 4
  },
  overlay: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: colours.shadow,
    position: "absolute",
    marginVertical: -2,
    justifyContent: "center"
  },
  progressBar: {
    transform: [{ scale: 2.5 }]
  },
  center: { justifyContent: "center", alignSelf: "center" },
  video: { aspectRatio: 16 / 9 },
  button: { marginTop: 40, alignSelf: "center", justifyContent: "center", width: "70%" }
});
