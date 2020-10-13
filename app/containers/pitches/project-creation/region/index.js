// @flow

import type { AppState, Dispatch, ComponentProps } from "../../../../redux/redux.types";
import type { ProjectFormProps } from "../../../../screens/projectForms";
import { ContinentReadAll, CountryReadAll } from "wri-api";

import { connect } from "react-redux";
import PitchRegionScreen from "../../../../components/pitches/project-creation/region";
import { reconcileProjectRegistrationForm } from "../../../../api/wri/helpers";
import { updateProjectFormDetails } from "../../../../redux/wri-api/projects/actions";

type OwnProps = {|
  componentId: string,
  formMetadata: ProjectFormProps
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  const form = reconcileProjectRegistrationForm(state, props.formMetadata);
  return {
    continents: state.wri.continents.data ?? new ContinentReadAll(),
    countries: state.wri.countries.data ?? new CountryReadAll(),
    selectedContinent: form.details.land_continent,
    selectedCountry: form.details.land_country
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    updateContinent: (value: string) => {
      dispatch(updateProjectFormDetails(props.formMetadata, { land_continent: value, land_country: null }));
    },
    updateCountry: (value: string) => {
      dispatch(updateProjectFormDetails(props.formMetadata, { land_country: value }));
    }
  };
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(PitchRegionScreen);
