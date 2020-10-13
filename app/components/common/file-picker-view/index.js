// @flow

import type { File, PendingFile, PendingFileList } from "../../../utils/models.types";
import React, { Component, type ElementProps } from "react";
import { Image, Text, View, StyleSheet, Alert } from "react-native";
import DocumentPicker from "react-native-document-picker";

import InputLabel from "../forms/input-label/";
import Styles from "../../../styles";
import Touchable from "../touchable";
import Button from "../button";
import translate from "../../../locales";
import ValidatedTextInput from "../../common/validated-input";
import copyExternalFileToAppCache from "../../../utils/copyExternalFileToAppCache";
import Validation from "../../../utils/validation";
import textInputProps from "../../../constants/textInputProps";
import DocumentCard from "./card";
import Error from "../error";
const uploadIcon = require("../../../assets/icons/organisation/upload-icon.png");

type Props = {|
  ...ElementProps<typeof View>,

  +buttonText?: ?string,

  +fileName?: ?string,

  /**
   * File types to show in the picker
   */
  +fileTypeFilter: Array<"allFiles" | "audio" | "images" | "plainText" | "pdf" | "video">,

  +icon: ?number,

  /**
   * Callback invoked when the user has selected some documents
   */
  +onDocumentSelected: File => void,

  +removeFile: PendingFile => void,

  /**
   * Files the user has already selected
   */
  +selectedFiles: PendingFileList
|};

type State = {|
  selectedFile: ?File,
  name: string
|};

/**
 * View that allows the user to attach documents from their local device intended for upload
 *
 * This view is not responsible for the upload itself, it simply manages passing file URIs to a container view for further
 * processing
 */
class FilePickerView extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedFile: null,
      name: ""
    };
  }

  _onPress = async (val: "fileName" | "upload") => {
    try {
      const fileTypes = this.props.fileTypeFilter.map(fileType => {
        return DocumentPicker.types[fileType];
      });
      const result = await DocumentPicker.pick({
        type: fileTypes
      });

      const copiedResult = await copyExternalFileToAppCache(result);

      if (val === "upload" && Validation.mediaUpload.validate(copiedResult)) {
        this.props.onDocumentSelected(copiedResult);
      }
      this.setState({ selectedFile: copiedResult });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  _onPressWithText = () => {
    const selectedFile = { ...this.state.selectedFile, name: this.state.name };
    this.props.onDocumentSelected(selectedFile);
    //Reset state
    this.setState({ selectedFile: null, name: "" });
  };

  removeItem = (item: PendingFile) => {
    Alert.alert(
      translate("createOrganisation.documents.remove", "Remove document"),
      `${translate("createOrganisation.documents.removeDescription", "Do you want to remove")} ${item.file.name}?`,
      [
        {
          text: translate("common.cancel"),
          style: "cancel"
        },
        { text: translate("common.yes"), onPress: () => this.props.removeFile(item) }
      ],
      { cancelable: false }
    );
  };

  _handleDescription = text => {
    this.setState({ name: text });
  };

  renderSelectedDocuments = (val: Array<PendingFile>): any => {
    return val
      .filter(item => item.type !== "deleted")
      .map(item => (
        <DocumentCard
          key={item.file.uri}
          document={item.file}
          icon={this.props.icon}
          onDeletePressed={this.removeItem.bind(this, item)}
        />
      ));
  };

  render() {
    const { style, ...rest } = this.props;
    const isNameValid = Validation.awardName.validate(this.state.name);
    const isMediaUploadValid = Validation.mediaUpload.validate(this.state.selectedFile);
    const hasContent = isNameValid && isMediaUploadValid;

    return (
      <>
        {this.props.fileName ? (
          <>
            <Touchable
              style={[Styles.Containers.uploadContainer, style]}
              {...rest}
              accessibilityRole={"button"}
              onPress={() => this._onPress("fileName")}
            >
              <Image source={uploadIcon} style={Styles.Containers.uploadIcon} />
              {isMediaUploadValid ? (
                <Text style={Styles.Containers.uploadText}>
                  {translate("common.uploadSelected", "1 item selected")}
                </Text>
              ) : (
                <Text style={Styles.Containers.uploadText}>{translate("common.upload")}</Text>
              )}
            </Touchable>

            <InputLabel title={this.props.fileName} />

            <ValidatedTextInput
              key="name-input"
              ref="name-input"
              placeholder={this.props.fileName}
              valid={isNameValid}
              value={this.state.name}
              message={Validation.awardName.errorString(this.state.name)}
              onChangeText={this._handleDescription}
              style={{ marginBottom: Styles.Layout.Margins.small }}
              {...textInputProps.text}
            />

            <Button
              disabledStyle={styles.addButtonDisabled}
              enabled={hasContent}
              style={styles.addButton}
              onPress={this._onPressWithText}
              title={this.props.buttonText}
            />
          </>
        ) : (
          <>
            <Touchable
              style={[Styles.Containers.uploadContainer, style]}
              {...rest}
              accessibilityRole={"button"}
              onPress={() => this._onPress("upload")}
            >
              <Image source={uploadIcon} style={Styles.Containers.uploadIcon} />
              <Text style={Styles.Containers.uploadText}>{translate("common.upload")}</Text>
            </Touchable>
          </>
        )}
        {this.state.selectedFile != null && !isMediaUploadValid && (
          <Error style={styles.errorView} error={Validation.mediaUpload.errorString(this.state.selectedFile)} />
        )}
        {this.props.selectedFiles ? this.renderSelectedDocuments(this.props.selectedFiles) : []}
      </>
    );
  }
}

const styles = StyleSheet.create({
  addButton: {
    ...Styles.Buttons.primary,
    ...Styles.Buttons.isSmall,
    ...Styles.Buttons.centeredPrimaryButton,
    marginVertical: Styles.Layout.Margins.medium
  },
  addButtonDisabled: {
    ...Styles.Buttons.centeredPrimaryButtonDisabled
  },
  errorView: {
    marginBottom: 30
  }
});

export default FilePickerView;
