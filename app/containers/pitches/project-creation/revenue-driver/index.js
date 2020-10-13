// @flow

import type { AppState, Dispatch, ComponentProps } from "../../../../redux/redux.types";
import type { ProjectFormProps } from "../../../../screens/projectForms";
import RevenueDriverScreen from "../../../../components/pitches/project-creation/revenue-driver";
import { connect } from "react-redux";
import { reconcilePitchRegistrationForm } from "../../../../api/wri/helpers";
import { updatePitchFormDetails } from "../../../../redux/wri-api/pitches/actions";

type OwnProps = {|
  componentId: string,
  formMetadata: ProjectFormProps
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  const form = reconcilePitchRegistrationForm(state.wri.pitches.registrationForm[props.formMetadata.formId]);
  return {
    revenueDriversState: state.wri.projects.revenueDrivers,
    selectedValues: form.details.revenue_drivers ?? []
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    updateSelectedValues: (values: Array<string>) => {
      dispatch(updatePitchFormDetails(props.formMetadata.formId, { revenue_drivers: values }));
    }
  };
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(RevenueDriverScreen);
