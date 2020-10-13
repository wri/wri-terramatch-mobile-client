// @flow

import type { AppState, Dispatch, ComponentProps } from "../../../../../redux/redux.types";
import type { ProjectFormProps } from "../../../../../screens/projectForms";

import PitchPatchVideoUploadScreen from "../../../../../components/pitches/project-creation/video/patch-upload";
import { connect } from "react-redux";
import { reconcilePitchRegistrationForm, syncProjectElevatorVideosToApi } from "../../../../../api/wri/helpers";
import type { PitchRegistrationForm } from "../../../../../redux/wri-api/pitches";
import wriApi from "../../../../../api/wri";
import { ElevatorVideoCreate, ElevatorVideoRead } from "wri-api";

type OwnProps = {|
  componentId: string,
  formMetadata: ProjectFormProps,
  fallbackComponentId: string
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  return {
    form: reconcilePitchRegistrationForm(state.wri.pitches.registrationForm[props.formMetadata.formId])
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    uploadVideos: async (form: PitchRegistrationForm): Promise<ElevatorVideoRead> => {
      const [intro, goals, significance] = await syncProjectElevatorVideosToApi(form);
      const elevatorVideo = new ElevatorVideoCreate();
      elevatorVideo.introduction = intro.id ?? undefined;
      elevatorVideo.aims = goals.id ?? undefined;
      elevatorVideo.importance = significance.id ?? undefined;
      return await wriApi.elevatorVideos.elevatorVideosPost(elevatorVideo);
    },
    uploadFinished: async (id: number): Promise<ElevatorVideoRead> => {
      return await wriApi.elevatorVideos.elevatorVideosIDGet(id);
    }
  };
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(PitchPatchVideoUploadScreen);
