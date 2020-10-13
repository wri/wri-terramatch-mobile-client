// @flow

import type { ResolvedMatch } from "../../redux/wri-api/interests";
import React, { Component, type Node } from "react";
import { Image, StyleSheet, Text, View, Linking, Alert } from "react-native";
import { MatchOfferContactRead, MatchPitchContactRead, OfferRead, PitchRead } from "wri-api";
import Moment from "moment";

import Styles from "../../styles/";
import translate from "../../locales/";
import Touchable from "../common/touchable";
import Button from "../common/button";
import Layout from "../../styles/layout";
import ArrowDownIcon from "../../assets/icons/common/chevron-down.png";
import ArrowUpIcon from "../../assets/icons/common/chevron-up.png";
import ArrowRightIcon from "../../assets/icons/common/chevron-right.png";
const placeholderIcon = require("../../assets/icons/organisation/placeholder.png");

type Props = {|
  +content: ResolvedMatch,
  +removeMatch: (interestId: number) => void
|};

type State = {|
  isExpanded: boolean,
  isUnmatched: boolean
|};

export default class ConnectionCard extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isExpanded: false,
      isUnmatched: false
    };
  }

  showDropdown = () => {
    this.setState({
      isExpanded: true
    });
  };

  hideDropdown = () => {
    this.setState({
      isExpanded: false
    });
  };

  arrowDown = () => {
    return <Image source={ArrowDownIcon} style={styles.dropImg} resizeMode="contain" />;
  };

  arrowUp = () => {
    return <Image source={ArrowUpIcon} style={styles.dropImg} resizeMode="contain" />;
  };

  openEmail = (buttonContent: string) => {
    Linking.openURL(`mailto:${buttonContent}`);
  };

  openPhonepad = (buttonContent: string) => {
    Linking.openURL(`tel:${buttonContent}`);
  };

  renderButton = (buttonLabel: string, buttonContent: string, contactMethod: "tel" | "email") => {
    return (
      <View style={styles.contactButtonWrapper}>
        <Touchable
          style={styles.contactButton}
          accessibilityRole="button"
          onPress={() => (contactMethod === "tel" ? this.openPhonepad(buttonContent) : this.openEmail(buttonContent))}
        >
          <Text style={styles.contactType}>
            {buttonLabel} <Text style={styles.contact}>{buttonContent}</Text>
          </Text>
          <Image source={ArrowRightIcon} style={styles.contactChevron} />
        </Touchable>
      </View>
    );
  };

  unmatch = () => {
    const myInterestId: ?number = this.props.content[`${this.props.content.mine}_interest_id`];

    if (!myInterestId) {
      return;
    }

    const theirProject: OfferRead | PitchRead = this.props.content[this.props.content.theirs];
    Alert.alert(
      translate("connections.unmatch"),
      translate("connections.unmatchHelp", null, { name: theirProject.name ?? "" }),
      [
        {
          text: translate("common.cancel"),
          style: "cancel"
        },
        {
          text: translate("common.yes"),
          onPress: () => {
            this.setState({
              isUnmatched: true
            });
            this.props.removeMatch(myInterestId);
          }
        }
      ],
      { cancelable: false }
    );
  };

  renderConnectionContactDetails = (item: MatchOfferContactRead | MatchPitchContactRead): Node => {
    const { email_address, phone_number } = item;

    return (
      <View style={styles.connectionWrapper} key={item.id ?? ""}>
        <View style={styles.headlineView}>
          {item.avatar ? (
            <Image style={styles.connectionImage} source={{ uri: item.avatar ?? placeholderIcon }} />
          ) : (
            <Image style={styles.connectionImage} source={placeholderIcon} />
          )}
          <View>
            <Text style={styles.funderNameText}>
              {item.first_name} {item.last_name}
            </Text>
          </View>
        </View>
        <View style={styles.buttonRow}>
          {email_address ? this.renderButton(translate("connections.email"), email_address, "email") : null}
          {phone_number ? this.renderButton(translate("connections.phone"), phone_number, "tel") : null}
        </View>
      </View>
    );
  };

  render() {
    const theirProject: OfferRead | PitchRead = this.props.content[this.props.content.theirs];
    const myProject: OfferRead | PitchRead = this.props.content[this.props.content.mine];
    const theirContactDetails = this.props.content[`${this.props.content.theirs}_contacts`];
    const formattedDate = this.props.content?.matched_at ? Moment(this.props.content.matched_at).fromNow() : "";

    if (this.state.isUnmatched) {
      return null;
    }

    return (
      <View style={styles.mainView}>
        <Touchable
          accessibilityRole="button"
          onPress={this.state.isExpanded ? this.hideDropdown.bind(this) : this.showDropdown.bind(this)}
        >
          <View style={styles.connection}>
            <View style={styles.connectionRow}>
              {theirProject.avatar && <Image style={styles.logoImage} source={{ uri: theirProject.avatar }} />}
              <View style={styles.detailContainer}>
                <Text style={styles.titleText}>{theirProject.name}</Text>
                <View style={styles.topMarginPaddedContainer}>
                  <View style={styles.horizontalView}>
                    <Text style={styles.subtitleText}>
                      {translate("connections.with", null, { projectName: myProject.name ?? "" })}
                    </Text>
                  </View>
                </View>
                <Text style={styles.date}>{formattedDate}</Text>
              </View>
            </View>
            <View style={styles.dropLogoContainer}>
              <View style={styles.dropLogoView}>{this.state.isExpanded ? this.arrowUp() : this.arrowDown()}</View>
            </View>
          </View>
        </Touchable>

        {/*DROPDOWN CARD*/}
        {this.state.isExpanded ? (
          <View style={styles.dropdown}>
            {theirContactDetails.map(item => this.renderConnectionContactDetails(item))}
            <Button
              style={styles.removeButton}
              onPress={() => this.unmatch()}
              title={translate("connections.unmatch")}
            />
          </View>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: Styles.Colours.white,
    marginVertical: Layout.Margins.small,
    borderRadius: Styles.Layout.BorderRadius.small,
    borderColor: Styles.Colours.border,
    borderWidth: 1
  },
  connection: {
    padding: Layout.Margins.small,
    flexDirection: "row",
    justifyContent: "space-between",
    overflow: "visible"
  },
  connectionRow: {
    ...Styles.Utilities.flexRow,
    paddingRight: 30
  },
  dropdown: {
    backgroundColor: "#f5f5f5",
    borderBottomLeftRadius: Styles.Layout.BorderRadius.small,
    borderBottomRightRadius: Styles.Layout.BorderRadius.small,
    borderTopColor: Styles.Colours.border,
    borderTopWidth: 1,
    ...Styles.Containers.cardShadow,
    paddingHorizontal: Styles.Layout.Margins.small
  },
  detailContainer: {
    flex: 1
  },
  dropLogoContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
  dropLogoView: {
    justifyContent: "center",
    alignItems: "center"
  },
  dropImg: {
    height: 16,
    width: 23
  },
  contactChevron: {
    width: 5,
    height: 10
  },
  contactButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  contactButtonWrapper: {
    borderRadius: Layout.BorderRadius.small,
    backgroundColor: Styles.Colours.white,
    borderWidth: 1,
    borderColor: Styles.Colours.border,
    marginBottom: Layout.Margins.tiny,
    paddingVertical: Styles.Layout.Margins.tiny,
    paddingHorizontal: Styles.Layout.Margins.small
  },
  contact: {
    fontWeight: "300"
  },
  contactType: {
    ...Styles.Text.button,
    color: Styles.Colours.black,
    padding: Layout.Margins.tiny
  },
  buttonRow: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between"
  },
  horizontalView: {
    flexDirection: "row"
  },
  headlineView: {
    flexDirection: "row",
    width: "100%",
    marginBottom: Layout.Margins.medium,
    alignItems: "center"
  },
  logoImage: {
    width: 62,
    aspectRatio: 1,
    borderRadius: Layout.Margins.small,
    marginRight: Layout.Margins.medium
  },
  connectionImage: {
    borderWidth: 3,
    borderColor: Styles.Colours.primary,
    borderRadius: 62 / 2,
    width: 62,
    height: 62,
    marginRight: Layout.Margins.small
  },
  titleText: {
    ...Styles.Text.secondaryH2,
    fontSize: 18,
    lineHeight: 18
  },
  funderNameText: {
    ...Styles.Text.secondaryH2,
    fontSize: 18
  },
  subtitleText: {
    ...Styles.Text.bodyHero,
    ...Styles.Text.bodyTiny,
    fontSize: 14,
    lineHeight: 14,
    color: Styles.Colours.black,
    fontWeight: "300",
    alignSelf: "center"
  },
  topMarginPaddedContainer: {
    marginTop: 3
  },
  connectionWrapper: {
    paddingTop: Layout.Margins.medium
  },
  removeButton: {
    ...Styles.Buttons.centeredPrimaryButton,
    backgroundColor: Styles.Colours.red,
    color: Styles.Colours.white,
    marginTop: Styles.Layout.Margins.tiny,
    marginBottom: Styles.Layout.Margins.medium,
    width: "100%"
  },
  date: {
    ...Styles.Text.bodyTiny,
    lineHeight: 12,
    fontWeight: "300"
  }
});
