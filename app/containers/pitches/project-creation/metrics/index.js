// @flow

import type { AppState, Dispatch, ComponentProps } from "../../../../redux/redux.types";
import type { ProjectFormProps } from "../../../../screens/projectForms";
import { PitchCreate, RestorationMethodMetricUpdate } from "wri-api";

import PitchMetricsScreen from "../../../../components/pitches/project-creation/metrics";
import { updatePitchFormDetails, updateRestorationMethodMetric } from "../../../../redux/wri-api/pitches/actions";
import { connect } from "react-redux";
import { reconcilePitchRegistrationForm } from "../../../../api/wri/helpers";

type OwnProps = {|
  componentId: string,
  formMetadata: ProjectFormProps
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  const form = reconcilePitchRegistrationForm(state.wri.pitches.registrationForm[props.formMetadata.formId]);
  return {
    form: form.details,
    metrics: form.metrics
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    updateSavedForm: (form: $Shape<PitchCreate>) => {
      dispatch(updatePitchFormDetails(props.formMetadata.formId, form));
    },
    updateSavedMetric: (method: string, metric: $Shape<RestorationMethodMetricUpdate>) => {
      dispatch(updateRestorationMethodMetric(props.formMetadata.formId, method, metric));
    }
  };
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(PitchMetricsScreen);
