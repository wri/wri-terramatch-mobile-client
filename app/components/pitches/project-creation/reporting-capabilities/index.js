// @flow

import type { AsyncState } from "../../../../redux/redux.types";
import type { ProjectFormProps } from "../../../../screens/projectForms";
import React, { Component } from "react";
import { ScrollView } from "react-native";
import { Navigation } from "react-native-navigation";
import Picker from "../../../common/picker";
import ProjectFlowScreen from "../screen";
import translate, { translateReportingFrequency, translateReportingLevel } from "../../../../locales";
import Validation from "../../../../utils/validation";
import { withSafeArea } from "react-native-safe-area";
import { ReportingFrequencyReadAll, ReportingLevelReadAll } from "wri-api";
import InputLabel from "../../../common/forms/input-label";
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

  /**
   * Async state representing a request for the organisation types that should be shown in the picker on this screen
   */
  +pitchReportingFrequencyState: AsyncState<ReportingFrequencyReadAll>,

  /**
   * Async state representing a request for the organisation types that should be shown in the picker on this screen
   */
  +pitchReportingLevelState: AsyncState<ReportingLevelReadAll>,

  +selectedReportingFrequency: ?string,
  +selectedReportingLevel: ?string,

  +updateReportingFrequency: string => void,
  +updateReportingLevel: string => void
|};

const SafeAreaView = withSafeArea(ScrollView, "padding", "bottom");

export default class PitchCapabilitiesScreen extends Component<Props> {
  static options(passProps: { formMetadata: ProjectFormProps }) {
    return {
      ...projectCreationNavigation(passProps.formMetadata)
    };
  }

  constructor(props: Props) {
    super(props);
    Navigation.events().bindComponent(this);
    //this.state.pitch = props.initialForm;
  }

  navigationButtonPressed(event: any) {
    projectCreationNavigationEvents(event.buttonId, this.props.formMetadata);
  }

  handleChangePitchReportingLevel = (val: any) => {
    this.props.updateReportingLevel(val);
    this.props.formMetadata.syncDraft();
  };

  handleChangePitchReportingFrequency = (val: any) => {
    this.props.updateReportingFrequency(val);
    this.props.formMetadata.syncDraft();
  };

  render() {
    const reportingFrequencyListData = this.props.pitchReportingFrequencyState.data;
    const reportingLevelListData = this.props.pitchReportingLevelState.data;
    const isReportingFrequencyValid = Validation.reportingFrequency.validate(this.props.selectedReportingFrequency);
    const isReportingLevelValid = Validation.reportingLevel.validate(this.props.selectedReportingLevel);
    const allInputsValid = isReportingFrequencyValid && isReportingLevelValid;
    const projectTypeKey = this.props.formMetadata.type === "offer" ? "createOffer" : "createPitch";

    return (
      <ProjectFlowScreen
        componentId={this.props.componentId}
        formMetadata={this.props.formMetadata}
        scrollComponent={SafeAreaView}
        header={translate(`${projectTypeKey}.details.reporting`)}
        subtext={translate(`${projectTypeKey}.details.reportingHelp`)}
        isNextButtonEnabled={allInputsValid}
      >
        <InputLabel title={translate(`${projectTypeKey}.details.reportingFrequency`)} required />
        <Picker
          placeholder={{ label: translate(`${projectTypeKey}.details.reportingFrequency`), value: null }}
          value={this.props.selectedReportingFrequency}
          onValueChange={this.handleChangePitchReportingFrequency}
          items={(reportingFrequencyListData ?? []).map(item => ({
            label: translateReportingFrequency(item.frequency) ?? "Unknown",
            value: item.frequency
          }))}
          fullBorder
        />

        <InputLabel title={translate(`${projectTypeKey}.details.reportingLevel`)} required />
        <Picker
          placeholder={{ label: translate(`${projectTypeKey}.details.reportingLevel`), value: null }}
          value={this.props.selectedReportingLevel}
          onValueChange={this.handleChangePitchReportingLevel}
          items={(reportingLevelListData ?? []).map(item => ({
            label: translateReportingLevel(item.level) ?? "Unknown",
            value: item.level
          }))}
          fullBorder
        />
      </ProjectFlowScreen>
    );
  }
}
