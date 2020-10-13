// @flow

import type { AppState, Dispatch, ComponentProps } from "../../../../../redux/redux.types";
import type { ProjectFormProps } from "../../../../../screens/projectForms";

import PitchPatchVideoScreen from "../../../../../components/pitches/project-creation/video/record";
import { connect } from "react-redux";
import type { File } from "../../../../../utils/models.types";
import { createOfferUpload, type OfferUploadTypes } from "../../../../../redux/wri-api/offers/actions";
import { createPitchUpload, type PitchUploadTypes } from "../../../../../redux/wri-api/pitches/actions";

type OwnProps = {|
  componentId: string,
  formMetadata: ProjectFormProps,
  video: PitchUploadTypes | OfferUploadTypes
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  return {};
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    updateVideo: (file: File) => {
      switch (props.formMetadata.type) {
        case "offer": {
          dispatch(createOfferUpload(props.formMetadata.formId, props.video, file));
          break;
        }
        case "pitch": {
          dispatch(createPitchUpload(props.formMetadata.formId, props.video, file));
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
)(PitchPatchVideoScreen);
