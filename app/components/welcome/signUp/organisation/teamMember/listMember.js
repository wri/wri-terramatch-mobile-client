// @flow

import type { PendingTeamMember } from "../../../../../redux/wri-api/organisations";
import React, { Component } from "react";
import { Alert, FlatList, Image, StyleSheet, Text } from "react-native";
import { Navigation } from "react-native-navigation";
import MemberCard from "./memberCard";
import Styles from "../../../../../styles";
import translate from "../../../../../locales";
import Button from "../../../../common/button";
import Screen from "../../../../common/screen";
import { screens } from "../../../../../screens";
import { organisationCreationNavigation } from "../../../../../utils/navigation";

const NAV_BAR_BUTTON_ID_HOME = "nav_bar_btn_home";

const tickIcon = require("../../../../../assets/icons/tick.png");

type Props = {|
  /**
   * Automatically sent by RNN if mounted in a navigation stack
   */
  +componentId: string,

  /**
   * Async state representing a request for the countries that should be shown in the picker on this screen
   */
  +list: Array<PendingTeamMember>,

  /**
   * User ID of the current logged in user
   */
  +loggedInUserId: ?number,

  +isEdit: boolean,

  +removeMember: PendingTeamMember => void
|};

export default class SignUpOrganisationListTeamMemberScreen extends Component<Props> {
  static options(passProps: { isEdit: boolean }) {
    return {
      ...organisationCreationNavigation(passProps.isEdit)
    };
  }

  constructor(props: Props) {
    super(props);
    Navigation.events().bindComponent(this);
  }

  navigationButtonPressed(event: any) {
    if (event.buttonId === NAV_BAR_BUTTON_ID_HOME) {
      {
        Navigation.popToRoot(this.props.componentId);
      }
    }
  }

  _previousStep = () => {
    Navigation.pop(this.props.componentId);
  };

  _startOrganisationLogo = () => {
    Navigation.push(this.props.componentId, {
      component: {
        ...screens.SIGNUP_ORGANISATION_PHOTOS,
        passProps: {
          isEdit: this.props.isEdit
        }
      }
    });
  };

  _addMoreMembers = () => {
    Navigation.push(this.props.componentId, {
      component: {
        ...screens.SIGNUP_ORGANISATION_INVITETEAMMEMBER,
        passProps: {
          teamMemberListScreenComponentId: this.props.componentId,
          isEdit: this.props.isEdit
        }
      }
    });
  };

  handleItemPressed = (item: PendingTeamMember) => {
    if (item.type === "created_user" || (item.type === "existing_user" && item.base.id !== this.props.loggedInUserId)) {
      return;
    }

    Navigation.push(this.props.componentId, {
      component: {
        ...screens.SIGNUP_ORGANISATION_ADDTEAMMEMBER,
        passProps: {
          teamMemberListScreenComponentId: this.props.componentId,
          isEdit: this.props.isEdit,
          pendingItemId: item.id
        }
      }
    });
  };

  removeItem = (item: PendingTeamMember) => {
    Alert.alert(
      translate("addTeamMember.details.removeTeamMember"),
      translate("addTeamMember.details.removeTeamMemberHelp", null, {
        name: `${item.data?.first_name ?? ""} ${item.data?.last_name ?? ""}`
      }),
      [
        {
          text: translate("common.cancel"),
          style: "cancel"
        },
        { text: translate("common.yes"), onPress: () => this.props.removeMember(item) }
      ],
      { cancelable: false }
    );
  };

  getMemberView(item: PendingTeamMember): any {
    return (
      <MemberCard
        key={item.data.email_address}
        member={item}
        onDeletePressed={this.removeItem.bind(null, item)}
        onPress={this.handleItemPressed.bind(null, item)}
      />
    );
  }

  renderEmptyView() {
    return <Text style={Styles.Text.body}>{translate("addTeamMember.success")}</Text>;
  }

  render() {
    const filteredTeamMembers = this.props.list.filter(
      item => item.type === "created_member" || item.type === "created_user"
    );
    const mostRecentTeamMember =
      filteredTeamMembers.length >= 1 ? filteredTeamMembers?.[filteredTeamMembers.length - 1]?.data : null;
    return (
      <Screen
        secondary
        header={translate("addTeamMember.details.title")}
        isNextButtonEnabled={true}
        onPreviousButtonPressed={this._previousStep}
        onNextButtonPressed={this._startOrganisationLogo}
      >
        {mostRecentTeamMember && (
          <>
            <Image style={styles.icon} source={tickIcon} />
            <Text
              style={[
                Styles.Text.body,
                Styles.Text.centered,
                {
                  marginEnd: Styles.Layout.Margins.small,
                  marginTop: Styles.Layout.Margins.medium,
                  marginStart: Styles.Layout.Margins.small,
                  marginBottom: Styles.Layout.Margins.large
                }
              ]}
            >
              {mostRecentTeamMember.first_name
                ? translate("mobile.addTeamMember.details.successAddSubtextNoAccount", null, {
                    name: mostRecentTeamMember.first_name ?? ""
                  })
                : translate("addTeamMember.details.successAddSubtext", null, {
                    name: mostRecentTeamMember.email_address ?? ""
                  })}
            </Text>
          </>
        )}

        <FlatList
          contentContainerStyle={this.props.list.length === 0 && styles.centerEmptySet}
          style={styles.list}
          data={this.props.list.filter(item => !item.isDeleted)}
          renderItem={({ item }) => this.getMemberView(item)}
          ListEmptyComponent={this.renderEmptyView()}
        />

        <Button
          style={[Styles.Buttons.secondary, Styles.Buttons.medium, styles.button]}
          onPress={this._addMoreMembers}
          title={translate("mobile.addTeamMember.addMember")}
        />
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    alignSelf: "center",
    justifyContent: "center",
    marginTop: Styles.Layout.Margins.medium,
    marginBottom: Styles.Layout.Margins.large
  },
  icon: {
    width: 112,
    height: 100,
    borderRadius: Styles.Layout.BorderRadius.small,
    marginStart: Styles.Layout.Margins.small,
    alignSelf: "center",
    marginEnd: Styles.Layout.Margins.small,
    tintColor: Styles.Colours.primary
  },
  list: {
    flex: 1
  },
  centerEmptySet: { justifyContent: "center", alignItems: "center", height: "100%" }
});
