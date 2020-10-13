// @flow

import type { ProjectFormProps } from "../../../../screens/projectForms";
import React, { Component, type ElementConfig } from "react";
import { Navigation } from "react-native-navigation";
import Screen from "../../../common/screen";
import ProgressBar from "../../../../containers/pitches/project-creation/progress-bar";
import translate from "../../../../locales";

type Props = {|
  ...ElementConfig<typeof Screen>,

  /**
   * Automatically sent by RNN if mounted in a navigation stack
   */
  +componentId: string,

  /**
   * Metadata about the form being modified
   */
  +formMetadata: ProjectFormProps
|};

export default class ProjectFlowScreen extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  _previousStep = () => {
    Navigation.pop(this.props.componentId);
  };

  render() {
    const { componentId, formMetadata, ...rest } = this.props;
    return (
      <Screen
        secondary
        onPreviousButtonPressed={this._previousStep}
        onNextButtonPressed={formMetadata.pushNextScreen.bind(this, componentId)}
        renderProgress={this.renderProgress}
        nextTitle={translate("common.next")}
        {...rest}
      />
    );
  }

  renderProgress = () => {
    return <ProgressBar formMetadata={this.props.formMetadata} />;
  };
}
