// @flow

import React, { Component } from "react";
import { Alert, StyleSheet, Text, View, BackHandler } from "react-native";
import Styles from "../../../../../styles";
import { Navigation } from "react-native-navigation";
import ProjectFlowScreen from "../../screen";
import translate from "../../../../../locales";
import type { ProjectFormProps } from "../../../../../screens/projectForms";
import colours from "../../../../../styles/colours";
import Layout from "../../../../../styles/layout";
import type { File } from "../../../../../utils/models.types";
import VideoPlayer from "../../../../common/video-player";
import { screens } from "../../../../../screens";
import type { OfferUploadTypes } from "../../../../../redux/wri-api/offers/actions";
import type { PitchUploadTypes } from "../../../../../redux/wri-api/pitches/actions";
import { projectCreationNavigation, projectCreationNavigationEvents } from "../../../../../utils/navigation";

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
  +videoRecorded: ?File
|};

export default class PitchPatchVideoReviewScreen extends Component<Props> {
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

  componentDidDisappear() {
    this.videoPlayer?.pauseVideo?.();
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
          text: translate("common.confirm"),
          onPress: () => {
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

  _nextStep = () => {
    const nextScreen = this.getRecordVideoScreen(this.props.video);
    if (nextScreen) {
      Navigation.push(this.props.componentId, {
        component: {
          ...screens.PROJECTS_VIDEO_RECORD,
          passProps: {
            formMetadata: this.props.formMetadata,
            video: nextScreen
          }
        }
      });
    } else {
      Navigation.push(this.props.componentId, {
        component: {
          ...screens.PROJECTS_PATCH_UPLOAD_SCREEN,
          passProps: {
            formMetadata: this.props.formMetadata,
            fallbackComponentId: this.props.componentId
          }
        }
      });
    }
  };

  getRecordVideoScreen = (attribute: PitchUploadTypes | OfferUploadTypes): ?string => {
    const flow = ["videoIntroduction", "videoGoals", "videoSignificance", null];
    const index = flow.findIndex(it => it === attribute);
    return flow[index + 1];
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
          {this.props.videoRecorded && (
            <VideoPlayer
              componentId={this.props.componentId}
              video={{ uri: this.props.videoRecorded.uri }}
              ref={component => {
                this.videoPlayer = component;
              }}
              style={styles.video}
              thumbnailPlayIcon={playIcon}
            />
          )}
        </View>
        <View>
          <Text style={Styles.Text.videoHeader}>{translate(`createPitch.video.record.${this.props.video}.step`)}</Text>
          <Text style={Styles.Text.videoSubtitle}>{translate("common.retake")}</Text>
          <View style={styles.yellowDivider} />
          <Text style={Styles.Text.videoHintHeader}>{translate("common.reminder")}</Text>
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
  titleContainer: {
    aspectRatio: 16 / 9,
    backgroundColor: colours.primary,
    justifyContent: "center",
    paddingBottom: 4
  },
  yellowDivider: {
    height: 4,
    backgroundColor: colours.primary,
    marginTop: Layout.Margins.medium,
    marginBottom: Layout.Margins.medium
  },
  video: { aspectRatio: 16 / 9 }
});
