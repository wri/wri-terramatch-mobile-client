// @flow

import type { AppState, Dispatch, ComponentProps } from "../../../../../redux/redux.types";
import type { ProjectFormProps } from "../../../../../screens/projectForms";

import PitchVideoReviewScreen from "../../../../../components/pitches/project-creation/video/review";
import { connect } from "react-redux";
import { createOfferUpload, updateOfferFormDetails } from "../../../../../redux/wri-api/offers/actions";
import { createPitchUpload, updatePitchFormDetails } from "../../../../../redux/wri-api/pitches/actions";
import { ElevatorVideoRead } from "wri-api";
import type { File } from "../../../../../utils/models.types";

type OwnProps = {|
  componentId: string,
  formMetadata: ProjectFormProps,
  video: ?ElevatorVideoRead
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  return {};
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    updateVideo: (video: ?File) => {
      switch (props.formMetadata.type) {
        case "offer": {
          dispatch(createOfferUpload(props.formMetadata.formId, "video", video));
          dispatch(updateOfferFormDetails(props.formMetadata.formId, { video: video?.uploadId ?? null }));
          break;
        }
        case "pitch": {
          dispatch(createPitchUpload(props.formMetadata.formId, "video", video));
          dispatch(updatePitchFormDetails(props.formMetadata.formId, { video: video?.uploadId ?? null }));
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
)(PitchVideoReviewScreen);
