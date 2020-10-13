// @flow

import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import Styles from "../../../../styles";
import InputLabel from "../../../../components/common/forms/input-label";
import translate from "../../../../locales";
import ValidatedTextInput from "../../../../components/common/validated-input";
import Checkbox from "../../../common/checkbox";
import Button from "../../../common/button";
import Validation from "../../../../utils/validation";
import { TreeSpeciesCreate } from "wri-api";
import textInputProps from "../../../../constants/textInputProps";
import { getTotalCost } from "../../../../api/wri/helpers";

type Props = {|
  item: TreeSpeciesCreate,
  onItemChanged: TreeSpeciesCreate => void,
  newSpecieAdded: () => void
|};

class AddTreeSpeciesForm extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  _updateFormField = (fieldName: any, text: any) => {
    this.props.onItemChanged(
      TreeSpeciesCreate.constructFromObject(
        {
          [fieldName]: text
        },
        this.props.item
      )
    );
  };

  _updateCheckboxState = checkboxName => {
    const prev = { ...this.props.item };
    this.props.onItemChanged(
      TreeSpeciesCreate.constructFromObject(
        {
          [checkboxName]: !prev[checkboxName]
        },
        this.props.item
      )
    );
  };

  addSpecie = () => {
    this.props.newSpecieAdded();
  };

  render() {
    const isTreeNameValid = Validation.treeName.validate(this.props.item.name);
    const isTreeSeasonValid = Validation.treeSeason.validate(this.props.item.season);
    const isTreeCountValid = Validation.treeCount.validate(this.props.item.count);
    const isPriceToPlantValid = Validation.treePrice.validate(this.props.item.price_to_plant);
    const isPriceToMaintainValid = Validation.treePrice.validate(this.props.item.price_to_maintain);
    const isSaplingPriceValid = Validation.treePrice.validate(this.props.item.saplings);
    const isSitePrepPriceValid = Validation.treePrice.validate(this.props.item.site_prep);
    const isSurvivalRateValid = Validation.survivalRate.validate(this.props.item.survival_rate);
    let treeCanProduceProducts = false;
    if (this.props.item.produces_timber || this.props.item.produces_food || this.props.item.produces_firewood) {
      treeCanProduceProducts = true;
    }
    const isOwnerValid = Validation.treeOwner.validate(this.props.item.owner, treeCanProduceProducts);
    const allInputsValid =
      isTreeNameValid &&
      isTreeCountValid &&
      isPriceToPlantValid &&
      isPriceToMaintainValid &&
      isSaplingPriceValid &&
      isSitePrepPriceValid &&
      isSurvivalRateValid &&
      isOwnerValid;

    return (
      <View style={{ marginTop: Styles.Layout.Margins.large }}>
        <InputLabel title={translate("createPitch.details.treeSpecies.name")} />
        <ValidatedTextInput
          ref="project-tree-species-name"
          valid={isTreeNameValid}
          message={Validation.treeName.errorString(this.props.item.name)}
          placeholder={translate("createPitch.details.treeSpecies.name")}
          value={this.props.item.name}
          onChangeText={this._updateFormField.bind(this, "name")}
        />

        <Checkbox
          isSelected={this.props.item.is_native}
          onPress={this._updateCheckboxState.bind(this, "is_native")}
          checkboxLabel={translate("createPitch.details.treeSpecies.isNative")}
        />

        <InputLabel title={translate("createPitch.details.treeSpecies.season")} />
        <ValidatedTextInput
          ref="project-tree-species-season"
          valid={isTreeSeasonValid}
          message={Validation.treeSeason.errorString(this.props.item.season)}
          placeholder={translate("createPitch.details.treeSpecies.season")}
          value={this.props.item.season}
          onSubmitEditing={() => {
            this.refs["project-tree-species-number"].focus();
          }}
          onChangeText={this._updateFormField.bind(this, "season")}
          returnKeyType="next"
        />

        <InputLabel title={translate("createPitch.details.treeSpecies.count")} />
        <ValidatedTextInput
          ref="project-tree-species-number"
          valid={isTreeCountValid}
          placeholder={translate("createPitch.details.treeSpecies.count")}
          value={this.props.item.count}
          message={Validation.treeCount.errorString(this.props.item.count)}
          onChangeText={this._updateFormField.bind(this, "count")}
          onSubmitEditing={() => {
            this.refs["project-tree-species-plant"].focus();
          }}
          returnKeyType="done"
          {...textInputProps.integer}
        />

        <InputLabel title={translate("createPitch.details.treeSpecies.priceToPlant")} />
        <ValidatedTextInput
          ref="project-tree-species-plant"
          valid={isPriceToPlantValid}
          placeholder={translate("createPitch.details.treeSpecies.priceToPlant")}
          value={this.props.item.price_to_plant}
          message={Validation.treePrice.errorString(this.props.item.price_to_plant)}
          onChangeText={this._updateFormField.bind(this, "price_to_plant")}
          onSubmitEditing={() => {
            this.refs["project-tree-species-maintain"].focus();
          }}
          returnKeyType="done"
          {...textInputProps.decimal}
        />

        <InputLabel title={translate("createPitch.details.treeSpecies.priceToMaintain")} />
        <ValidatedTextInput
          ref="project-tree-species-maintain"
          valid={isPriceToMaintainValid}
          placeholder={translate("createPitch.details.treeSpecies.priceToMaintain")}
          value={this.props.item.price_to_maintain}
          message={Validation.treePrice.errorString(this.props.item.price_to_maintain)}
          onChangeText={this._updateFormField.bind(this, "price_to_maintain")}
          onSubmitEditing={() => {
            this.refs["project-tree-species-sapling"].focus();
          }}
          returnKeyType="done"
          {...textInputProps.decimal}
        />
        <InputLabel title={translate("createPitch.details.treeSpecies.saplings")} />
        <ValidatedTextInput
          ref="project-tree-species-sapling"
          valid={isSaplingPriceValid}
          placeholder={translate("createPitch.details.treeSpecies.saplings")}
          value={this.props.item.saplings}
          message={Validation.treePrice.errorString(this.props.item.saplings)}
          onChangeText={this._updateFormField.bind(this, "saplings")}
          onSubmitEditing={() => {
            this.refs["project-tree-species-site-prep"].focus();
          }}
          returnKeyType="done"
          {...textInputProps.decimal}
        />
        <InputLabel title={translate("createPitch.details.treeSpecies.sitePrep")} />
        <ValidatedTextInput
          ref="project-tree-species-site-prep"
          valid={isSitePrepPriceValid}
          placeholder={translate("createPitch.details.treeSpecies.sitePrep")}
          value={this.props.item.site_prep}
          message={Validation.treePrice.errorString(this.props.item.site_prep)}
          onChangeText={this._updateFormField.bind(this, "site_prep")}
          onSubmitEditing={() => {
            this.refs["project-tree-species-survial-rate"].focus();
          }}
          returnKeyType="done"
          {...textInputProps.decimal}
        />

        <InputLabel title={translate("createPitch.details.treeSpecies.totalPricePerTree")} />
        <ValidatedTextInput
          valid={true}
          placeholder={translate("createPitch.details.treeSpecies.totalPricePerTree")}
          value={getTotalCost(this.props.item)}
          editable={false}
          returnKeyType="done"
          {...textInputProps.decimal}
        />

        <InputLabel title={translate("createPitch.details.treeSpecies.survivalRate")} />
        <ValidatedTextInput
          ref="project-tree-species-survial-rate"
          valid={isSurvivalRateValid}
          message={Validation.survivalRate.errorString(this.props.item.survival_rate)}
          placeholder={translate("createPitch.details.treeSpecies.survivalRate")}
          value={this.props.item.survival_rate}
          onChangeText={this._updateFormField.bind(this, "survival_rate")}
          returnKeyType="done"
          {...textInputProps.integer}
        />

        <Checkbox
          isSelected={this.props.item.produces_food ?? false}
          onPress={this._updateCheckboxState.bind(this, "produces_food")}
          checkboxLabel={translate("createPitch.details.treeSpecies.produces_food")}
        />
        <Checkbox
          isSelected={this.props.item.produces_firewood ?? false}
          onPress={this._updateCheckboxState.bind(this, "produces_firewood")}
          checkboxLabel={translate("createPitch.details.treeSpecies.produces_firewood")}
        />
        <Checkbox
          isSelected={this.props.item.produces_timber ?? false}
          onPress={this._updateCheckboxState.bind(this, "produces_timber")}
          checkboxLabel={translate("createPitch.details.treeSpecies.produces_timber")}
        />

        <InputLabel title={translate("createPitch.details.treeSpecies.owner")} />
        <ValidatedTextInput
          ref="project-tree-species-owner"
          valid={isOwnerValid}
          message={Validation.treeOwner.errorString(this.props.item.owner, treeCanProduceProducts)}
          placeholder={translate("createPitch.details.treeSpecies.owner")}
          value={this.props.item.owner}
          onChangeText={this._updateFormField.bind(this, "owner")}
        />

        <Button
          enabled={allInputsValid}
          disabledStyle={styles.addButtonDisabled}
          style={styles.addButton}
          onPress={this.addSpecie}
          title={translate("mobile.createPitch.details.treeSpecies.add")}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  addButton: {
    ...Styles.Buttons.reversePrimary,
    marginTop: Styles.Layout.Margins.medium,
    alignSelf: "center"
  },
  addButtonDisabled: {
    ...Styles.Buttons.centeredPrimaryButtonDisabled,
    marginTop: Styles.Layout.Margins.medium
  }
});

export default AddTreeSpeciesForm;
