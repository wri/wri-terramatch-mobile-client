// @flow

import type { AppState, Dispatch, ComponentProps } from "../../../../../redux/redux.types";
import type { ElementConfig } from "react";

import OrganisationSubmitScreen from "../../../../../components/welcome/signUp/organisation/submit-screen";
import { connect } from "react-redux";
import { syncOrganisationForm } from "../../../../../redux/wri-api/organisations/actions";
import Screen from "../../../../../components/common/screen";

type OwnProps = {|
  ...ElementConfig<typeof Screen>,
  errorStyle?: any,
  onPreSubmit?: () => void,
  onPostSubmit?: () => void,
  submitFormWhenNextPressed: boolean
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  return {
    createOrganisationState: state.wri.organisations.create
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    submitForm: async () => {
      await dispatch(syncOrganisationForm());
    }
  };
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(OrganisationSubmitScreen);
