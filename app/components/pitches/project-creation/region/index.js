// @flow

import type { ProjectFormProps } from "../../../../screens/projectForms";
import React, { Component } from "react";
import { ScrollView } from "react-native";
import { Navigation } from "react-native-navigation";
import { ContinentReadAll, CountryReadAll } from "wri-api";
import Picker from "../../../common/picker";
import ProjectFlowScreen from "../screen";
import translate, { translateContinent, translateCountry } from "../../../../locales";
import Validation from "../../../../utils/validation";
import { withSafeArea } from "react-native-safe-area";
import InputLabel from "../../../common/forms/input-label";
import { projectCreationNavigation, projectCreationNavigationEvents } from "../../../../utils/navigation";

type Props = {|
  /**
   * Automatically sent by RNN if mounted in a navigation stack
   */
  +componentId: string,

  +continents: ContinentReadAll,

  +countries: CountryReadAll,

  /**
   * Metadata about the form being modified
   */
  +formMetadata: ProjectFormProps,

  +selectedContinent: ?string,
  +selectedCountry: ?string,

  +updateContinent: string => void,
  +updateCountry: string => void
|};

const SafeAreaView = withSafeArea(ScrollView, "padding", "bottom");

export default class PitchRegionScreen extends Component<Props> {
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

  handleChangeContinent = (val: any) => {
    this.props.updateContinent(val);
    this.props.formMetadata.syncDraft();
  };

  handleChangeCountry = (val: any) => {
    this.props.updateCountry(val);
    this.props.formMetadata.syncDraft();
  };

  render() {
    const isCountryValid = Validation.country.validate(this.props.selectedCountry);
    const isContinentValid = Validation.continent.validate(this.props.selectedContinent);
    //For offer creation flow, only country field is non-mandatory
    const allInputsValid =
      this.props.formMetadata.type === "offer" ? isContinentValid : isCountryValid && isContinentValid;
    const projectTypeKey = this.props.formMetadata.type === "offer" ? "createOffer" : "createPitch";

    const continentItems = (this.props.continents ?? []).map(item => ({
      label: translateContinent(item.continent) ?? "Unknown",
      value: item.continent
    }));
    const countryItems = (this.props.countries ?? [])
      .filter(item => !!this.props.selectedContinent && item.continent === this.props.selectedContinent)
      .map(item => ({
        label: translateCountry(item.code) ?? "Unknown",
        value: item.code
      }));

    return (
      <ProjectFlowScreen
        componentId={this.props.componentId}
        formMetadata={this.props.formMetadata}
        scrollComponent={SafeAreaView}
        header={translate(`${projectTypeKey}.details.location`)}
        subtext={translate(`${projectTypeKey}.details.locationHelp`)}
        isNextButtonEnabled={allInputsValid}
      >
        <InputLabel title={translate(`${projectTypeKey}.details.continent`)} required />
        <Picker
          value={this.props.selectedContinent}
          onValueChange={this.handleChangeContinent}
          placeholder={{ label: translate(`${projectTypeKey}.details.continent`), value: null }}
          items={continentItems}
          sorted
          fullBorder
        />

        <InputLabel
          title={translate(`${projectTypeKey}.details.country`)}
          required={this.props.formMetadata.type === "pitch"}
        />
        <Picker
          value={this.props.selectedCountry}
          onValueChange={this.handleChangeCountry}
          placeholder={{ label: translate(`${projectTypeKey}.details.country`), value: null }}
          items={countryItems}
          disabled={countryItems.length === 0}
          sorted
          fullBorder
        />
      </ProjectFlowScreen>
    );
  }
}
