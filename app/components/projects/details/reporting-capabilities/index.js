//@flow

import type { AsyncState } from "../../../../redux/redux.types";
import React, { Component } from "react";
import { View, StyleSheet, Text } from "react-native";
import Styles from "../../../../styles";
import { OfferRead, PitchRead, ReportingFrequencyReadAll, ReportingLevelReadAll } from "wri-api";
import translate, { translateReportingFrequency, translateReportingLevel } from "../../../../locales";

type Props = {|
  project: PitchRead | OfferRead,
  reportingFrequency: AsyncState<ReportingFrequencyReadAll>,
  reportingLevel: AsyncState<ReportingLevelReadAll>
|};

export default class ReportingCapabilities extends Component<Props> {
  getNameOfReportingFrequency = (item: string) => {
    if (this.props.reportingFrequency.data) {
      const typeObject = this.props.reportingFrequency.data.find(it => it.frequency === item);
      if (typeObject) {
        return typeObject.name;
      }
    }
    return translate("mobile.common.unknown", "Unknown");
  };

  getNameOfReportingLevel = (item: string) => {
    if (this.props.reportingLevel.data) {
      const typeObject = this.props.reportingLevel.data.find(it => it.level === item);
      if (typeObject) {
        return typeObject.name;
      }
    }
    return translate("mobile.common.unknown", "Unknown");
  };

  render() {
    return (
      <View style={styles.info}>
        <Text style={styles.viewTitleText}>{translate("project.capabilities.frequency")}</Text>
        <Text style={styles.viewSubtitleText}>
          {translateReportingFrequency(this.props.project.reporting_frequency)}
        </Text>
        <Text style={styles.viewTitleText}>{translate("project.capabilities.level")}</Text>
        <Text style={styles.viewSubtitleText}>{translateReportingLevel(this.props.project.reporting_level)}</Text>
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
