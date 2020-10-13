// @flow

import type { AppState, Dispatch, ComponentProps } from "../../../../redux/redux.types";
import type { ProjectFormProps } from "../../../../screens/projectForms";

import OfferTotalPricePerTreeScreen from "../../../../components/pitches/project-creation/tree-price";
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
    totalPricePerTree: form.details.price_per_tree
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    updateTotalPricePerTree: (amount: number) => {
      dispatch(updateOfferFormDetails(props.formMetadata.formId, { price_per_tree: amount }));
    }
  };
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(OfferTotalPricePerTreeScreen);
