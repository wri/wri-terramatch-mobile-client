// @flow

import type { AppState, Dispatch, ComponentProps } from "../../../../redux/redux.types";
import type { ProjectFormProps } from "../../../../screens/projectForms";

import { connect } from "react-redux";
import ProgressBar from "../../../../components/pitches/project-creation/progress-bar";
import { initialAsyncState } from "../../../../redux/asyncActionReducer";

type OwnProps = {|
  formMetadata: ProjectFormProps
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  const form = (props.formMetadata.type === "pitch" ? state.wri.pitches : state.wri.offers).registrationForm[
    props.formMetadata.formId
  ];
  return {
    syncState: form?.draftState ?? initialAsyncState
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {};
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(ProgressBar);
