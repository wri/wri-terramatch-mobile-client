// @flow

import type { AppState, Dispatch, ComponentProps } from "../../../../redux/redux.types";
import type { ProjectFormProps } from "../../../../screens/projectForms";

import PitchVideoElevatorScreen from "../../../../components/pitches/project-creation/video/";
import { connect } from "react-redux";
import type { VideoState } from "../../../../components/common/video-player";
import { reconcileProjectRegistrationForm } from "../../../../api/wri/helpers";
import type { File } from "../../../../utils/models.types";
import { createOfferUpload } from "../../../../redux/wri-api/offers/actions";
import { createPitchUpload } from "../../../../redux/wri-api/pitches/actions";

type OwnProps = {|
  componentId: string,
  formMetadata: ProjectFormProps,
  state?: ?VideoState
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  const form = reconcileProjectRegistrationForm(state, props.formMetadata);
  return {
    projectVideo: form.uploads.video
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
)(PitchVideoElevatorScreen);
