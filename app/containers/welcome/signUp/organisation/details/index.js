// @flow

import type { AppState, Dispatch, ComponentProps } from "../../../../../redux/redux.types";
import { OrganisationCreate } from "wri-api";

import OrganisationDetailsScreen from "../../../../../components/welcome/signUp/organisation/details";
import { updateOrganisationFormDetails } from "../../../../../redux/wri-api/organisations/actions";
import { connect } from "react-redux";
import { reconcileOrganisationRegistrationForm } from "../../../../../api/wri/helpers";

type OwnProps = {|
  componentId: string,
  isEdit: boolean
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  const form = reconcileOrganisationRegistrationForm(state.wri.organisations.registrationForm);
  return {
    countriesState: state.wri.countries,
    form: form.details,
    isEdit: !!form.base,
    organisationTypesState: state.wri.organisations.types
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    updateSavedForm: (form: $Shape<OrganisationCreate>) => {
      dispatch(updateOrganisationFormDetails(form));
    }
  };
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(OrganisationDetailsScreen);
