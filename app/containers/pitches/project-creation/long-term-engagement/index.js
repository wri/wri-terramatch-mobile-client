// @flow

import type { AppState, Dispatch, ComponentProps } from "../../../../redux/redux.types";
import type { ProjectFormProps } from "../../../../screens/projectForms";

import PitchLongTermEngagementScreen from "../../../../components/pitches/project-creation/long-term-engagement";
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
    long_term_engagement: form.details.long_term_engagement
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    updateEngagement: (long_term_engagement: boolean) => {
      dispatch(updateOfferFormDetails(props.formMetadata.formId, { long_term_engagement }));
    }
  };
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(PitchLongTermEngagementScreen);
