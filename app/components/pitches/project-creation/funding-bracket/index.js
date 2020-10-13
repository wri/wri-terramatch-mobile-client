// @flow

import type { AsyncState } from "../../../../redux/redux.types";
import type { ProjectFormProps } from "../../../../screens/projectForms";
import React, { Component } from "react";
import { Navigation } from "react-native-navigation";
import ProjectFlowScreen from "../screen";
import translate, { translateFundingBracket } from "../../../../locales";
import Validation from "../../../../utils/validation";
import { FundingBracketReadAll } from "wri-api";
import textInputProps from "../../../../constants/textInputProps";
import Picker from "../../../common/picker";
import InputLabel from "../../../common/forms/input-label";
import ValidatedTextInput from "../../../common/validated-input";
import { projectCreationNavigation, projectCreationNavigationEvents } from "../../../../utils/navigation";

type Props = {|
  /**
   * Automatically sent by RNN if mounted in a navigation stack
   */
  +componentId: string,

  /**
   * Metadata about the form being modified
   */
  +formMetadata: ProjectFormProps,

  +fundingBracketsState: AsyncState<FundingBracketReadAll>,

  /**
   * Values that are selected in this screen
   */
  +fundingBracket: ?string,

  /**
   * The funding amount that should be displayed on the form
   */
  +fundingAmount: ?number,

  /**
   * Updates the funding amount so that it can be saved
   */
  +updateFundingAmount: number => void,

  /**
   * Updates the funding bracket value
   */
  +updateFundingBracket: (?string) => void
|};

export default class FundingBracketScreen extends Component<Props> {
  static options(passProps: { formMetadata: ProjectFormProps }) {
    return {
      ...projectCreationNavigation(passProps.formMetadata)
    };
  }

  constructor(props: Props) {
    super(props);
    Navigation.events().bindComponent(this);
  }

  navigationButtonPressed(event: any) {
    projectCreationNavigationEvents(event.buttonId, this.props.formMetadata);
  }

  _updateFormField = (text: any) => {
    this.props.updateFundingAmount(text);
  };

  handleChangePitchFundingBracket = (val: any) => {
    this.props.updateFundingBracket(val);
    this.props.formMetadata.syncDraft();
  };

  render() {
    //The field is not mandatory for offers
    const isFundingAmountValid =
      Validation.funding.validate(this.props.fundingAmount) || this.props.formMetadata.type === "offer";
    const isFundingBracketValid = Validation.fundingBracket.validate(this.props.fundingBracket);
    const projectTypeKey = this.props.formMetadata.type === "offer" ? "createOffer" : "createPitch";
    const allInputsValid = isFundingAmountValid && isFundingBracketValid;

    return (
      <ProjectFlowScreen
        componentId={this.props.componentId}
        formMetadata={this.props.formMetadata}
        keyboard
        header={translate(`${projectTypeKey}.details.fundingBracket`)}
        subtext={translate(`${projectTypeKey}.details.fundingBracketHelp`)}
        isNextButtonEnabled={allInputsValid}
      >
        <InputLabel title={translate(`${projectTypeKey}.details.fundingBracket`)} required />
        <Picker
          placeholder={{ label: translate(`${projectTypeKey}.details.fundingBracket`), value: null }}
          value={this.props.fundingBracket}
          onValueChange={this.handleChangePitchFundingBracket}
          items={(this.props.fundingBracketsState.data ?? []).map(item => ({
            label: translateFundingBracket(item.bracket),
            value: item.bracket
          }))}
          fullBorder
        />

        <InputLabel
          title={translate(`${projectTypeKey}.details.fundingAmount`)}
          required={this.props.formMetadata.type === "pitch"}
        />
        <ValidatedTextInput
          key="project-funding-input"
          ref="project-funding-input"
          placeholder={translate(`${projectTypeKey}.details.fundingAmount`)}
          valid={isFundingAmountValid}
          value={this.props.fundingAmount}
          message={Validation.funding.errorString(this.props.fundingAmount)}
          onChangeText={this._updateFormField.bind(this)}
          onBlur={this.props.formMetadata.syncDraft}
          returnKeyType="done"
          {...textInputProps.integer}
        />
      </ProjectFlowScreen>
    );
  }
}
