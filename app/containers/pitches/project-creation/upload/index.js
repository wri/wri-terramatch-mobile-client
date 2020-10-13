// @flow

import type { AppState, Dispatch, ComponentProps } from "../../../../redux/redux.types";
import type { File } from "../../../../utils/models.types";
import type { ProjectFormProps } from "../../../../screens/projectForms";

import PitchUploadScreen from "../../../../components/pitches/project-creation/upload";
import { connect } from "react-redux";
import { reconcileProjectRegistrationForm } from "../../../../api/wri/helpers";
import { createPitchUpload } from "../../../../redux/wri-api/pitches/actions";
import { createOfferUpload } from "../../../../redux/wri-api/offers/actions";

type OwnProps = {|
  componentId: string,
  formMetadata: ProjectFormProps
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  const form = reconcileProjectRegistrationForm(state, props.formMetadata);
  return {
    coverPhotoFile: form.uploads.coverPhoto
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    updateCoverPhoto: (file: File) => {
      switch (props.formMetadata.type) {
        case "offer": {
          dispatch(createOfferUpload(props.formMetadata.formId, "coverPhoto", file));
          break;
        }
        case "pitch": {
          dispatch(createPitchUpload(props.formMetadata.formId, "coverPhoto", file));
          break;
        }
      }
    }
  };
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(PitchUploadScreen);
