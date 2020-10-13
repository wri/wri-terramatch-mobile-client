// @flow

import type { AppState, Dispatch, ComponentProps } from "../../../../redux/redux.types";
import type { PendingTreeSpecies } from "../../../../redux/wri-api/pitches";
import type { ProjectFormProps } from "../../../../screens/projectForms";
import { TreeSpeciesCreate } from "wri-api";

import TreeSpeciesScreen from "../../../../components/pitches/project-creation/tree-species";
import { createTreeSpecies, removeTreeSpecie } from "../../../../redux/wri-api/pitches/actions";
import { connect } from "react-redux";
import { reconcilePitchRegistrationForm } from "../../../../api/wri/helpers";

type OwnProps = {|
  componentId: string,
  formMetadata: ProjectFormProps
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  const form = reconcilePitchRegistrationForm(state.wri.pitches.registrationForm[props.formMetadata.formId]);
  return {
    species: form.species
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    updateSavedTreeSpecies: (species: TreeSpeciesCreate) => {
      dispatch(createTreeSpecies(props.formMetadata.formId, species));
    },
    removeSavedTreeSpecies: (species: PendingTreeSpecies) => {
      dispatch(removeTreeSpecie(props.formMetadata.formId, species));
    }
  };
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(TreeSpeciesScreen);
