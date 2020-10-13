// @flow

import React, { Component, type ElementConfig } from "react";
import translate from "../../../locales";
import { Navigation } from "react-native-navigation";
import OfferDetailsScreen from "./index";
import { initialAsyncState } from "../../../redux/asyncActionReducer";
import { Alert } from "react-native";
import { OfferRead } from "wri-api";

const archiveIcon = require("../../../assets/icons/projects/delete.png");
const editIcon = require("../../../assets/icons/profile/edit.png");

const NAV_BAR_BUTTON_ID_ARCHIVE = "nav_bar_btn_archive";
const NAV_BAR_BUTTON_ID_EDIT = "nav_bar_btn_edit";

type BaseProps = ElementConfig<typeof OfferDetailsScreen>;
type BasePropsWithoutProvided = $Rest<
  BaseProps,
  {|
    +isOwnedByUser: any,
    +myOrganisation: any,
    +myPitches: any
  |}
>;

type Props = {|
  ...BasePropsWithoutProvided,

  /**
   * Callback to be invoked when the user has requested that they be able to archive their project
   */
  +onArchiveOfferPressed: () => Promise<any>,

  /**
   * Callback to be invoked when the user has requested that they be able to edit their project
   */
  +onEditOfferPressed: () => Promise<any>
|};

export default class MyOfferDetailsScreen extends Component<Props> {
  static options(passProps: { isOwnedByUser: boolean, offerBase: ?OfferRead }) {
    return {
      topBar: {
        rightButtons: [
          {
            id: NAV_BAR_BUTTON_ID_EDIT,
            icon: editIcon,
            showAsAction: "always",
            enabled: passProps.offerBase?.visibility !== "archived"
          },
          {
            id: NAV_BAR_BUTTON_ID_ARCHIVE,
            icon: archiveIcon,
            showAsAction: "always",
            enabled: passProps.offerBase?.visibility !== "archived"
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
      this.props.onEditOfferPressed();
    } else if (event.buttonId === NAV_BAR_BUTTON_ID_ARCHIVE) {
      this._confirmArchiveOffer();
    }
  }

  _confirmArchiveOffer = () => {
    Alert.alert(
      translate("createOffer.archiveOffer"),
      translate("createOffer.archiveOfferHelp", null, {
        name: this.props.offerBase?.name ?? translate("mobile.common.unknown")
      }),
      [
        {
          text: translate("common.yes"),
          onPress: () => {
            this.props.onArchiveOfferPressed();
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
    const { onArchiveOfferPressed, onEditOfferPressed, ...rest } = this.props;
    return (
      <OfferDetailsScreen
        {...rest}
        isOwnedByUser={true}
        myPitches={initialAsyncState}
        myOrganisation={initialAsyncState}
      />
    );
  }
}
