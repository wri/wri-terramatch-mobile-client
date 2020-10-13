//@flow
import React, { Component } from "react";
import { Platform, View } from "react-native";
import MediaControls, { PLAYER_STATES } from "react-native-media-controls";
import Video from "react-native-video";
import { Navigation } from "react-native-navigation";
import { screens } from "../../../screens";
import colours from "../../../styles/colours";
import VideoThumbnail from "./thumbnail";
import translate from "../../../locales";

type Props = {
  componentId: string,
  video: number | VideoType,
  showControl?: boolean,
  style: any,
  initialVideoState?: VideoState,
  onFinished?: VideoState => any,
  thumbnailText?: string,
  thumbnailTextStyle?: any,
  thumbnailPlayIcon?: number,
  thumbnailPlayIconStyle?: string,
  thumbnail?: number,
  thumbnailStyle?: string
};

const videoInitTime = 0.1; //We forward the video by 0.1 seconds to make sure the video has a poster/thumbnail

export type VideoType = {|
  uri: string
|};

export type VideoState = {|
  currentTime: number,
  duration: number,
  isFullScreen: boolean,
  isLoading: boolean,
  paused: boolean,
  playerState: PLAYER_STATES
|};

class VideoPlayer extends Component<Props, VideoState> {
  videoPlayer: Video;
  constructor(props: Props) {
    super(props);

    if (this.props.initialVideoState) {
      this.state = this.props.initialVideoState;
    } else {
      this.state = {
        currentTime: videoInitTime,
        duration: 0,
        isFullScreen: false,
        isLoading: false,
        paused: true,
        playerState: PLAYER_STATES.PAUSED
      };
    }
  }

  onSeek = (seek: any) => {
    this.videoPlayer.seek(seek);
  };

  onPaused = (playerState: PLAYER_STATES) => {
    this.setState(prevState => ({
      paused: !prevState.paused,
      playerState
    }));
  };

  onPlaybackRateChange = (data: any) => {
    const { playbackRate } = data;
    const { paused } = this.state;
    if (!paused && playbackRate === 0) {
      this.setState({
        paused: true,
        playerState: PLAYER_STATES.PAUSED
      });
    } else if (paused && playbackRate !== 0) {
      this.setState({
        paused: false,
        playerState: PLAYER_STATES.PLAYING
      });
    }
  };

  onReplay = () => {
    this.setState({
      currentTime: videoInitTime,
      paused: true,
      playerState: PLAYER_STATES.PAUSED
    });
    this.videoPlayer.seek(videoInitTime);
  };

  onProgress = (data: any) => {
    const { isLoading, playerState } = this.state;
    // Video Player will continue progress even if the video already ended
    if (!isLoading && playerState !== PLAYER_STATES.ENDED) {
      this.setState({ currentTime: data.currentTime });
    }
  };

  onLoad = (data: any) => {
    this.setState({ duration: data.duration, isLoading: false });
    this.videoPlayer.seek(this.state.currentTime);
  };

  onLoadStart = (data: any) => {
    this.setState({ isLoading: true });
  };

  onEnd = () => {
    this.setState({ paused: true, playerState: PLAYER_STATES.ENDED });
  };

  onError = () => {
    alert(translate("common.videoError"));
  };

  onFullScreen = () => {
    if (this.state.isFullScreen) {
      if (this.props.onFinished) {
        this.props.onFinished({ ...this.state, isFullScreen: false });
      }
      Navigation.pop(this.props.componentId);
    } else {
      Navigation.push(this.props.componentId, {
        component: {
          ...screens.FULL_VIDEO_SCREEN,
          passProps: {
            video: this.props.video,
            componentId: this.props.componentId,
            initialVideoState: { ...this.state, isFullScreen: true },
            onFinished: state => {
              this.setState(state);
            }
          }
        }
      });
    }
  };

  pauseVideo = () => {
    this.setState({
      paused: true,
      playerState: PLAYER_STATES.PAUSED
    });
  };

  playVideo = () => {
    this.setState({
      currentTime: videoInitTime,
      paused: false,
      playerState: PLAYER_STATES.PLAYING
    });
  };

  onSeeking = (currentTime: number) => {
    this.setState({ currentTime });
  };

  displayThumbnail = (): boolean => {
    return (
      this.state.paused &&
      this.state.currentTime === videoInitTime &&
      (this.props.thumbnailText || this.props.thumbnail || this.props.thumbnailPlayIcon)
    );
  };

  render() {
    return (
      <View>
        <Video
          onEnd={this.onEnd}
          onLoad={this.onLoad}
          onLoadStart={this.onLoadStart}
          onProgress={this.onProgress}
          onPlaybackRateChange={this.onPlaybackRateChange}
          paused={this.state.paused}
          fullscreenOrientation="landscape"
          ref={videoPlayer => (this.videoPlayer = videoPlayer)}
          resizeMode={"contain"}
          source={this.props.video}
          controls={Platform.OS !== "android"}
          style={[this.props.style, { backgroundColor: colours.black }]}
        />
        {Platform.OS === "android" && !this.displayThumbnail() && this.props.showControl !== false && (
          <MediaControls
            duration={this.state.duration}
            isLoading={this.state.isLoading}
            mainColor={colours.semiTransparentBlack}
            onFullScreen={this.onFullScreen}
            onPaused={this.onPaused}
            onReplay={this.onReplay}
            onSeek={this.onSeek}
            onSeeking={this.onSeeking}
            playerState={this.state.playerState}
            progress={this.state.currentTime}
          />
        )}
        {Platform.OS === "android" && this.displayThumbnail() && (
          <VideoThumbnail
            playIcon={this.props.thumbnailPlayIcon}
            playIconStyle={this.props.thumbnailPlayIconStyle}
            thumbnail={this.props.thumbnail}
            thumbnailStyle={this.props.thumbnailStyle}
            text={this.props.thumbnailText}
            textStyle={this.props.thumbnailTextStyle}
            onPress={this.playVideo}
          />
        )}
      </View>
    );
  }
}

export default VideoPlayer;
