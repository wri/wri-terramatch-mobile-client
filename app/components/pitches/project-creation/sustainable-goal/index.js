// @flow

import type { AsyncState } from "../../../../redux/redux.types";
import type { ProjectFormProps } from "../../../../screens/projectForms";
import React, { Component } from "react";
import { Navigation } from "react-native-navigation";
import PropTypes from "prop-types";
import TouchableCheckboxes from "../../../common/touchable-checkboxes";
import ProjectFlowScreen from "../screen";
import translate, { translateSustainableDevelopmentGoal } from "../../../../locales";
import { SustainableDevelopmentGoalReadAll } from "wri-api";
import WRICategoryImages from "../../../common/touchable-checkboxes/images";
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
  +sustainableGoalState: AsyncState<SustainableDevelopmentGoalReadAll>,

  /**
   * Values that are selected in this screen
   */
  +selectedValues: Array<string>,

  /**
   * Updates the selected data values
   */
  +updateSelectedValues: (Array<string>) => void
|};

export default class SustainableGoalScreen extends Component<Props> {
  static options(passProps: { formMetadata: ProjectFormProps }) {
    return {
      ...projectCreationNavigation(passProps.formMetadata)
    };
  }
  static propTypes = {
    /**
     * Automatically sent by RNN if mounted in a navigation stack
     */
    componentId: PropTypes.string.isRequired
  };

  constructor(props: Props) {
    super(props);
    Navigation.events().bindComponent(this);
  }

  navigationButtonPressed(event: any) {
    projectCreationNavigationEvents(event.buttonId, this.props.formMetadata);
  }

  _updateState = text => {
    const current = this.props.selectedValues;
    const itemAlreadyExists = current.includes(text);
    if (itemAlreadyExists) {
      this.props.updateSelectedValues(current.filter(item => item !== text));
    } else {
      this.props.updateSelectedValues([...current, text]);
    }
    this.props.formMetadata.syncDraft();
  };

  render() {
    const projectTypeKey = this.props.formMetadata.type === "offer" ? "createOffer" : "createPitch";

    return (
      <ProjectFlowScreen
        componentId={this.props.componentId}
        formMetadata={this.props.formMetadata}
        keyboard
        header={translate(`${projectTypeKey}.details.sustDevGoals`)}
        subtext={translate(`${projectTypeKey}.details.sustDevGoalsHelp`)}
        isNextButtonEnabled={true}
      >
        <TouchableCheckboxes
          items={(this.props.sustainableGoalState.data ?? []).map(item => ({
            key: item.goal ?? "",
            label: translateSustainableDevelopmentGoal(item.goal),
            image: WRICategoryImages.goal[item.goal]
          }))}
          selectedItems={this.props.selectedValues}
          onPress={this._updateState}
        />
      </ProjectFlowScreen>
    );
  }
}
