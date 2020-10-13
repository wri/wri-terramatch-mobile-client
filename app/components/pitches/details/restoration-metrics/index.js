//@flow

import type { AsyncState } from "../../../../redux/redux.types";
import React, { Component, type Node } from "react";
import { View, StyleSheet, Text } from "react-native";
import { PitchRead, RestorationMethodMetricVersionReadAll } from "wri-api";
import Styles from "../../../../styles";
import RestorationMetricCard from "./metricCard";
import translate, { formatNumber } from "../../../../locales";

type Props = {|
  metricsState: AsyncState<RestorationMethodMetricVersionReadAll>,
  pitch: PitchRead
|};

export default class RestorationMetrics extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  renderHeaderMetricMethods(): Node {
    return (
      <View>
        <Text style={styles.viewTitleText}>{translate("project.projectMetrics.timespan")}</Text>
        <Text style={styles.viewSubtitleText}>{formatNumber(this.props.pitch.estimated_timespan)}</Text>
      </View>
    );
  }

  renderMetricMethods(): Node {
    return (this.props.metricsState.data ?? []).map((item, index) => {
      const metric = item.data;

      if (!metric) {
        return null;
      }

      return <RestorationMetricCard key={metric.restoration_method} metric={metric} />;
    });
  }

  render() {
    return (
      <View style={styles.info}>
        {this.renderHeaderMetricMethods()}
        {this.renderMetricMethods()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  info: {
    paddingTop: Styles.Layout.Margins.small,
    paddingBottom: Styles.Layout.Margins.medium
  },
  viewTitleText: {
    ...Styles.Text.h4,
    fontSize: 20,
    color: Styles.Colours.brownGrey
  },
  viewSubtitleText: {
    ...Styles.Text.h4,
    fontSize: 20,
    paddingBottom: Styles.Layout.Margins.small
  }
});
