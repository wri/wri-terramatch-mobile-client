// @flow

import type { AsyncState } from "../../../../redux/redux.types.js";
import type { PendingTeamMember } from "../../../../redux/wri-api/organisations";
import React, { Component } from "react";
import { FlatList } from "react-native";
import { PitchContactReadAll, OfferContactReadAll, TeamMemberRead, TeamMemberReadAll, UserReadAll } from "wri-api";
import Banner from "../../../common/banner";
import LoadingIndicator from "../../../common/loading-indicator";
import TeamMemberCard from "../../../welcome/signUp/organisation/teamMember/memberCard";

const teamBannerIcon = require("../../../../assets/icons/profile/team.png");

type Props = {|
  +style: any,
  +contentContainerStyle: any,
  +contactsState?: AsyncState<PitchContactReadAll> | AsyncState<OfferContactReadAll>,
  +membersState?: AsyncState<TeamMemberReadAll>,
  +onContactPressed?: ?(PendingTeamMember) => any,
  +usersState?: AsyncState<UserReadAll>,
  +scrollEnabled?: boolean,
  +translations: {|
    +empty: string
  |}
|};

export default class WriContactList extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const members: Array<PendingTeamMember> = (this.props.membersState?.data ?? []).map(member => ({
      id: 0,
      type: "existing_member",
      data: {},
      base: member,
      avatarFile: null,
      isDeleted: false
    }));
    const users: Array<PendingTeamMember> = (this.props.usersState?.data ?? []).map(user => ({
      id: 0,
      type: "existing_user",
      data: {},
      base: user,
      avatarFile: null,
      isDeleted: false
    }));
    const membersFromContacts: Array<PendingTeamMember> = (this.props.contactsState?.data ?? []).map(contact => ({
      id: 0,
      type: "existing_member",
      data: {},
      base: TeamMemberRead.constructFromObject({
        id: null,
        organisation_id: null,
        first_name: contact.first_name,
        last_name: contact.last_name,
        job_role: contact.job_role,
        facebook: contact.facebook,
        twitter: contact.twitter,
        instagram: contact.instagram,
        linkedin: contact.linkedin,
        avatar: contact.avatar,
        email_address: null,
        phone_number: null
      }),
      avatarFile: null,
      isDeleted: false
    }));
    const isFetching =
      this.props.contactsState?.isFetching || this.props.membersState?.isFetching || this.props.usersState?.isFetching;

    return (
      <>
        {isFetching && <LoadingIndicator />}
        <FlatList
          style={this.props.style}
          contentContainerStyle={this.props.contentContainerStyle}
          data={[...users, ...members, ...membersFromContacts]}
          renderItem={({ item }) => (
            <TeamMemberCard
              member={item}
              onPress={this.props.onContactPressed ? this.props.onContactPressed.bind(this, item) : null}
            />
          )}
          ListEmptyComponent={() => <Banner imageSource={teamBannerIcon} header={this.props.translations.empty} />}
          scrollEnabled={this.props.scrollEnabled}
        />
      </>
    );
  }
}
