// @flow

import React, { Component } from "react";
import { Alert, BackHandler, StyleSheet, Text, View } from "react-native";
import Styles from "../../../../../styles";
import { Navigation } from "react-native-navigation";
import ProjectFlowScreen from "../../screen";
import translate from "../../../../../locales";
import type { ProjectFormProps } from "../../../../../screens/projectForms";
import colours from "../../../../../styles/colours";
import VideoPlayer from "../../../../common/video-player";
import { ElevatorVideoRead } from "wri-api";
import type { File } from "../../../../../utils/models.types";
import { projectCreationNavigation, projectCreationNavigationEvents } from "../../../../../utils/navigation";
import { screens } from "../../../../../screens";

const playIcon = require("../../../../../assets/video/play-icon.png");

type Props = {|
  /**
   * Automatically sent by RNN if mounted in a navigation stack
   */
  +componentId: string,
  +formMetadata: ProjectFormProps,
  +video: ?ElevatorVideoRead,
  +updateVideo: (?File, ?number) => void,
  +fallbackComponentId: string
|};

export default class PitchVideoReviewScreen extends Component<Props> {
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
    projectCreationNavigationEvents(event.buttonId, this.props.formMetadata, true);
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.confirmDeleteVideo);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.confirmDeleteVideo);
  }

  confirmDeleteVideo = () => {
    Alert.alert(
      translate("createPitch.video.record.cancel.title"),
      translate("createPitch.video.record.cancel.subtext"),
      [
        {
          text: translate("common.yes"),
          onPress: () => {
            this.props.updateVideo(null);
            Navigation.popTo(this.props.fallbackComponentId);
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

  _nextStep = () => {
    const file = {
      uri: this.props.video?.preview ?? "",
      name: "video.mp4",
      type: "video/mp4",
      size: null,
      uploadId: this.props.video?.upload_id
    };
    this.props.updateVideo(file);
    Navigation.push(this.props.componentId, {
      component: {
        ...screens.PROJECTS_REVIEW_SCREEN,
        passProps: {
          formMetadata: this.props.formMetadata
        }
      }
    });
  };

  render() {
    return (
      <ProjectFlowScreen
        componentId={this.props.componentId}
        formMetadata={this.props.formMetadata}
        style={styles.screen}
        isNextButtonEnabled={true}
        onPreviousButtonPressed={this.confirmDeleteVideo}
        onNextButtonPressed={this._nextStep}
      >
        <View style={styles.titleContainer}>
          {this.props.video && (
            <VideoPlayer
              componentId={this.props.componentId}
              video={{ uri: this.props.video.preview ?? "" }}
              style={styles.video}
              thumbnailPlayIcon={playIcon}
            />
          )}
        </View>
        <View>
          <Text style={Styles.Text.videoHeader}>{translate("createPitch.video.review.title")}</Text>
          <Text style={Styles.Text.videoSubtitle}>{translate("createPitch.video.review.subtext")}</Text>
          <Text style={Styles.Text.videoWarning}>{translate("createPitch.video.review.warning")}</Text>
        </View>
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
  video: { aspectRatio: 16 / 9 }
});
