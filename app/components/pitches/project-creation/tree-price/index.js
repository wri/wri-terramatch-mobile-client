// @flow

import type { ProjectFormProps } from "../../../../screens/projectForms";
import React, { Component } from "react";
import { Text } from "react-native";
import { Navigation } from "react-native-navigation";
import ProjectFlowScreen from "../screen";
import translate from "../../../../locales";
import ValidatedTextInput from "../../../common/validated-input";
import Validation from "../../../../utils/validation";
import textInputProps from "../../../../constants/textInputProps";
import InputLabel from "../../../common/forms/input-label";
import Styles from "../../../../styles";
import { projectCreationNavigation, projectCreationNavigationEvents } from "../../../../utils/navigation";

type Props = {|
  /**
   * Automatically sent by RNN if mounted in a navigation stack
   */
  +componentId: string,

  /**
   * The funding amount that should be displayed on the form
   */
  +totalPricePerTree: ?number,

  /**
   * Metadata about the form being modified
   */
  +formMetadata: ProjectFormProps,

  /**
   * Updates the funding amount so that it can be saved
   */
  +updateTotalPricePerTree: number => void
|};

export default class Index extends Component<Props> {
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

  render() {
    //The field is not mandatory for offers
    const isPriceValid =
      Validation.treePrice.validate(this.props.totalPricePerTree) || this.props.formMetadata.type === "offer";
    return (
      <ProjectFlowScreen
        componentId={this.props.componentId}
        formMetadata={this.props.formMetadata}
        keyboard
        header={translate("createPitch.details.totalPricePerTree.title")}
        subtext={translate("createPitch.details.totalPricePerTree.subtitle")}
        isNextButtonEnabled={isPriceValid}
      >
        <InputLabel title={translate("createPitch.details.totalPricePerTree.inputTitle")} />
        <Text style={[Styles.Text.bodyHero, { marginTop: Styles.Layout.Margins.tiny }]}>
          {translate("createPitch.details.totalPricePerTree.footnote")}
        </Text>
        <ValidatedTextInput
          key="project-totalPricePerTree-input"
          ref="project-totalPricePerTree-input"
          placeholder={translate("createPitch.details.totalPricePerTree.inputTitle")}
          valid={isPriceValid}
          value={this.props.totalPricePerTree}
          message={Validation.funding.errorString(this.props.totalPricePerTree)}
          onChangeText={this.props.updateTotalPricePerTree}
          onBlur={this.props.formMetadata.syncDraft}
          returnKeyType="done"
          {...textInputProps.decimal}
        />
      </ProjectFlowScreen>
    );
  }
}
