// @flow

import type { AppState, Dispatch, ComponentProps } from "../../../../redux/redux.types";
import type { ProjectFormProps } from "../../../../screens/projectForms";
import PitchDescriptionScreen from "../../../../components/pitches/project-creation/description";
import { connect } from "react-redux";
import { reconcileOfferRegistrationForm } from "../../../../api/wri/helpers";
import { updateOfferFormDetails } from "../../../../redux/wri-api/offers/actions";

type OwnProps = {|
  componentId: string,
  formMetadata: ProjectFormProps
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  const form = reconcileOfferRegistrationForm(state.wri.offers.registrationForm[props.formMetadata.formId]);
  return {
    description: form.details.description
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    updateDescription: (description: string) => {
      dispatch(updateOfferFormDetails(props.formMetadata.formId, { description }));
    }
  };
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(PitchDescriptionScreen);
