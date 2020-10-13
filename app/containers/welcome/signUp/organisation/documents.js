// @flow

import type { AppState, Dispatch, ComponentProps } from "../../../../redux/redux.types";
import type { File, PendingFile } from "../../../../utils/models.types";

import { connect } from "react-redux";

import OrganisationDocumentsScreen from "../../../../components/welcome/signUp/organisation/documents";
import { addOrganisationUpload, removeOrganisationUpload } from "../../../../redux/wri-api/organisations/actions";

type OwnProps = {|
  componentId: string,
  isEdit: boolean
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  return {
    documentUpload: state.wri.organisations.registrationForm.uploads.documents
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    addDocumentUpload: (file: File) => {
      dispatch(addOrganisationUpload("documents", file));
    },
    removeDocumentUpload: (file: PendingFile) => {
      dispatch(removeOrganisationUpload("documents", file));
    }
  };
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(OrganisationDocumentsScreen);
