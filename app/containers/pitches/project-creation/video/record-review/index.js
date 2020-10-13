// @flow

import type { AppState, Dispatch, ComponentProps } from "../../../../../redux/redux.types";
import type { ProjectFormProps } from "../../../../../screens/projectForms";

import PitchPatchVideoReviewScreen from "../../../../../components/pitches/project-creation/video/record-review";
import { connect } from "react-redux";
import { reconcileProjectRegistrationForm } from "../../../../../api/wri/helpers";
import type { OfferUploadTypes } from "../../../../../redux/wri-api/offers/actions";
import type { PitchUploadTypes } from "../../../../../redux/wri-api/pitches/actions";

type OwnProps = {|
  componentId: string,
  formMetadata: ProjectFormProps,
  video: OfferUploadTypes | PitchUploadTypes
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  const form = reconcileProjectRegistrationForm(state, props.formMetadata);
  return {
    videoRecorded: form.uploads[props.video]
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {};
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(PitchPatchVideoReviewScreen);
