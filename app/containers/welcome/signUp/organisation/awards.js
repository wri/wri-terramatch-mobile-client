// @flow

import type { AppState, Dispatch, ComponentProps } from "../../../../redux/redux.types";
import type { File, PendingFile } from "../../../../utils/models.types";

import OrganisationAwardsScreen from "../../../../components/welcome/signUp/organisation/awards";
import { addOrganisationUpload, removeOrganisationUpload } from "../../../../redux/wri-api/organisations/actions";
import { connect } from "react-redux";

type OwnProps = {|
  componentId: string,
  isEdit: boolean
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  return {
    awardUploads: state.wri.organisations.registrationForm.uploads.awards
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    addAwardUpload: (file: File) => {
      dispatch(addOrganisationUpload("awards", file));
    },
    removeAwardUpload: (file: PendingFile) => {
      dispatch(removeOrganisationUpload("awards", file));
    }
  };
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(OrganisationAwardsScreen);
