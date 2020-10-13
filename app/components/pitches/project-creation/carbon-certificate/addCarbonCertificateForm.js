// @flow

import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import Styles from "../../../../styles";
import InputLabel from "../../../../components/common/forms/input-label";
import translate from "../../../../locales";
import ValidatedTextInput from "../../../../components/common/validated-input";

import Validation from "../../../../utils/validation";
import Button from "../../../common/button";
import Picker from "../../../common/picker";
import { CarbonCertificationCreate } from "wri-api";
import textInputProps from "../../../../constants/textInputProps";

type Props = {|
  addItem: CarbonCertificationCreate,
  onItemUpdated: CarbonCertificationCreate => void,
  carbonTypes: Array<{ label: ?string, value: ?string }>,
  newCertificatedAdded: () => void
|};

class AddCarbonCertificateForm extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  _addFormField = (fieldName: any, text: any) => {
    this.props.onItemUpdated(
      CarbonCertificationCreate.constructFromObject(
        {
          [fieldName]: text
        },
        this.props.addItem
      )
    );
  };

  addCertificate = () => {
    if (this.props.newCertificatedAdded) {
      this.props.newCertificatedAdded();
    }
  };

  render() {
    const isLinkValid = this.props.addItem?.link ? Validation.carbonLink.validate(this.props.addItem.link) : false;
    const isOtherTypeValid =
      this.props.addItem?.type === "other" ? Validation.carbonOtherType.validate(this.props.addItem.other_value) : true;
    const isTypeValid = this.props.addItem?.type ? Validation.carbonType.validate(this.props.addItem.type) : false;

    const allInputsValid = isLinkValid && isOtherTypeValid && isTypeValid;

    return (
      <View>
        {this.props.addItem && (
          <>
            <InputLabel title={translate("createPitch.details.carbonCerts.type")} />

            <Picker
              placeholder={{
                label: translate("createPitch.details.carbonCerts.type"),
                value: null
              }}
              value={this.props.addItem.type}
              onValueChange={this._addFormField.bind(this, "type")}
              items={this.props.carbonTypes}
              fullBorder
            />

            {this.props.addItem.type === "other" && (
              <>
                <InputLabel title={translate("createPitch.details.carbonCerts.other_value", "Other")} required />
                <ValidatedTextInput
                  key="carbon-cert-other-input"
                  ref="carbon-cert-other-input"
                  placeholder={translate("createPitch.details.carbonCerts.other_value", "Other")}
                  valid={isOtherTypeValid}
                  value={this.props.addItem.other_value}
                  message={Validation.carbonOtherType.errorString(this.props.addItem.other_value ?? "")}
                  onChangeText={this._addFormField.bind(this, "other_value")}
                  onSubmitEditing={() => {
                    this.refs["carbon-cert-input"].focus();
                  }}
                  returnKeyType="next"
                  {...textInputProps.text}
                />
              </>
            )}

            <InputLabel title={translate("createPitch.details.carbonCerts.link")} />

            <ValidatedTextInput
              key="carbon-cert-input"
              ref="carbon-cert-input"
              placeholder={translate("createPitch.details.carbonCerts.link")}
              valid={isLinkValid}
              value={this.props.addItem.link}
              message={Validation.carbonLink.errorString(this.props.addItem.link ?? "")}
              onChangeText={this._addFormField.bind(this, "link")}
              {...textInputProps.website}
            />

            <Button
              enabled={allInputsValid}
              disabledStyle={styles.addButtonDisabled}
              style={styles.addButton}
              onPress={this.addCertificate}
              title={translate("mobile.createPitch.details.carbonCerts.add")}
            />
          </>
        )}
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

export default AddCarbonCertificateForm;
