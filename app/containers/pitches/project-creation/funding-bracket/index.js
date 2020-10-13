// @flow

import type { AppState, Dispatch, ComponentProps } from "../../../../redux/redux.types";
import type { ProjectFormProps } from "../../../../screens/projectForms";
import FundingBracketScreen from "../../../../components/pitches/project-creation/funding-bracket";
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
    fundingAmount: form.details.funding_amount,
    fundingBracketsState: state.wri.projects.fundingBrackets,
    fundingBracket: form.details.funding_bracket
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    updateFundingBracket: (value: ?string) => {
      dispatch(updateProjectFormDetails(props.formMetadata, { funding_bracket: value }));
    },
    updateFundingAmount: (amount: number) => {
      dispatch(updateProjectFormDetails(props.formMetadata, { funding_amount: amount }));
    }
  };
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(FundingBracketScreen);
