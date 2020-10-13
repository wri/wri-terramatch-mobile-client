// @flow

import type { AppState, Dispatch, ComponentProps } from "../../../../redux/redux.types";
import type { ProjectFormProps } from "../../../../screens/projectForms";

import OfferReviewScreen from "../../../../components/offers/details/review";
import { connect } from "react-redux";
import { findMostRecentOrganisationVersion, reconcileOfferRegistrationForm } from "../../../../api/wri/helpers";
import { syncOfferForm } from "../../../../redux/wri-api/offers/actions";
import { transformAsyncState } from "../../../../redux/asyncActionReducer";
import { TeamMemberReadAll, UserReadAll } from "wri-api";
import { displayScreenAsModal, screens } from "../../../../screens";

type OwnProps = {|
  componentId: string,
  +filteredId: number,
  formMetadata: ProjectFormProps
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  return {
    createOfferState: state.wri.offers.create,
    form: reconcileOfferRegistrationForm(state.wri.offers.registrationForm[props.formMetadata.formId]),
    organisationState: transformAsyncState(
      state.wri.organisations.read,
      versions => findMostRecentOrganisationVersion(versions)?.data
    ),
    organisationMembers: state.wri.organisations.members.data ?? new TeamMemberReadAll(),
    organisationUsers: state.wri.organisations.users.data ?? new UserReadAll()
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    continueWithoutSaving: async () => {
      return await props.formMetadata.removeForm();
    },
    submitForm: async () => {
      await dispatch(syncOfferForm(props.formMetadata.formId));
      displayScreenAsModal({
        ...screens.PROJECTS_SUCCESS_SCREEN,
        passProps: {
          formMetadata: props.formMetadata
        }
      });
      return await props.formMetadata.removeForm();
    }
  };
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(OfferReviewScreen);
