// @flow

import type { AsyncState } from "../../../../redux/redux.types";
import type { ProjectFormProps } from "../../../../screens/projectForms";

import React, { Component } from "react";
import { Navigation } from "react-native-navigation";
import TouchableCheckboxes from "../../../common/touchable-checkboxes";
import ProjectFlowScreen from "../screen";
import translate, { translateRevenueDrivers } from "../../../../locales";
import { RevenueDriverReadAll } from "wri-api";
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

  +revenueDriversState: AsyncState<RevenueDriverReadAll>,

  /**
   * Values that are selected in this screen
   */
  +selectedValues: Array<string>,

  /**
   * Updates the selected data values
   */
  +updateSelectedValues: (Array<string>) => void
|};

export default class RevenueDriverScreen extends Component<Props> {
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
    return (
      <ProjectFlowScreen
        componentId={this.props.componentId}
        formMetadata={this.props.formMetadata}
        keyboard
        header={translate("createPitch.details.revenueDrivers")}
        subtext={translate("createPitch.details.revenueDriversHelp")}
        isNextButtonEnabled={true}
      >
        <TouchableCheckboxes
          items={(this.props.revenueDriversState.data ?? []).map(item => ({
            key: item.driver ?? "",
            label: translateRevenueDrivers(item.driver),
            image: WRICategoryImages.driver[item.driver]
          }))}
          selectedItems={this.props.selectedValues}
          onPress={this._updateState}
        />
      </ProjectFlowScreen>
    );
  }
}
