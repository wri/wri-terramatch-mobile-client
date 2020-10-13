//@flow

import React, { Component } from "react";
import { View, StyleSheet, Text } from "react-native";
import Styles from "../../../../styles";
import { PitchRead } from "wri-api";
import translate, { formatCurrency, translateRevenueDrivers } from "../../../../locales";

type Props = {|
  pitch: PitchRead
|};

export default class Index extends Component<Props> {
  renderRevenueDrivers = (dataArray: Array<string>) => {
    const array = [];
    for (let i = 0; i < dataArray.length; i++) {
      const revDriver = translateRevenueDrivers(dataArray[i]);
      array.push(<Text style={styles.revDriverText}>{revDriver}</Text>);
    }
    return array;
  };

  render() {
    return (
      <View style={styles.info}>
        <Text style={styles.viewTitleText}>{translate("project.funding.amount")}</Text>
        <Text style={styles.viewSubtitleText}>
          {formatCurrency(this.props.pitch.funding_amount, { minimumFractionDigits: 0 })}
        </Text>
        <Text style={styles.viewTitleText}>{translate("project.funding.drivers")}</Text>
        {this.renderRevenueDrivers(this.props.pitch.revenue_drivers ?? [])}
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
  revDriverText: {
    ...Styles.Text.h4,
    fontSize: 20
  },
  info: {
    paddingTop: Styles.Layout.Margins.small,
    paddingBottom: Styles.Layout.Margins.medium
  }
});
