// @flow

import React, { Component } from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import {
  OfferContactCreate,
  OfferContactRead,
  PitchContactCreate,
  PitchContactRead,
  TeamMemberRead,
  UserRead
} from "wri-api";
import Touchable from "../../../common/touchable/";
import Styles from "../../../../styles";
import { FONT_FAMILY, textColours } from "../../../../styles/text";

export type PendingProjectContact =
  | {| type: "created", data: PitchContactCreate | OfferContactCreate |}
  | {| type: "existing", data: PitchContactRead | OfferContactRead |}
  | {| type: "deleted", data: PitchContactRead | OfferContactRead |};

export type ContactListItem =
  | {|
      type: "member",
      data: TeamMemberRead,
      selection: ?PendingProjectContact
    |}
  | {|
      type: "user",
      data: UserRead,
      selection: ?PendingProjectContact
    |};

type Props = {|
  items: Array<ContactListItem>,
  onPress: ContactListItem => void
|};

export default class ProjectContactList extends Component<Props> {
  renderContact(item: ContactListItem): any {
    const data = item.data;
    return (
      <Touchable
        style={item.selection ? [styles.imageWrapper, styles.checkedImageWrapper] : styles.imageWrapper}
        accessibilityRole="button"
        onPress={() => this.props.onPress(item)}
      >
        {data.avatar ? (
          <View style={Styles.Utilities.flexGrow}>
            <Image source={{ uri: data.avatar }} style={styles.placeholderIcon} />
          </View>
        ) : (
          <View style={[Styles.Utilities.flexGrow, styles.imgPlaceholder]}>
            <Text style={styles.placeholderText}>
              {(data.first_name ? data.first_name : "Unknown").charAt(0)}
              {(data.last_name ? data.last_name : "Unknown").charAt(0)}
            </Text>
          </View>
        )}
        <Text style={styles.teamMemberTitle}>
          {data.first_name ?? "Unknown"} {data.last_name ?? "Unknown"}
        </Text>
        <Text style={styles.teamMemberRole}>{data.job_role ?? ""}</Text>
        {/* <View style={styles.card}>
          <Checkbox
            style={styles.checkbox}
            checkboxLabel={translate("common.point.contact", "Point of Contact")}
            isSelected={true}
          />
        </View> */}
      </Touchable>
    );
  }

  render() {
    return <View style={styles.checkboxWrapper}>{this.props.items.map(item => this.renderContact(item))}</View>;
  }
}

const styles = StyleSheet.create({
  placeholderIcon: {
    height: "100%",
    width: "100%",
    alignSelf: "center"
  },
  imageWrapper: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: Styles.Colours.white,
    flex: 1,
    marginBottom: Styles.Layout.Margins.small,
    borderWidth: 4,
    borderColor: "transparent",
    ...Styles.Containers.cardShadow
  },
  checkboxWrapper: {
    width: "100%",
    flexWrap: "wrap"
  },
  checkedImageWrapper: {
    borderColor: Styles.Colours.primary
  },
  teamMemberTitle: {
    fontSize: 30,
    marginStart: Styles.Layout.Margins.small,
    fontWeight: "bold",
    color: textColours.body,
    fontFamily: FONT_FAMILY
  },
  teamMemberRole: {
    marginTop: Styles.Layout.Margins.small,
    fontSize: 20,
    marginStart: Styles.Layout.Margins.small,
    color: textColours.black,
    fontFamily: FONT_FAMILY
  },
  imgPlaceholder: {
    backgroundColor: Styles.Colours.primary,
    justifyContent: "center",
    alignItems: "center"
  },
  placeholderText: {
    color: Styles.Colours.white,
    fontFamily: FONT_FAMILY,
    fontSize: 100,
    fontWeight: "bold"
  }
  /*,
  card: {
    width: "50%",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Layout.Margins.small,
    borderRadius: 2,
    backgroundColor: colours.white,
    ...Styles.Containers.cardShadow,
    borderWidth: 1,
    borderColor: colours.white,
    marginBottom: Layout.Margins.medium
  },
  checkbox: {
    borderBottomWidth: 0,
    justifyContent: "space-around"
  }
  */
});
