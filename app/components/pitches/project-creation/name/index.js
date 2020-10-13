// @flow

import React, { Component } from "react";
import { ScrollView, StyleSheet } from "react-native";
import Styles from "../../../../styles";
import { Navigation } from "react-native-navigation";
import Screen from "../../../common/screen";
import Button from "../../../common/button";
import translate from "../../../../locales";
import ValidatedTextInput from "../../../common/validated-input";
import Validation from "../../../../utils/validation";
import { withSafeArea } from "react-native-safe-area";
import textInputProps from "../../../../constants/textInputProps";
import type { ProjectFormProps } from "../../../../screens/projectForms";
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
   * The name being displayed in the form
   */
  +name: ?string,

  /**
   * Updates the saved name so that it can be resumed
   */
  +updateName: string => void
|};

const SafeAreaView = withSafeArea(ScrollView, "padding", "bottom");

export default class PitchNameScreen extends Component<Props> {
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

  _onSubmit = () => {
    this.props.formMetadata.pushNextScreen(this.props.componentId);
  };

  render() {
    const isNameValid = Validation.projectName.validate(this.props.name);
    const projectTypeKey = this.props.formMetadata.type === "offer" ? "createOffer" : "createPitch";
    return (
      <Screen
        scrollComponent={SafeAreaView}
        secondary
        header={translate(`${projectTypeKey}.details.projectName`)}
        subtext={translate(`${projectTypeKey}.details.projectNameHelp`)}
      >
        <ValidatedTextInput
          placeholder={translate(`${projectTypeKey}.details.projectName`)}
          valid={isNameValid}
          value={this.props.name}
          message={Validation.projectName.errorString(this.props.name)}
          onChangeText={this.props.updateName}
          {...textInputProps.projectName}
        />

        <Button
          style={[styles.createButton, Styles.Buttons.quaternary]}
          onPress={this._onSubmit}
          title={translate(`${projectTypeKey}.${projectTypeKey}`)}
          enabled={isNameValid}
        />
      </Screen>
    );
  }
}
const styles = StyleSheet.create({
  createButton: {
    marginTop: 100
  }
});
