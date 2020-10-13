// @flow

import type { File } from "../../../../utils/models.types";

import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Navigation } from "react-native-navigation";
import Styles from "../../../../styles";
import { screens } from "../../../../screens/";
import translate from "../../../../locales/";
import PropTypes from "prop-types";
import Screen from "../../../common/screen";
import Validation from "../../../../utils/validation";
import MediaPickerView from "../../../common/media-picker-view";
import Error from "../../../common/error";
import { organisationCreationNavigation } from "../../../../utils/navigation";

const NAV_BAR_BUTTON_ID_HOME = "nav_bar_btn_home";

type Props = {|
  /**
   * A file the user has chosen to use as an avatar
   */
  +avatarFile: ?File,

  /**
   * Automatically sent by RNN if mounted in a navigation stack
   */
  +componentId: string,

  /**
   * A file the user has chosen to use as a cover photo
   */
  +coverPhotoFile: ?File,

  +isEdit: boolean,

  /**
   * A function that when invoked stores the user's preferred file to use as the organisation's avatar
   */
  +updateAvatar: File => void,

  /**
   * A function that when invoked stores the user's preferred file to use as the organisation's cover photo
   */
  +updateCoverPhoto: File => void
|};

export default class OrganisationCoverPhotoLogoUploadScreen extends Component<Props> {
  static options(passProps: { isEdit: boolean }) {
    return {
      ...organisationCreationNavigation(passProps.isEdit)
    };
  }

  static propTypes = {
    /**
     * Automatically sent by RNN if mounted in a navigation stack
     */
    componentId: PropTypes.string.isRequired
  };

  constructor(props: Props) {
    super(props);
    Navigation.events().bindComponent(this);
  }

  navigationButtonPressed(event: any) {
    switch (event.buttonId) {
      case NAV_BAR_BUTTON_ID_HOME: {
        Navigation.popToRoot(this.props.componentId);
        break;
      }
    }
  }

  _startOrganisationAwards = () => {
    Navigation.push(this.props.componentId, {
      component: {
        ...screens.SIGNUP_ORGANISATION_REVIEW,
        passProps: {
          isEdit: this.props.isEdit ? true : false
        }
      }
    });
  };

  _previousStep = () => {
    Navigation.pop(this.props.componentId);
  };

  render() {
    const isAvatarValid = Validation.organisationAvatar.validate(this.props.avatarFile);
    const isCoverPhotoValid = Validation.organisationCoverPhoto.validate(this.props.coverPhotoFile);
    const allInputsValid = isAvatarValid && isCoverPhotoValid;

    const titleText = translate("createOrganisation.logoCover.title");
    const subtitleText = translate("createOrganisation.logoCover.subtext");
    const uploadCoverText = translate("createOrganisation.logoCover.cover");
    const uploadLogoText = translate("createOrganisation.logoCover.avatar");

    return (
      <Screen
        secondary
        keyboard
        style={styles.viewPadding}
        headingStyle={styles.headerPadding}
        header={titleText}
        subtext={subtitleText}
        isNextButtonEnabled={allInputsValid}
        onPreviousButtonPressed={this._previousStep}
        onNextButtonPressed={this._startOrganisationAwards}
      >
        <View style={styles.uploadContainer}>
          <MediaPickerView
            style={styles.uploadCoverView}
            iconStyle={styles.cloudUploadCoverIcon}
            textStyle={styles.uploadCoverText}
            fileTypeFilter={"photo"}
            onMediaSelected={this.props.updateCoverPhoto}
            selectedFile={this.props.coverPhotoFile}
            uploadText={uploadCoverText}
          />
          <MediaPickerView
            style={styles.uploadLogoView}
            iconStyle={styles.cloudUploadLogoIcon}
            textStyle={[Styles.Text.bodyHero, styles.uploadLogoText]}
            fileTypeFilter={"photo"}
            onMediaSelected={this.props.updateAvatar}
            selectedFile={this.props.avatarFile}
            uploadText={uploadLogoText}
          />
        </View>
        {this.props.coverPhotoFile && !isCoverPhotoValid && (
          <Error error={Validation.organisationCoverPhoto.errorString(this.props.coverPhotoFile)} />
        )}
        {this.props.avatarFile && !isAvatarValid && (
          <Error error={Validation.organisationAvatar.errorString(this.props.avatarFile)} />
        )}
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  uploadContainer: {
    width: "100%",
    flex: 1,
    marginTop: 50
  },
  uploadCoverView: {
    backgroundColor: "#333333",
    width: "100%",
    flexDirection: "row",
    height: 170,
    justifyContent: "center",
    alignItems: "center"
  },
  uploadLogoView: {
    position: "absolute",
    backgroundColor: "#ffffff",
    borderWidth: 3,
    borderColor: "#5d5d5d",
    borderRadius: 10,
    width: 90,
    height: 90,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    marginLeft: 20,
    marginTop: 130
  },
  uploadCoverText: {
    color: "#ffffff",
    textAlign: "center"
  },
  uploadLogoText: {
    color: "#333333",
    textAlign: "center"
  },
  cloudUploadLogoIcon: {
    height: 28,
    resizeMode: "contain",
    width: 28,
    alignItems: "flex-end",
    tintColor: "#333333"
  },
  cloudUploadCoverIcon: {
    height: 28,
    resizeMode: "contain",
    width: 28,
    alignItems: "flex-end",
    marginRight: 10,
    tintColor: "#ffffff"
  },
  viewPadding: {
    paddingHorizontal: 0
  },
  headerPadding: {
    paddingHorizontal: Styles.Layout.Margins.medium
  }
});
