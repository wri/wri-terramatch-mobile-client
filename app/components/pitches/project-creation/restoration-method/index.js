// @flow

import type { AsyncState } from "../../../../redux/redux.types";
import React, { Component } from "react";
import { Navigation } from "react-native-navigation";
import TouchableCheckboxes from "../../../common/touchable-checkboxes";
import ProjectFlowScreen from "../screen";
import translate, { translateRestorationMethod } from "../../../../locales";
import Validation from "../../../../utils/validation";
import type { ProjectFormProps } from "../../../../screens/projectForms";
import { RestorationMethodReadAll } from "wri-api";
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

  +restorationMethodsState: AsyncState<RestorationMethodReadAll>,

  /**
   * Values that are selected in this screen
   */
  +selectedValues: Array<string>,

  /**
   * Updates the selected data values
   */
  +updateSelectedValues: (Array<string>) => void
|};

export default class RestorationMethodScreen extends Component<Props> {
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
    const isRestorationMethodValid = Validation.restorationMethod.validate(this.props.selectedValues);
    const projectTypeKey = this.props.formMetadata.type === "offer" ? "createOffer" : "createPitch";

    return (
      <ProjectFlowScreen
        componentId={this.props.componentId}
        formMetadata={this.props.formMetadata}
        keyboard
        header={translate(`${projectTypeKey}.details.restorationMethods`)}
        subtext={translate(`${projectTypeKey}.details.restorationMethodsHelp`)}
        isNextButtonEnabled={isRestorationMethodValid}
      >
        <TouchableCheckboxes
          items={(this.props.restorationMethodsState.data ?? []).map(item => ({
            key: item.method ?? "",
            label: translateRestorationMethod(item.method),
            image: WRICategoryImages.method[item.method]
          }))}
          selectedItems={this.props.selectedValues}
          onPress={this._updateState}
        />
      </ProjectFlowScreen>
    );
  }
}
