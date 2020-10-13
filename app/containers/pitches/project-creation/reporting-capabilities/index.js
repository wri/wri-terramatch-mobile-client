// @flow

import type { AppState, Dispatch, ComponentProps } from "../../../../redux/redux.types";
import type { ProjectFormProps } from "../../../../screens/projectForms";

import { connect } from "react-redux";
import PitchCapabilitiesScreen from "../../../../components/pitches/project-creation/reporting-capabilities";
import { reconcileProjectRegistrationForm } from "../../../../api/wri/helpers";
import { updateProjectFormDetails } from "../../../../redux/wri-api/projects/actions";

type OwnProps = {|
  componentId: string,
  formMetadata: ProjectFormProps
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  const form = reconcileProjectRegistrationForm(state, props.formMetadata);
  return {
    pitchReportingFrequencyState: state.wri.projects.reportingFrequencies,
    pitchReportingLevelState: state.wri.projects.reportingLevels,
    selectedReportingFrequency: form.details.reporting_frequency,
    selectedReportingLevel: form.details.reporting_level
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    updateReportingFrequency: (value: string) => {
      dispatch(updateProjectFormDetails(props.formMetadata, { reporting_frequency: value }));
    },
    updateReportingLevel: (value: string) => {
      dispatch(updateProjectFormDetails(props.formMetadata, { reporting_level: value }));
    }
  };
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(PitchCapabilitiesScreen);
