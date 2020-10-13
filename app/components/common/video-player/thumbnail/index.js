//@flow
import React, { Component } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import colours from "../../../../styles/colours";
import Touchable from "../../touchable";

type Props = {|
  playIcon?: any,
  text?: string,
  thumbnail?: any,
  playIconStyle?: any,
  thumbnailStyle?: any,
  textStyle?: any,
  onPress: any
|};
class VideoThumbnail extends Component<Props> {
  render() {
    return (
      <View style={styles.overlay}>
        <Touchable accessibilityRole="button" onPress={this.props.onPress} style={styles.centralized}>
          <Image style={[styles.thumbnailStyle, this.props.thumbnailStyle]} source={this.props.thumbnail} />
          <View style={styles.container}>
            <Image style={[styles.playIconStyle, this.props.playIconStyle]} source={this.props.playIcon} />
            {this.props.text && <Text style={[styles.textStyle, this.props.textStyle]}>{this.props.text}</Text>}
          </View>
        </Touchable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  thumbnailStyle: {
    width: "100%",
    height: "100%",
    backgroundColor: colours.semiTransparentBlack
  },
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    backgroundColor: colours.shadow,
    zIndex: 2
  },
  container: {
    position: "absolute",
    width: "100%",
    height: "100%",
    alignSelf: "center",
    justifyContent: "center"
  },
  playIconStyle: {
    height: 60,
    width: 60,
    alignSelf: "center"
  },
  textStyle: {
    color: colours.white,
    textAlign: "center",
    fontSize: 20,
    lineHeight: 25,
    marginTop: 20
  },
  centralized: { justifyContent: "center", alignItems: "center" }
});

export default VideoThumbnail;
