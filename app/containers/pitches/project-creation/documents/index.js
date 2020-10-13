// @flow

import type { AppState, Dispatch, ComponentProps } from "../../../../redux/redux.types";
import type { File, PendingFile } from "../../../../utils/models.types";
import type { ProjectFormProps } from "../../../../screens/projectForms";
import PitchDocumentsScreen from "../../../../components/pitches/project-creation/documents";
import { createPitchUpload, removePitchUpload } from "../../../../redux/wri-api/pitches/actions";
import { connect } from "react-redux";
import { reconcilePitchRegistrationForm } from "../../../../api/wri/helpers";

type OwnProps = {|
  componentId: string,
  formMetadata: ProjectFormProps
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  const form = reconcilePitchRegistrationForm(state.wri.pitches.registrationForm[props.formMetadata.formId]);
  return {
    documentUpload: form.uploads?.documents
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    addDocumentUpload: (file: File) => {
      dispatch(createPitchUpload(props.formMetadata.formId, "documents", file));
    },
    removeDocumentUpload: (file: PendingFile) => {
      dispatch(removePitchUpload(props.formMetadata.formId, "documents", file));
    }
  };
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(PitchDocumentsScreen);
