// @flow

import type { ProjectFormProps } from "../../../../screens/projectForms";
import type { PendingRestorationMethodMetric } from "../../../../redux/wri-api/pitches";
import React, { Component } from "react";
import { ScrollView } from "react-native";
import { Navigation } from "react-native-navigation";
import ProjectFlowScreen from "../screen";
import translate from "../../../../locales/";
import ValidatedTextInput from "../../../common/validated-input";
import Validation from "../../../../utils/validation";
import { withSafeArea } from "react-native-safe-area";
import textInputProps from "../../../../constants/textInputProps";
import { PitchCreate, RestorationMethodMetricUpdate } from "wri-api";
import InputLabel from "../../../common/forms/input-label";
import Error from "../../../common/error";
import MetricCardList from "./metricList";
import { projectCreationNavigation, projectCreationNavigationEvents } from "../../../../utils/navigation";

type Props = {|
  /**
   * Automatically sent by RNN if mounted in a navigation stack
   */
  +componentId: string,

  /**
   * Values selected in the form up to this point
   */
  +form: $Shape<PitchCreate>,

  /**
   * Metadata about the form being modified
   */
  +formMetadata: ProjectFormProps,

  /**
   *
   */
  +metrics: { [string]: PendingRestorationMethodMetric },

  /**
   * Updates the saved form so that it can be resumed
   */
  +updateSavedForm: ($Shape<PitchCreate>) => void,

  /**
   * Updates the saved metrics so that it can be resumed
   */
  updateSavedMetric: (method: string, $Shape<RestorationMethodMetricUpdate>) => void
|};

const SafeAreaView = withSafeArea(ScrollView, "padding", "bottom");

export default class PitchMetricsScreen extends Component<Props> {
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

  _onMetricChanged = (method: string, metric: $Shape<RestorationMethodMetricUpdate>) => {
    this.props.updateSavedMetric(method, metric);
  };

  _updateFormField = (text: number) => {
    this.props.updateSavedForm({
      estimated_timespan: text
    });
  };

  render() {
    const isSpanValid = Validation.timeSpan.validate(this.props.form.estimated_timespan);
    const areAllRequiredMetricsValid = Validation.allMetricsValid.validate(
      this.props.metrics,
      this.props.form?.restoration_methods ?? []
    );
    const allInputsValid = isSpanValid && areAllRequiredMetricsValid;

    return (
      <ProjectFlowScreen
        componentId={this.props.componentId}
        formMetadata={this.props.formMetadata}
        scrollComponent={SafeAreaView}
        keyboard
        header={translate("createPitch.details.restorationMethod.title", "Project Metrics")}
        subtext={translate("createPitch.details.restorationMethod.help", "TODO BE ADDED 12")}
        isNextButtonEnabled={allInputsValid}
      >
        <InputLabel title={translate("createPitch.details.timespan", "Project Time Span")} />
        <ValidatedTextInput
          key="project-metrics-span-input"
          ref="project-metrics-span-input"
          placeholder={translate("createPitch.details.timespanHelp", "Project Time Span")}
          valid={isSpanValid}
          value={this.props.form.estimated_timespan}
          message={Validation.timeSpan.errorString(this.props.form.estimated_timespan)}
          onChangeText={this._updateFormField}
          onBlur={this.props.formMetadata.syncDraft}
          returnKeyType="done"
          {...textInputProps.integer}
        />
        <MetricCardList
          formMetadata={this.props.formMetadata}
          items={(this.props.form?.restoration_methods ?? [])
            .map(method => this.props.metrics[method]?.data)
            .filter(metric => !!metric)}
          onItemChanged={this._onMetricChanged}
        />

        {!allInputsValid && (
          <Error
            error={Validation.allMetricsValid.errorString(
              this.props.metrics,
              this.props.form?.restoration_methods ?? []
            )}
          />
        )}
      </ProjectFlowScreen>
    );
  }
}
