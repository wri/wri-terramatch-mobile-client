// @flow

import type { PendingTeamMember } from "../../../../../redux/wri-api/organisations";
import React, { Component } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import Styles from "../../../../../styles";
import translate from "../../../../../locales";
import Layout, { IsSmallDevice } from "../../../../../styles/layout";
import colours from "../../../../../styles/colours";
import { FONT_FAMILY, textColours } from "../../../../../styles/text";
import Touchable from "../../../../common/touchable";

const profileIcon = require("../../../../../assets/icons/member/profile_ic.png");
const removeIcon = require("../../../../../assets/icons/profile/remove.png");

type Props = {|
  +member: PendingTeamMember,
  +onDeletePressed?: ?() => void,
  +onPress?: ?() => void
|};

export default class TeamMemberCard extends Component<Props> {
  render() {
    const member = this.props.member;
    let firstName = null;
    let lastName = null;
    let jobRole = null;
    let email = null;
    let phoneNumber = null;
    let avatarUri = null;
    let isPendingInvite = false;
    let canDelete = true;

    switch (member.type) {
      case "created_user": {
        firstName = translate("mobile.common.unknown");
        email = member.data.email_address;
        jobRole = translate("addTeamMember.details.awaitingConfirmation");
        isPendingInvite = true;
        break;
      }
      case "created_member": {
        firstName = member.data.first_name ?? translate("mobile.common.unknown");
        lastName = member.data.last_name;
        jobRole = member.data.job_role;
        email = member.data.email_address;
        phoneNumber = member.data.phone_number;
        avatarUri = member.avatarFile?.uri;
        break;
      }
      case "existing_user": {
        firstName = member.data.first_name ?? member.base.first_name ?? translate("mobile.common.unknown");
        lastName = member.data.last_name ?? member.base.last_name;
        jobRole = member.data.job_role ?? member.base.job_role;
        email = member.data.email_address ?? member.base.email_address;
        phoneNumber = member.data.phone_number ?? member.base.phone_number;
        avatarUri = member.avatarFile?.uri ?? member.base.avatar;
        canDelete = false;
        isPendingInvite = !firstName && !lastName;
        break;
      }
      case "existing_member": {
        firstName = member.data.first_name ?? member.base.first_name ?? translate("mobile.common.unknown");
        lastName = member.data.last_name ?? member.base.last_name;
        jobRole = member.data.job_role ?? member.base.job_role;
        email = member.data.email_address ?? member.base.email_address;
        phoneNumber = member.data.phone_number ?? member.base.phone_number;
        avatarUri = member.avatarFile?.uri ?? member.base.avatar;
        break;
      }
      default: {
        // eslint-disable-next-line babel/no-unused-expressions
        (member.type: empty);
        break;
      }
    }

    const title = [firstName, lastName].filter(item => !!item).join(" ") ?? email;
    const subtitle = jobRole ?? translate("mobile.addTeamMember.details.unknownRole");
    const details1 = email;
    const details2 = phoneNumber;
    const avatarSource = avatarUri ? { uri: avatarUri } : profileIcon;

    return (
      <View style={styles.cardWrapper}>
        <Touchable style={styles.card} onPress={this.props.onPress} accessibilityRole={"button"}>
          <Image style={styles.icon} source={avatarSource} />
          <View style={styles.details}>
            <Text style={styles.teamMemberTitle} ellipsizeMode={"tail"} numberOfLines={1}>
              {title}
            </Text>
            <Text style={styles.teamMemberSubtitle}>{subtitle}</Text>
            <Text style={styles.teamMemberSubtitle}>{details1}</Text>
            <Text style={styles.teamMemberSubtitle}>{details2}</Text>
          </View>
          <View>
            {isPendingInvite && (
              <View style={styles.inviteContainer}>
                <Text style={styles.inviteText}>{translate("addTeamMember.details.inviteSent")}</Text>
              </View>
            )}
            {this.props.onDeletePressed && canDelete && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={this.props.onDeletePressed}
                accessibilityRole={"button"}
              >
                <Image source={removeIcon} />
              </TouchableOpacity>
            )}
          </View>
        </Touchable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cardWrapper: {
    minHeight: 130,
    padding: Layout.Margins.small,
    borderRadius: Styles.Layout.BorderRadius.medium,
    backgroundColor: colours.white,
    ...Styles.Containers.cardShadow,
    marginHorizontal: Styles.Layout.Margins.tiny,
    marginVertical: Styles.Layout.Margins.small,
    marginTop: 1
  },
  card: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row"
  },
  deleteButton: {
    paddingHorizontal: Styles.Layout.Margins.tiny,
    alignItems: "flex-end",
    justifyContent: "center",
    flex: 1
  },
  details: {
    justifyContent: "center",
    marginStart: Styles.Layout.Margins.tiny,
    marginEnd: Styles.Layout.Margins.tiny,
    flex: 1
  },
  icon: {
    width: IsSmallDevice ? 72 : 96,
    height: IsSmallDevice ? 72 : 96,
    borderRadius: Styles.Layout.BorderRadius.medium,
    marginEnd: Styles.Layout.Margins.tiny
  },
  inviteContainer: {
    paddingVertical: Styles.Layout.Margins.tiny,
    paddingHorizontal: Styles.Layout.Margins.medium,
    borderRadius: Styles.Layout.Margins.medium,
    backgroundColor: colours.primary
  },
  inviteText: {
    fontSize: 11,
    color: colours.white,
    fontFamily: FONT_FAMILY
  },
  teamMemberTitle: {
    fontSize: 21,
    fontWeight: "bold",
    color: textColours.body,
    fontFamily: FONT_FAMILY
  },
  teamMemberSubtitle: {
    marginTop: Styles.Layout.Margins.small,
    fontSize: 16,
    lineHeight: 16
  }
});
