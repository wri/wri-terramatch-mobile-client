// @flow

import type { AppState, Dispatch, ComponentProps } from "../../../../redux/redux.types";
import type { ProjectFormProps } from "../../../../screens/projectForms";
import FundingSourceScreen from "../../../../components/pitches/project-creation/funding-source";
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
    fundingSourcesState: state.wri.projects.fundingSources,
    selectedValues: form.details.funding_sources ?? []
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    updateSelectedValues: (values: Array<string>) => {
      dispatch(updateProjectFormDetails(props.formMetadata, { funding_sources: values }));
    }
  };
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(FundingSourceScreen);
