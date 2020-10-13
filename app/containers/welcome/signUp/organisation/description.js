// @flow

import type { AppState, Dispatch, ComponentProps } from "../../../../redux/redux.types";
import type { File } from "../../../../utils/models.types";

import { connect } from "react-redux";
import { OrganisationCreate } from "wri-api";

import OrganisationDescriptionScreen from "../../../../components/welcome/signUp/organisation/description";
import { addOrganisationUpload, updateOrganisationFormDetails } from "../../../../redux/wri-api/organisations/actions";
import { reconcileOrganisationRegistrationForm } from "../../../../api/wri/helpers";

type OwnProps = {|
  componentId: string,
  isEdit: boolean
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  const form = reconcileOrganisationRegistrationForm(state.wri.organisations.registrationForm);
  return {
    form: form.details,
    videoUpload: form.uploads.video
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    addVideoUpload: (file: File) => {
      dispatch(addOrganisationUpload("video", file));
    },
    updateSavedForm: (form: $Shape<OrganisationCreate>) => {
      dispatch(updateOrganisationFormDetails(form));
    }
  };
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(OrganisationDescriptionScreen);
