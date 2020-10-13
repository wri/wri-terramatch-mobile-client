//@flow

import React, { Component } from "react";
import { View, StyleSheet, Text } from "react-native";
import Styles from "../../../../styles";
import { RestorationMethodMetricRead } from "wri-api";
import translate, { formatCurrency, formatNumber, translateRestorationMethod } from "../../../../locales";

type Props = {|
  metric: RestorationMethodMetricRead
|};

export default class RestorationMethods extends Component<Props> {
  renderTitle = (title: string) => {
    return (
      <View style={styles.dropdownSection}>
        <View style={styles.dropdownSectionTextView}>
          <Text style={styles.dropdownSectionText}>
            {title} {translate("project.metrics")}
          </Text>
        </View>
        <View style={styles.dropdownSectionBorderView}>
          <View style={styles.borderLine} />
        </View>
      </View>
    );
  };

  renderContent = () => {
    return (
      <View>
        {this.renderTitle(translateRestorationMethod(this.props.metric.restoration_method))}
        <Text style={styles.viewTitleText}>{translate("createPitch.details.restorationMethod.experience")}</Text>
        <Text style={styles.viewSubtitleText}>{formatNumber(this.props.metric.experience) ?? ""}</Text>
        <Text style={styles.viewTitleText}>{translate("createPitch.details.restorationMethod.landSize")}</Text>
        <Text style={styles.viewSubtitleText}>{formatNumber(this.props.metric.land_size) ?? ""}</Text>
        <Text style={styles.viewTitleText}>{translate("createPitch.details.restorationMethod.pricePerHectare")}</Text>
        <Text style={styles.viewSubtitleText}>{formatCurrency(this.props.metric.price_per_hectare)}</Text>
        <Text style={styles.viewTitleText}>{translate("createPitch.details.restorationMethod.biomassPerHectare")}</Text>
        <Text style={styles.viewSubtitleText}>{formatNumber(this.props.metric.biomass_per_hectare) ?? ""}</Text>
        <Text style={styles.viewTitleText}>{translate("createPitch.details.restorationMethod.carbonImpact")}</Text>
        <Text style={styles.viewSubtitleText}>{formatNumber(this.props.metric.carbon_impact) ?? ""}</Text>
        <Text style={styles.viewTitleText}>{translate("createPitch.details.restorationMethod.speciesImpacted")}</Text>
        <Text style={styles.viewSubtitleText}>{this.props.metric.species_impacted}</Text>
      </View>
    );
  };

  render() {
    return <View>{this.renderContent()}</View>;
  }
}

const styles = StyleSheet.create({
  borderLine: {
    borderColor: Styles.Colours.lightGrey,
    width: "100%",
    borderWidth: 0.5,
    alignSelf: "center"
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
  },
  dropdownSection: {
    flexDirection: "row",
    paddingVertical: Styles.Layout.Margins.medium
  },
  dropdownSectionTextView: {
    width: "60%",
    justifyContent: "center",
    alignItems: "flex-start"
  },
  dropdownSectionText: {
    ...Styles.Text.h4,
    ...Styles.Text.uppercase,
    fontSize: 16,
    paddingBottom: Styles.Layout.Margins.small
  },
  dropdownSectionBorderView: {
    width: "40%",
    justifyContent: "center",
    alignItems: "center"
  }
});
