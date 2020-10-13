// @flow

import React, { Component, type ElementConfig } from "react";
import translate from "../../../locales";
import { Navigation } from "react-native-navigation";
import PitchDetailsScreen from "./index";
import { initialAsyncState } from "../../../redux/asyncActionReducer";
import { Alert } from "react-native";
import { PitchRead } from "wri-api";

const archiveIcon = require("../../../assets/icons/projects/delete.png");
const editIcon = require("../../../assets/icons/profile/edit.png");

const NAV_BAR_BUTTON_ID_ARCHIVE = "nav_bar_btn_archive";
const NAV_BAR_BUTTON_ID_EDIT = "nav_bar_btn_edit";

type BaseProps = ElementConfig<typeof PitchDetailsScreen>;
type BasePropsWithoutProvided = $Rest<
  BaseProps,
  {|
    +isOwnedByUser: any,
    +myOffers: any,
    +myOrganisation: any
  |}
>;

type Props = {|
  ...BasePropsWithoutProvided,

  /**
   * Callback to be invoked when the user has requested that they be able to archive their project
   */
  +onArchivePitchPressed: () => Promise<any>,

  /**
   * Callback to be invoked when the user has requested that they be able to edit their project
   */
  +onEditPitchPressed: () => Promise<any>
|};

export default class MyPitchDetailsScreen extends Component<Props> {
  static options(passProps: { pitchBase: ?PitchRead, isOwnedByUser: boolean }) {
    return {
      topBar: {
        rightButtons: [
          {
            id: NAV_BAR_BUTTON_ID_EDIT,
            icon: editIcon,
            showAsAction: "always",
            enabled: passProps.pitchBase?.visibility !== "archived"
          },
          {
            id: NAV_BAR_BUTTON_ID_ARCHIVE,
            icon: archiveIcon,
            showAsAction: "always",
            enabled: passProps.pitchBase?.visibility !== "archived"
          }
        ],
        title: {
          text: translate("projects.title"),
          alignment: "fill"
        }
      }
    };
  }

  constructor(props: Props) {
    super(props);
    Navigation.events().bindComponent(this);
  }

  navigationButtonPressed(event: { buttonId: string }) {
    if (event.buttonId === NAV_BAR_BUTTON_ID_EDIT) {
      this.props.onEditPitchPressed();
    } else if (event.buttonId === NAV_BAR_BUTTON_ID_ARCHIVE) {
      this._confirmArchivePitch();
    }
  }

  _confirmArchivePitch = () => {
    Alert.alert(
      translate("createPitch.archivePitch"),
      translate("createPitch.archivePitchHelp", null, {
        name: this.props.pitchBase?.name ?? translate("mobile.common.unknown")
      }),
      [
        {
          text: translate("common.yes"),
          onPress: () => {
            this.props.onArchivePitchPressed();
            Navigation.pop(this.props.componentId);
          }
        },
        {
          text: translate("common.cancel"),
          style: "cancel"
        }
      ]
    );
  };

  render() {
    // eslint-disable-next-line no-unused-vars
    const { onArchivePitchPressed, ...rest } = this.props;
    return (
      <PitchDetailsScreen
        {...rest}
        isOwnedByUser={true}
        myOffers={initialAsyncState}
        myOrganisation={initialAsyncState}
      />
    );
  }
}
