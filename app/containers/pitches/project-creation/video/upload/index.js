// @flow

import type { AppState, Dispatch, ComponentProps } from "../../../../../redux/redux.types";
import type { File } from "../../../../../utils/models.types";
import type { ProjectFormProps } from "../../../../../screens/projectForms";

import PitchUploadVideoScreen from "../../../../../components/pitches/project-creation/video/upload";
import { connect } from "react-redux";
import { reconcileProjectRegistrationForm } from "../../../../../api/wri/helpers";
import { createPitchUpload } from "../../../../../redux/wri-api/pitches/actions";
import { createOfferUpload } from "../../../../../redux/wri-api/offers/actions";

type OwnProps = {|
  componentId: string,
  formMetadata: ProjectFormProps
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  const form = reconcileProjectRegistrationForm(state, props.formMetadata);
  return {
    videoFile: form.uploads.video
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    updateVideo: (file: ?File) => {
      switch (props.formMetadata.type) {
        case "offer": {
          dispatch(createOfferUpload(props.formMetadata.formId, "video", file));
          break;
        }
        case "pitch": {
          dispatch(createPitchUpload(props.formMetadata.formId, "video", file));
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
)(PitchUploadVideoScreen);
