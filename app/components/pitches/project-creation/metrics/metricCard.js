// @flow

import type { ProjectFormProps } from "../../../../screens/projectForms";
import React, { Component } from "react";
import { StyleSheet, View, Text, Linking } from "react-native";
import Styles from "../../../../styles";
import InputLabel from "../../../../components/common/forms/input-label";
import translate, { translateRestorationMethod } from "../../../../locales";
import ValidatedTextInput from "../../../../components/common/validated-input";
import Validation from "../../../../utils/validation";
import { RestorationMethodMetricCreate, RestorationMethodMetricUpdate } from "wri-api";
import textInputProps from "../../../../constants/textInputProps";
import DynamicList from "../../../common/forms/list";

type Props = {|
  /**
   * Metadata about the form being modified
   */
  +formMetadata: ProjectFormProps,

  +metric: RestorationMethodMetricCreate | RestorationMethodMetricUpdate,
  +onItemChanged: ($Shape<RestorationMethodMetricUpdate>) => void
|};

class MetricCard extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  _handleChange = (propName: $Keys<RestorationMethodMetricUpdate>, text: any) => {
    this.props.onItemChanged({
      [propName]: text
    });
  };

  render() {
    const metric = this.props.metric;

    const isYearExperienceValid = Validation.yearExperience.validate(metric.experience);
    const isHectaresValid = Validation.hectareLand.validate(metric.land_size);
    const isPriceValid = Validation.hectarePrice.validate(metric.price_per_hectare);
    const isBiomassValid = Validation.biomass.validate(metric.biomass_per_hectare);
    const isCarbonValid = Validation.carbon.validate(metric.carbon_impact);

    return (
      <View style={{ marginTop: Styles.Layout.Margins.large }}>
        <InputLabel style={styles.center} title={translateRestorationMethod(metric.restoration_method)} />

        <InputLabel
          title={translate("createPitch.details.restorationMethod.experience", "Years Of Experience")}
          required
        />
        <ValidatedTextInput
          ref="project-metrics-year-input"
          placeholder={translate("createPitch.details.restorationMethod.experience", "Years Of Experience")}
          valid={isYearExperienceValid}
          value={metric.experience}
          message={Validation.yearExperience.errorString(metric.experience)}
          onChangeText={this._handleChange.bind(this, "experience")}
          onBlur={this.props.formMetadata.syncDraft}
          onSubmitEditing={() => {
            this.refs["project-metrics-land-input"].focus();
          }}
          returnKeyType="done"
          {...textInputProps.integer}
        />

        <InputLabel title={translate("createPitch.details.restorationMethod.landSize", "Hectares of Land")} required />
        <ValidatedTextInput
          ref="project-metrics-land-input"
          placeholder={translate("createPitch.details.restorationMethod.landSize", "Hectares of Land")}
          valid={isHectaresValid}
          value={metric.land_size}
          message={Validation.hectareLand.errorString(metric.land_size)}
          onChangeText={this._handleChange.bind(this, "land_size")}
          onBlur={this.props.formMetadata.syncDraft}
          onSubmitEditing={() => {
            this.refs["project-metrics-price-input"].focus();
          }}
          returnKeyType="done"
          {...textInputProps.decimal}
        />

        <InputLabel
          title={translate("createPitch.details.restorationMethod.pricePerHectare", "Price per Hectare")}
          required
        />
        <ValidatedTextInput
          ref="project-metrics-price-input"
          placeholder={translate("createPitch.details.restorationMethod.pricePerHectare", "Price per Hectare")}
          valid={isPriceValid}
          value={metric.price_per_hectare}
          message={Validation.hectarePrice.errorString(metric.price_per_hectare)}
          onChangeText={this._handleChange.bind(this, "price_per_hectare")}
          onBlur={this.props.formMetadata.syncDraft}
          onSubmitEditing={() => {
            this.refs["project-metrics-biomass-input"].focus();
          }}
          returnKeyType="done"
          {...textInputProps.decimal}
        />

        <InputLabel
          title={translate("createPitch.details.restorationMethod.biomassPerHectare", "Biomass per Hectare")}
        />
        <ValidatedTextInput
          ref="project-metrics-biomass-input"
          placeholder={translate("createPitch.details.restorationMethod.biomassPerHectare", "Biomass per Hectare")}
          valid={isBiomassValid}
          value={metric.biomass_per_hectare}
          message={Validation.biomass.errorString(metric.biomass_per_hectare)}
          onChangeText={this._handleChange.bind(this, "biomass_per_hectare")}
          onBlur={this.props.formMetadata.syncDraft}
          onSubmitEditing={() => {
            this.refs["project-metrics-carbon-input"].focus();
          }}
          returnKeyType="done"
          {...textInputProps.decimal}
        />

        <InputLabel title={translate("createPitch.details.restorationMethod.carbonImpact", "Carbon impacted")} />
        <ValidatedTextInput
          ref="project-metrics-carbon-input"
          placeholder={translate("createPitch.details.restorationMethod.carbonImpact", "Carbon impacted")}
          valid={isCarbonValid}
          value={metric.carbon_impact}
          message={Validation.carbon.errorString(metric.carbon_impact)}
          onChangeText={this._handleChange.bind(this, "carbon_impact")}
          onBlur={this.props.formMetadata.syncDraft}
          returnKeyType="done"
          {...textInputProps.decimal}
        />

        <InputLabel
          title={translate("createPitch.details.restorationMethod.speciesImpacted", "Biodiversity impacts")}
        />
        <Text style={Styles.Text.h6}>{translate("createPitch.details.restorationMethod.speciesImpactedHelp")}</Text>

        <Text style={[Styles.Text.h6, styles.underline]} onPress={() => Linking.openURL("https://www.iucnredlist.org")}>
          {/* eslint-disable-next-line react/jsx-no-literals */}
          {"https://www.iucnredlist.org/"}
        </Text>
        <DynamicList
          list={metric.species_impacted ?? []}
          onListChanged={list => {
            this._handleChange("species_impacted", list);
            this.props.formMetadata.syncDraft();
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignSelf: "center"
  },
  underline: { textDecorationLine: "underline" }
});
export default MetricCard;
