// @flow

import type { AppState, Dispatch, ComponentProps } from "../../../redux/redux.types";
import { connect } from "react-redux";

import OrganisationApprovalCard from "../../../components/organisation/approval-card";
import { confirmOrgApprovalNotice } from "../../../redux/wri-api/users/actions";
import { launchLoggedInRoot } from "../../../redux/app/actions";
import { createOrganisationRegistrationForm } from "../../../redux/wri-api/organisations/actions";

type OwnProps = {|
  +isAwaitingFirstApproval: boolean,
  +onEditOrganisationPressed: () => void
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  return {
    organisationVersionsState: state.wri.organisations.read
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    onEditOrganisationPressed: () => {
      dispatch(createOrganisationRegistrationForm());
      props.onEditOrganisationPressed();
    },
    onSignInPressed: () => {
      dispatch(confirmOrgApprovalNotice());
      dispatch(launchLoggedInRoot(true));
    }
  };
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(OrganisationApprovalCard);
