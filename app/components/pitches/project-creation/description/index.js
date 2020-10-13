// @flow

import React, { Component } from "react";
import { ScrollView, StyleSheet } from "react-native";
import Styles from "../../../../styles";
import { Navigation } from "react-native-navigation";
import InputLabel from "../../../common/forms/input-label";
import ValidatedTextInput from "../../../common/validated-input";
import translate from "../../../../locales";
import { withSafeArea } from "react-native-safe-area";
import type { ProjectFormProps } from "../../../../screens/projectForms";
import ProjectFlowScreen from "../screen";
import Validation from "../../../../utils/validation";
import textInputProps from "../../../../constants/textInputProps";
import { projectCreationNavigation, projectCreationNavigationEvents } from "../../../../utils/navigation";

type Props = {|
  /**
   * Automatically sent by RNN if mounted in a navigation stack
   */
  +componentId: string,

  /**
   * The ID of the project form that is being modified
   */
  +formMetadata: ProjectFormProps,

  /**
   * Updates the saved data so that it can be resumed
   */
  +updateDescription: string => void,

  /**
   * The data being displayed in the form
   */
  +description: ?string
|};

const SafeAreaView = withSafeArea(ScrollView, "padding", "bottom");

export default class PitchDescriptionScreen extends Component<Props> {
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
    const isDescriptionValid = Validation.offerDescription.validate(this.props.description ?? "");

    return (
      <ProjectFlowScreen
        componentId={this.props.componentId}
        formMetadata={this.props.formMetadata}
        scrollComponent={SafeAreaView}
        header={
          this.props.formMetadata.type === "offer"
            ? translate("createOffer.details.details")
            : translate("createPitch.details.details")
        }
        subtext={
          this.props.formMetadata.type === "offer"
            ? translate("createOffer.details.detailsHelp")
            : translate("createPitch.details.detailsHelp")
        }
        isNextButtonEnabled={isDescriptionValid}
      >
        <InputLabel title={translate("createOffer.details.description")} required />
        <ValidatedTextInput
          key="organisation-description-input"
          ref="organisation-description-input"
          placeholder={translate("createOffer.details.description")}
          valid={isDescriptionValid}
          value={this.props.description ?? ""}
          message={Validation.offerDescription.errorString(this.props.description ?? "")}
          onChangeText={this.props.updateDescription}
          style={styles.inputText}
          onBlur={this.props.formMetadata.syncDraft}
          {...textInputProps.multiLineText}
        />
      </ProjectFlowScreen>
    );
  }
}

const styles = StyleSheet.create({
  inputText: {
    height: 172,
    borderColor: Styles.Colours.border,
    borderWidth: 1,
    borderRadius: Styles.Layout.BorderRadius.small
  }
});
