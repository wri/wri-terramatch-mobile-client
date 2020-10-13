//@flow

import React, { Component } from "react";
import { View, StyleSheet, Text } from "react-native";
import Styles from "../../../../styles";
import { OfferRead } from "wri-api";
import translate, { formatCurrency } from "../../../../locales/";

type Props = {|
  offer: OfferRead
|};
export default class FundingDetails extends Component<Props> {
  render() {
    return (
      <View style={styles.info}>
        <Text style={styles.viewTitleText}>{translate("project.funding.amount")}</Text>
        <Text style={styles.viewSubtitleText}>
          {formatCurrency(this.props.offer.funding_amount, { minimumFractionDigits: 0 })}
        </Text>
        <Text style={styles.viewTitleText}>{translate("project.funding.long_term_engagement")}</Text>
        <Text style={styles.viewSubtitleText}>
          {this.props.offer.long_term_engagement == null
            ? ""
            : this.props.offer.long_term_engagement
            ? translate("common.yes")
            : translate("common.no")}
        </Text>
        <Text style={styles.viewTitleText}>{translate("project.funding.average_price_tree")}</Text>
        <Text style={styles.viewSubtitleText}>{formatCurrency(this.props.offer.price_per_tree)}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewTitleText: {
    ...Styles.Text.h4,
    fontSize: 20,
    color: Styles.Colours.brownGrey
  },
  viewSubtitleText: {
    ...Styles.Text.h4,
    fontSize: 20,
    paddingBottom: Styles.Layout.Margins.small
  },
  info: {
    paddingTop: Styles.Layout.Margins.small,
    paddingBottom: Styles.Layout.Margins.medium
  }
});
