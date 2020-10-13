// @flow

import type { AsyncState } from "../../../../redux/redux.types";
import type { ProjectFormProps } from "../../../../screens/projectForms";
import type { PendingCarbonCertification } from "../../../../redux/wri-api/pitches";
import React, { Component } from "react";
import { ScrollView } from "react-native";
import { Navigation } from "react-native-navigation";
import translate, { translateCarbonCertificationType } from "../../../../locales";
import { withSafeArea } from "react-native-safe-area";
import CarbonList from "./carbonList";
import ProjectFlowScreen from "../screen";
import { projectCreationNavigation, projectCreationNavigationEvents } from "../../../../utils/navigation";

import { CarbonCertificationCreate, CarbonCertificationTypeReadAll } from "wri-api";

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
   * Updates the saved form so that it can be resumed
   */
  +updateSavedCarbonCertificate: CarbonCertificationCreate => void,
  +carbonTypesState: AsyncState<CarbonCertificationTypeReadAll>,
  +certificate: Array<PendingCarbonCertification>,
  +removeSavedCarbonCertificate: PendingCarbonCertification => void
|};

type State = {|
  +certificate: CarbonCertificationCreate
|};

const SafeAreaView = withSafeArea(ScrollView, "padding", "bottom");

export default class CarbonCertificateScreen extends Component<Props, State> {
  static options(passProps: { formMetadata: ProjectFormProps }) {
    return {
      ...projectCreationNavigation(passProps.formMetadata)
    };
  }

  constructor(props: Props) {
    super(props);
    Navigation.events().bindComponent(this);
    this.state = {
      certificate: new CarbonCertificationCreate()
    };
  }

  navigationButtonPressed(event: any) {
    projectCreationNavigationEvents(event.buttonId, this.props.formMetadata);
  }

  addCertificate = () => {
    this.props.updateSavedCarbonCertificate(this.state.certificate);
    this.props.formMetadata.syncDraft();

    this.setState({
      certificate: new CarbonCertificationCreate()
    });
  };

  _onCarbonCertUpdated = (certificate: CarbonCertificationCreate) => {
    this.setState({
      certificate: CarbonCertificationCreate.constructFromObject({
        pitch_id: null,
        type: certificate.type,
        other_value: certificate.type === "other" ? certificate.other_value : null,
        link: certificate.link
      })
    });
  };

  _removeCertificate = (species: PendingCarbonCertification) => {
    this.props.removeSavedCarbonCertificate(species);
    this.props.formMetadata.syncDraft();
  };

  render() {
    const formattedCarbonTypesList = (this.props.carbonTypesState?.data ?? []).map(({ name, type }) => ({
      label: translateCarbonCertificationType(type),
      value: type
    }));

    return (
      <ProjectFlowScreen
        componentId={this.props.componentId}
        formMetadata={this.props.formMetadata}
        scrollComponent={SafeAreaView}
        header={translate("createPitch.details.carbonCerts.title")}
        subtext={translate("createPitch.details.carbonCerts.help")}
        isNextButtonEnabled={true}
      >
        <CarbonList
          items={this.props.certificate}
          addItem={this.state.certificate}
          onItemUpdated={this._onCarbonCertUpdated}
          carbonTypes={formattedCarbonTypesList}
          newCertificatedAdded={this.addCertificate}
          removeCertificate={this._removeCertificate}
        />
      </ProjectFlowScreen>
    );
  }
}
