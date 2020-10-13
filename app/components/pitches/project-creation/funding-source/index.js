// @flow

import type { AsyncState } from "../../../../redux/redux.types";
import type { ProjectFormProps } from "../../../../screens/projectForms";
import React, { Component } from "react";
import { Navigation } from "react-native-navigation";
import TouchableCheckboxes from "../../../common/touchable-checkboxes";
import ProjectFlowScreen from "../screen";
import translate, { translateFundingSource } from "../../../../locales";
import Validation from "../../../../utils/validation";
import { FundingSourceReadAll } from "wri-api";
import { projectCreationNavigation, projectCreationNavigationEvents } from "../../../../utils/navigation";
import WRICategoryImages from "../../../../components/common/touchable-checkboxes/images";

type Props = {|
  /**
   * Automatically sent by RNN if mounted in a navigation stack
   */
  +componentId: string,
  /**
   * Metadata about the form being modified
   */
  +formMetadata: ProjectFormProps,

  +fundingSourcesState: AsyncState<FundingSourceReadAll>,

  /**
   * Values that are selected in this screen
   */
  +selectedValues: Array<string>,

  /**
   * Updates the selected data values
   */
  +updateSelectedValues: (Array<string>) => void
|};

export default class FundingSourceScreen extends Component<Props> {
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
    const isFundingSourceValid = Validation.fundingSource.validate(this.props.selectedValues);
    const projectTypeKey = this.props.formMetadata.type === "offer" ? "createOffer" : "createPitch";

    return (
      <ProjectFlowScreen
        componentId={this.props.componentId}
        formMetadata={this.props.formMetadata}
        keyboard
        header={translate(`${projectTypeKey}.details.fundingSources`)}
        subtext={translate(`${projectTypeKey}.details.fundingSourcesHelp`)}
        isNextButtonEnabled={isFundingSourceValid}
      >
        <TouchableCheckboxes
          items={(this.props.fundingSourcesState.data ?? []).map(item => ({
            key: item.source ?? "",
            label: translateFundingSource(item.source),
            image: WRICategoryImages.source[item.source]
          }))}
          selectedItems={this.props.selectedValues}
          onPress={this._updateState}
        />
      </ProjectFlowScreen>
    );
  }
}
