// @flow

import type { File } from "../../../utils/models.types";
import React, { Component, type ElementProps } from "react";
import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";
// eslint-disable-next-line import/default
import ImagePicker from "react-native-image-picker";
import Styles from "../../../styles";
import Touchable from "../touchable";
import translate from "../../../locales";
import copyExternalFileToAppCache from "../../../utils/copyExternalFileToAppCache";

const uploadIcon = require("../../../assets/icons/organisation/upload-icon.png");

type Props = {|
  ...ElementProps<typeof View>,

  /**
   * File types to show in the picker
   */
  +fileTypeFilter: "photo" | "video" | "mixed",

  /**
   * Optional style to apply to the inner upload icon instead of the default style
   */
  +iconStyle?: any,

  /**
   * Callback invoked when the user has selected some documents
   */
  +onMediaSelected: File => void,

  /**
   * Files the user has already selected
   */
  +selectedFile: ?File,

  /**
   * Optional style to apply to the inner text instead of the default style
   */
  +textStyle?: any,

  /**
   * Optional text to display, instead of the default text
   */
  +uploadText?: string
|};

/**
 * View that allows the user to attach media from their local device intended for upload
 *
 * This view is not responsible for the upload itself, it simply manages passing file URIs to a container view for further
 * processing
 */
export default class MediaPickerView extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  _onPress = () => {
    const pickerOptions = {
      mediaType: this.props.fileTypeFilter,
      title: this.props.fileTypeFilter !== "video" ? "Upload media" : "Record video",
      takePhotoButtonTitle: "Open Camera",
      chooseFromLibraryButtonTitle: "Open Gallery",
      noData: true,
      maxHeight: 1024,
      maxWidth: 1024,
      rotation: this.props.fileTypeFilter !== "video" ? 360 : 0,
      durationLimit: this.props.fileTypeFilter === "video" ? 90 : 0,
      storageOptions: {
        skipBackup: false,
        path: "WRI_Organisation_Media"
      },
      permissionDenied: {
        title: "Camera and Storage permission needed",
        text: "We need you to give camera and storage permissions so we can let you upload photos and videos.",
        reTryTitle: "Okay",
        okTitle: "Cancel"
      }
    };

    if (this.props.fileTypeFilter !== "video") {
      ImagePicker.showImagePicker(pickerOptions, response => {
        this.saveFile(response);
      });
    } else {
      // Open Image Library:
      ImagePicker.launchImageLibrary(pickerOptions, response => {
        this.saveFile(response);
      });
    }
  };

  saveFile = async (response: any) => {
    if (response.uri) {
      const file = {
        name: response.fileName ?? "",
        size: response.fileSize ?? null,
        type: response.type ?? null,
        uri: response.uri
      };
      const copiedFile = await copyExternalFileToAppCache(file);
      this.props.onMediaSelected(copiedFile);
    }
  };

  render() {
    const {
      iconStyle = Styles.Containers.uploadIcon,
      style = Styles.Containers.uploadContainer,
      textStyle = Styles.Containers.uploadText,
      uploadText = translate("common.upload"),
      ...rest
    } = this.props;

    const flatStyle = StyleSheet.flatten(style) || {};

    // Strip the padding from the top-level style and apply it to the inner view.
    // This is because we want the Touchable area to have the same bounds as the ImageBackground
    // If we applied the padding to the ImageBackground the Touchable would not reach all the way!
    const {
      padding,
      paddingHorizontal,
      paddingVertical,
      paddingTop,
      paddingBottom,
      paddingLeft,
      paddingRight,
      paddingStart,
      paddingEnd,
      ...remainingStyle
    } = flatStyle;
    const paddingStyle = {
      padding,
      paddingHorizontal,
      paddingVertical,
      paddingTop,
      paddingBottom,
      paddingLeft,
      paddingRight,
      paddingStart,
      paddingEnd
    };

    const borderRadius = flatStyle.borderRadius;
    return (
      <ImageBackground
        source={{ uri: this.props.fileTypeFilter !== "video" ? this.props.selectedFile?.uri : "" }}
        style={[remainingStyle]}
        imageStyle={[styles.backgroundImage, { borderRadius }]}
        resizeMode={"cover"}
      >
        <Touchable
          style={[styles.innerContainer, paddingStyle]}
          {...rest}
          accessibilityRole={"button"}
          onPress={this._onPress}
        >
          <>
            <Image source={uploadIcon} style={iconStyle} />
            <Text style={textStyle}>{uploadText}</Text>

            {this.props.fileTypeFilter === "video" && !!this.props.selectedFile?.name && (
              <Text style={textStyle}>{this.props.selectedFile?.name}</Text>
            )}
          </>
        </Touchable>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  /**
   * This is needed because otherwise ImageBackground attempts to apply the height and width of its style prop to the image
   */
  backgroundImage: {
    height: null,
    width: null
  },
  innerContainer: {
    alignSelf: "stretch",
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
