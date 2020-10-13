// @flow

import type { AsyncState } from "../../../../redux/redux.types";
import type { ProjectFormProps } from "../../../../screens/projectForms";
import React, { Component } from "react";
import { Navigation } from "react-native-navigation";
import TouchableCheckboxes from "../../../common/touchable-checkboxes";
import ProjectFlowScreen from "../screen";
import translate, { translateLandOwnership } from "../../../../locales";
import Validation from "../../../../utils/validation";
import { projectCreationNavigation, projectCreationNavigationEvents } from "../../../../utils/navigation";

import { LandOwnershipReadAll } from "wri-api";
import WRICategoryImages from "../../../common/touchable-checkboxes/images";

type Props = {|
  /**
   * Automatically sent by RNN if mounted in a navigation stack
   */
  +componentId: string,

  /**
   * Metadata about the form being modified
   */
  +formMetadata: ProjectFormProps,

  +landOwnershipTypesState: AsyncState<LandOwnershipReadAll>,

  /**
   * Values that are selected in this screen
   */
  +selectedValues: Array<string>,

  /**
   * Updates the selected data values
   */
  +updateSelectedValues: (Array<string>) => void
|};

export default class LandOwnershipScreen extends Component<Props> {
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
    const isLandOwnershipValid = Validation.landOwnership.validate(this.props.selectedValues);
    const projectTypeKey = this.props.formMetadata.type === "offer" ? "createOffer" : "createPitch";

    return (
      <ProjectFlowScreen
        componentId={this.props.componentId}
        formMetadata={this.props.formMetadata}
        keyboard
        header={translate(`${projectTypeKey}.details.landOwnership`)}
        subtext={translate(`${projectTypeKey}.details.landOwnershipHelp`)}
        isNextButtonEnabled={isLandOwnershipValid}
      >
        <TouchableCheckboxes
          items={(this.props.landOwnershipTypesState.data ?? []).map(item => ({
            key: item.ownership ?? "",
            label: translateLandOwnership(item.ownership),
            image: WRICategoryImages.ownership[item.ownership]
          }))}
          selectedItems={this.props.selectedValues}
          onPress={this._updateState}
        />
      </ProjectFlowScreen>
    );
  }
}
