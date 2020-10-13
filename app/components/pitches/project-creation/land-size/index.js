// @flow

import type { AsyncState } from "../../../../redux/redux.types";
import type { ProjectFormProps } from "../../../../screens/projectForms";
import React, { Component } from "react";
import { Navigation } from "react-native-navigation";
import { LandSizeReadAll } from "wri-api";
import TouchableCheckboxes from "../../../common/touchable-checkboxes";
import ProjectFlowScreen from "../screen";
import translate, { translateLandSize } from "../../../../locales";
import Validation from "../../../../utils/validation";
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

  +landSizesState: AsyncState<LandSizeReadAll>,

  /**
   * The currently selected land size
   */
  +selectedValue: ?string,

  /**
   * Callback invoked when the land size value changes
   */
  +updateSelectedValue: (?string) => void
|};

export default class PitchLandSizeScreen extends Component<Props> {
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
    const current = this.props.selectedValue ?? "";
    const itemAlreadyExists = current === text;
    if (itemAlreadyExists) {
      this.props.updateSelectedValue(null);
    } else {
      this.props.updateSelectedValue(text);
    }
    this.props.formMetadata.syncDraft();
  };

  render() {
    const isLandSizeValid = Validation.landSize.validate(this.props.selectedValue);
    const projectTypeKey = this.props.formMetadata.type === "offer" ? "createOffer" : "createPitch";

    return (
      <ProjectFlowScreen
        componentId={this.props.componentId}
        formMetadata={this.props.formMetadata}
        keyboard
        header={translate(`${projectTypeKey}.details.landSize`)}
        subtext={translate(`${projectTypeKey}.details.landSizeHelp`)}
        isNextButtonEnabled={isLandSizeValid}
      >
        <TouchableCheckboxes
          items={(this.props.landSizesState.data ?? []).map(item => ({
            key: item.size ?? "",
            label: translateLandSize(item.size),
            image: WRICategoryImages.size[item.size]
          }))}
          selectedItems={this.props.selectedValue ? [this.props.selectedValue] : []}
          onPress={this._updateState}
        />
      </ProjectFlowScreen>
    );
  }
}
