// @flow

import type { AppState, Dispatch, ComponentProps } from "../../../../redux/redux.types";

import OrganisationReviewScreen from "../../../../components/welcome/signUp/organisation/review";
import { connect } from "react-redux";
import { reconcileOrganisationRegistrationForm } from "../../../../api/wri/helpers";
import { Navigation } from "react-native-navigation";
import { fetchMe } from "../../../../redux/wri-api/users/actions";
import { fetchMyOrganisationData } from "../../../../redux/wri-api/organisations/actions";

type OwnProps = {|
  componentId: string
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  return {
    form: reconcileOrganisationRegistrationForm(state.wri.organisations.registrationForm)
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    onSubmissionCompleted: async () => {
      try {
        await dispatch(fetchMe());
        await dispatch(fetchMyOrganisationData());
      } catch (err) {
        console.warn("3SC", "Could not refresh user data after updating org", err);
      }
      Navigation.popToRoot(props.componentId);
    }
  };
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(OrganisationReviewScreen);
