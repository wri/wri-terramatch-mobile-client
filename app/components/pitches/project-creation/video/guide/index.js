// @flow

import React, { Component } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Styles from "../../../../../styles";
import { Navigation } from "react-native-navigation";
import ProjectFlowScreen from "../../screen";
import translate from "../../../../../locales";
import { withSafeArea } from "react-native-safe-area";
import type { ProjectFormProps } from "../../../../../screens/projectForms";
import { screens } from "../../../../../screens";
import Video from "react-native-video";
import VideoPlayer from "../../../../common/video-player";
import { projectCreationNavigation, projectCreationNavigationEvents } from "../../../../../utils/navigation";

const SafeAreaView = withSafeArea(ScrollView, "padding", "bottom");
const ExampleVideo = require("../../../../../assets/video/wri_demo.mp4"); // todo: update with correct video
const playIcon = require("../../../../../assets/video/play-icon.png");

type Props = {|
  /**
   * Automatically sent by RNN if mounted in a navigation stack
   */
  +componentId: string,
  +formMetadata: ProjectFormProps
|};

export default class PitchGuideVideoElevatorScreen extends Component<Props> {
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
    Navigation.push(this.props.componentId, {
      component: {
        ...screens.PROJECTS_VIDEO_RECORD,
        passProps: {
          formMetadata: this.props.formMetadata,
          video: "videoIntroduction"
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

  render() {
    return (
      <ProjectFlowScreen
        componentId={this.props.componentId}
        formMetadata={this.props.formMetadata}
        scrollComponent={SafeAreaView}
        secondary
        header={translate("createPitch.video.guide.title")}
        subtext={translate("createPitch.video.guide.subtext")}
        isNextButtonEnabled={true}
        onPreviousButtonPressed={this._previousStep}
        onNextButtonPressed={this._nextStep}
        nextTitle={translate("common.next")}
      >
        <View>
          <Text style={[Styles.Text.videoHeader, styles.negativeMargin]}>
            {translate("createPitch.video.guide.header")}
          </Text>
          <Text style={Styles.Text.videoSubtitle}>{translate("createPitch.video.guide.steps")}</Text>
          <Text style={Styles.Text.videoHeader}>{translate("createPitch.video.guide.tipsHeader")}</Text>
          <Text style={Styles.Text.videoSubtitle}>{translate("createPitch.video.guide.tipsBody")}</Text>
          <Text style={[Styles.Text.videoHeader, styles.negativeMargin]}>
            {translate("createPitch.video.guide.videoHeader")}
          </Text>
          <View style={styles.uploadContainer}>
            <VideoPlayer
              componentId={this.props.componentId}
              video={ExampleVideo}
              ref={component => {
                this.videoPlayer = component;
              }}
              style={styles.video}
              thumbnailText={translate("common.exampleVideo")}
              thumbnailPlayIcon={playIcon}
            />
          </View>
        </View>
      </ProjectFlowScreen>
    );
  }
}

const styles = StyleSheet.create({
  uploadContainer: {
    margin: 20
  },
  negativeMargin: { marginTop: -5 },
  video: { aspectRatio: 16 / 9 }
});
