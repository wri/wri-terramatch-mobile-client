// @flow

import type { AppState, Dispatch, ComponentProps } from "../../../../redux/redux.types";
import type { ProjectFormProps } from "../../../../screens/projectForms";
import LandTypeScreen from "../../../../components/pitches/project-creation/land-type";
import { connect } from "react-redux";
import { reconcileProjectRegistrationForm } from "../../../../api/wri/helpers";
import { updateProjectFormDetails } from "../../../../redux/wri-api/projects/actions";

type OwnProps = {|
  componentId: string,
  formMetadata: ProjectFormProps
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  const form = reconcileProjectRegistrationForm(state, props.formMetadata);
  return {
    landTypesState: state.wri.projects.landTypes,
    selectedValues: form.details.land_types ?? []
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    updateSelectedValues: (values: Array<string>) => {
      dispatch(updateProjectFormDetails(props.formMetadata, { land_types: values }));
    }
  };
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(LandTypeScreen);
