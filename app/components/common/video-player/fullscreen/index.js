//@flow

import React, { Component } from "react";
import { BackHandler, StyleSheet } from "react-native";
import VideoPlayer, { type VideoState, type VideoType } from "../index";
import colours from "../../../../styles/colours";
import { Navigation } from "react-native-navigation";

type Props = {|
  /**
   * Automatically sent by RNN if mounted in a navigation stack
   */
  +componentId: string,
  video: number | VideoType,
  initialVideoState?: VideoState,
  onFinished?: VideoState => any
|};

export default class VideoFullScreen extends Component<Props> {
  static options(passProps: {}) {
    return {
      statusBar: {
        visible: false,
        drawBehind: true
      },
      topBar: {
        drawBehind: true,
        visible: false
      },
      layout: {
        orientation: ["landscape"],
        backgroundColor: colours.black
      }
    };
  }
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.minimizeVideo);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.minimizeVideo);
  }

  minimizeVideo = () => {
    if (this.props.initialVideoState && this.props.initialVideoState.isFullScreen) {
      if (this.props.onFinished) {
        this.props.onFinished({ ...this.props.initialVideoState, isFullScreen: false });
      }
      Navigation.pop(this.props.componentId);
      return true;
    } else {
      return false;
    }
  };

  render() {
    return (
      <VideoPlayer
        componentId={this.props.componentId}
        video={this.props.video}
        style={styles.video}
        initialVideoState={this.props.initialVideoState}
        onFinished={item => this.props.onFinished(item)}
      />
    );
  }
}

const styles = StyleSheet.create({
  video: {
    height: "100%",
    width: "100%"
  }
});
