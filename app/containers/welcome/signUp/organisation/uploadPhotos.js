// @flow

import type { AppState, Dispatch, ComponentProps } from "../../../../redux/redux.types";
import type { File } from "../../../../utils/models.types";

import OrganisationPhotosScreen from "../../../../components/welcome/signUp/organisation/uploadPhotos";
import { addOrganisationUpload } from "../../../../redux/wri-api/organisations/actions";
import { connect } from "react-redux";
import { reconcileOrganisationRegistrationForm } from "../../../../api/wri/helpers";

type OwnProps = {|
  componentId: string,
  isEdit: boolean
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  const form = reconcileOrganisationRegistrationForm(state.wri.organisations.registrationForm);
  return {
    avatarFile: form.uploads.avatar,
    coverPhotoFile: form.uploads.coverPhoto
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    updateAvatar: (file: File) => {
      dispatch(addOrganisationUpload("avatar", file));
    },
    updateCoverPhoto: (file: File) => {
      dispatch(addOrganisationUpload("coverPhoto", file));
    }
  };
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(OrganisationPhotosScreen);
