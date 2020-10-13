// @flow

import type { AppState, Dispatch, ComponentProps } from "../../../../redux/redux.types";
import type { ProjectFormProps } from "../../../../screens/projectForms";
import type { PendingCarbonCertification } from "../../../../redux/wri-api/pitches";
import { CarbonCertificationCreate } from "wri-api";

import CarbonCertificateScreen from "../../../../components/pitches/project-creation/carbon-certificate";
import { createCarbonCertificate, removeCarbonCertificate } from "../../../../redux/wri-api/pitches/actions";

import { connect } from "react-redux";
import { reconcilePitchRegistrationForm } from "../../../../api/wri/helpers";

type OwnProps = {|
  componentId: string,
  formMetadata: ProjectFormProps
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  const form = reconcilePitchRegistrationForm(state.wri.pitches.registrationForm[props.formMetadata.formId]);
  return {
    certificate: form.certificate,
    carbonTypesState: state.wri.projects.carbonTypes
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    updateSavedCarbonCertificate: (certificate: CarbonCertificationCreate) => {
      dispatch(createCarbonCertificate(props.formMetadata.formId, certificate));
    },
    removeSavedCarbonCertificate: (certificate: PendingCarbonCertification) => {
      dispatch(removeCarbonCertificate(props.formMetadata.formId, certificate));
    }
  };
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(CarbonCertificateScreen);
