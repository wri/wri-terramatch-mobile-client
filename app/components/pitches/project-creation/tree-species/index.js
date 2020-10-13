// @flow

import type { ProjectFormProps } from "../../../../screens/projectForms";
import type { PendingTreeSpecies } from "../../../../redux/wri-api/pitches";
import React, { Component } from "react";
import { ScrollView } from "react-native";
import { Navigation } from "react-native-navigation";
import ProjectFlowScreen from "../screen";
import translate from "../../../../locales/";
import { withSafeArea } from "react-native-safe-area";
import { TreeSpeciesCreate } from "wri-api";
import TreeSpeciesCardList from "./treeSpeciesList";
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

  /**
   *
   */
  +species: Array<PendingTreeSpecies>,

  /**
   * Updates the saved species so that it can be resumed
   */
  updateSavedTreeSpecies: TreeSpeciesCreate => void,
  removeSavedTreeSpecies: PendingTreeSpecies => void
|};

type State = {|
  +specie: TreeSpeciesCreate
|};

const SafeAreaView = withSafeArea(ScrollView, "padding", "bottom");

/**
 * The initial state used to populate the empty form
 */
const UNINITIALISED_TREE = Object.freeze({
  pitch_id: null,
  name: null,
  is_native: false,
  season: null,
  count: null,
  price_to_plant: null,
  price_to_maintain: null,
  saplings: null,
  site_prep: null,
  survival_rate: null,
  produces_food: false,
  produces_firewood: false,
  produces_timber: false,
  owner: null
});

export default class TreeSpeciesScreen extends Component<Props, State> {
  static options(passProps: { formMetadata: ProjectFormProps }) {
    return {
      ...projectCreationNavigation(passProps.formMetadata)
    };
  }

  constructor(props: Props) {
    super(props);
    Navigation.events().bindComponent(this);
    this.state = {
      specie: TreeSpeciesCreate.constructFromObject(UNINITIALISED_TREE)
    };
  }

  navigationButtonPressed(event: any) {
    projectCreationNavigationEvents(event.buttonId, this.props.formMetadata);
  }

  _onTreeSpeciesChange = (species: TreeSpeciesCreate) => {
    this.setState({
      specie: TreeSpeciesCreate.constructFromObject({
        pitch_id: species.pitch_id,
        name: species.name,
        season: species.season,
        is_native: species.is_native,
        count: species.count,
        price_to_plant: species.price_to_plant,
        price_to_maintain: species.price_to_maintain,
        saplings: species.saplings,
        site_prep: species.site_prep,
        survival_rate: species.survival_rate,
        produces_food: species.produces_food,
        produces_firewood: species.produces_firewood,
        produces_timber: species.produces_timber,
        owner: species.owner
      })
    });
  };

  addSpecie = () => {
    this.props.updateSavedTreeSpecies(this.state.specie);
    this.props.formMetadata.syncDraft();

    this.setState({
      specie: TreeSpeciesCreate.constructFromObject(UNINITIALISED_TREE)
    });
  };

  _previousStep = () => {
    Navigation.pop(this.props.componentId);
  };

  render() {
    return (
      <ProjectFlowScreen
        componentId={this.props.componentId}
        formMetadata={this.props.formMetadata}
        scrollComponent={SafeAreaView}
        keyboard
        header={translate("createPitch.details.treeSpecies.title")}
        subtext={translate("createPitch.details.treeSpecies.help")}
        isNextButtonEnabled={true}
      >
        <TreeSpeciesCardList
          items={this.props.species}
          addItem={this.state.specie}
          onItemChanged={this._onTreeSpeciesChange}
          newSpecieAdded={this.addSpecie}
          removeSpecie={this.props.removeSavedTreeSpecies}
        />
      </ProjectFlowScreen>
    );
  }
}
