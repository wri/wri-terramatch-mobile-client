// @flow

import type { ProjectFormProps } from "../../../../screens/projectForms";
import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import MetricCard from "./metricCard";
import { RestorationMethodMetricCreate, RestorationMethodMetricUpdate } from "wri-api";

type Props = {|
  /**
   * Metadata about the form being modified
   */
  +formMetadata: ProjectFormProps,

  items: Array<RestorationMethodMetricCreate | RestorationMethodMetricUpdate>,
  onItemChanged: (method: string, $Shape<RestorationMethodMetricUpdate>) => void,
  style?: any
|};

export default class MetricCardList extends Component<Props> {
  render() {
    const { items, onItemChanged, style } = this.props;
    return (
      <View style={[styles.viewWrapper, style]}>
        {items.map((item, index) => {
          const method = item.restoration_method;
          if (!method) {
            return null;
          }
          return (
            <MetricCard
              key={method}
              formMetadata={this.props.formMetadata}
              metric={item}
              onItemChanged={data => onItemChanged(method, data)}
            />
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewWrapper: {
    flex: 1,
    flexDirection: "column"
  }
});
