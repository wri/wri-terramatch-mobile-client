// @flow

import type { AppState, Dispatch, ComponentProps } from "../../../../redux/redux.types";
import PitchStartScreen from "../../../../components/pitches/project-creation/start";
import { connect } from "react-redux";

import { reconcileDraftForms } from "../../../../api/wri/helpers";
import { createOrResumeForm } from "../../../../screens/projectForms";
import { fetchDraftOffers, fetchDraftPitches } from "../../../../redux/wri-api/drafts/actions";

type OwnProps = {|
  componentId: string,
  type: "pitch" | "offer"
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  const forms = reconcileDraftForms(state, props.type);

  return {
    drafts: forms
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    createOrResumeDraft: (formId: ?string, draftId: ?number) => {
      dispatch(createOrResumeForm(props.type, formId, draftId, null));
    },
    updateDrafts: async () => {
      if (props.type === "pitch") {
        await dispatch(fetchDraftPitches());
      } else {
        await dispatch(fetchDraftOffers());
      }
    }
  };
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(PitchStartScreen);
