// @flow

import type { ResolvedMatch } from "../../redux/wri-api/interests";
import React, { Component } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { OfferRead, PitchRead } from "wri-api";
import Moment from "moment";
import Styles from "../../styles";
import translate from "../../locales";
import Touchable from "../common/touchable";
import Button from "../common/button";
import Layout from "../../styles/layout";
import LoadingIndicator from "../common/loading-indicator";
const placeholderIcon = require("../../assets/icons/organisation/placeholder.png");

type Props = {|
  +content: ResolvedMatch,
  +interestClicked: ResolvedMatch => any,
  +onRemovePressed?: ?() => any
|};

type State = {|
  isUnmatched: boolean
|};

export default class InterestCard extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isUnmatched: false
    };
  }

  _unmatch = () => {
    this.setState({
      isUnmatched: true
    });
    if (this.props.onRemovePressed) {
      this.props.onRemovePressed();
    }
  };

  render() {
    const myProject: OfferRead | PitchRead = this.props.content[this.props.content.mine];
    const theirProject: OfferRead | PitchRead = this.props.content[this.props.content.theirs];
    const formattedDate = this.props.content?.created_at ? Moment(this.props.content?.created_at).fromNow() : "";
    return (
      <View style={styles.mainView}>
        <Touchable accessibilityRole="button" onPress={() => this.props.interestClicked(this.props.content)}>
          <View style={styles.interestCard}>
            <View style={Styles.Utilities.flexRow}>
              {theirProject.avatar ? (
                <Image style={styles.interestImage} source={{ uri: theirProject.avatar ?? placeholderIcon }} />
              ) : (
                <Image style={styles.interestImage} source={placeholderIcon} />
              )}
              <View style={styles.detailContainer}>
                <View style={styles.topMarginPaddedContainer}>
                  <Text style={styles.titleText}>{theirProject.name}</Text>
                  <Text style={styles.subtitleText}>
                    {translate("connections.with", null, { projectName: myProject.name ?? "" })}
                  </Text>
                  <Text style={styles.date}>{formattedDate}</Text>
                </View>
              </View>
              {!!this.props.onRemovePressed && (
                <View style={styles.buttonWrapper}>
                  {this.state.isUnmatched && <LoadingIndicator />}
                  {!this.state.isUnmatched && (
                    <Button
                      style={styles.withdrawButton}
                      onPress={this._unmatch}
                      title={translate("match.interest.withdraw")}
                    />
                  )}
                </View>
              )}
            </View>
          </View>
        </Touchable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    marginVertical: Layout.Margins.small,
    borderRadius: Styles.Layout.BorderRadius.small,
    backgroundColor: Styles.Colours.white,
    borderColor: Styles.Colours.border,
    borderWidth: 1
  },
  interestCard: {
    padding: Layout.Margins.small,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  detailContainer: {
    flex: 1,
    justifyContent: "center"
  },
  topMarginPaddedContainer: {
    marginTop: 3
  },
  interestImage: {
    width: 62,
    aspectRatio: 1,
    borderRadius: 62 / 2,
    marginRight: Layout.Margins.small,
    resizeMode: "contain"
  },
  titleText: {
    ...Styles.Text.secondaryH2,
    fontSize: 18,
    lineHeight: 18
  },
  subtitleText: {
    ...Styles.Text.bodyHero,
    ...Styles.Text.bodyTiny,
    color: Styles.Colours.black,
    fontWeight: "300",
    fontSize: 14,
    lineHeight: 14
  },
  withdrawButton: {
    ...Styles.Buttons.primary,
    backgroundColor: Styles.Colours.brownGrey,
    color: Styles.Colours.white,
    paddingHorizontal: Styles.Layout.Margins.medium,
    paddingVertical: Styles.Layout.Margins.small,
    alignSelf: "flex-end"
  },
  buttonWrapper: {
    marginLeft: Styles.Layout.Margins.small,
    justifyContent: "center"
  },
  date: {
    ...Styles.Text.bodyTiny,
    lineHeight: 12,
    fontWeight: "300"
  }
});
