// @flow

import React, { Component } from "react";
import { ScrollView, StyleSheet } from "react-native";
import Styles from "../../../../styles";
import { Navigation } from "react-native-navigation";
import ProjectFlowScreen from "../screen";
import InputLabel from "../../../common/forms/input-label";
import RadioButton from "../../../common/radio-button";
import translate from "../../../../locales";
import { withSafeArea } from "react-native-safe-area";
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
   * Updates the saved data so that it can be resumed
   */
  +updateEngagement: boolean => void,

  /**
   * The data being displayed in the form
   */
  +long_term_engagement: ?boolean
|};

const SafeAreaView = withSafeArea(ScrollView, "padding", "bottom");

const radio_options = [
  {
    key: true,
    text: translate("common.yes")
  },
  {
    key: false,
    text: translate("common.no")
  }
];

export default class PitchLongTermEngagementScreen extends Component<Props> {
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
    return (
      <ProjectFlowScreen
        componentId={this.props.componentId}
        formMetadata={this.props.formMetadata}
        scrollComponent={SafeAreaView}
        header={translate("createOffer.details.longTermEngagement")}
        isNextButtonEnabled={true}
      >
        <InputLabel title={translate("createOffer.details.longTermEngagementHelp")} />
        <RadioButton
          style={styles.radioInput}
          options={radio_options}
          selectedOption={this.props.long_term_engagement}
          onOptionsChanged={selection => {
            this.props.updateEngagement(selection);
            this.props.formMetadata.syncDraft();
          }}
        />
      </ProjectFlowScreen>
    );
  }
}

const styles = StyleSheet.create({
  radioInput: {
    marginBottom: Styles.Layout.Margins.small,
    paddingTop: Styles.Layout.Margins.tiny
  }
});
