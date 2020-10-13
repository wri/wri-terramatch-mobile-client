// @flow

import type { AppState, Dispatch, ComponentProps } from "../../../../redux/redux.types";
import type { ProjectFormProps } from "../../../../screens/projectForms";
import PitchLocationScreen from "../../../../components/pitches/project-creation/location";
import { updatePitchFormDetails } from "../../../../redux/wri-api/pitches/actions";
import { connect } from "react-redux";
import { reconcilePitchRegistrationForm } from "../../../../api/wri/helpers";

type OwnProps = {|
  componentId: string,
  formMetadata: ProjectFormProps
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  const form = reconcilePitchRegistrationForm(state.wri.pitches.registrationForm[props.formMetadata.formId]);
  return {
    initialGeoJson: form.details.land_geojson
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    updateSavedGeoJson: (geoJson: string) => {
      dispatch(
        updatePitchFormDetails(props.formMetadata.formId, {
          land_geojson: geoJson
        })
      );
    }
  };
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(PitchLocationScreen);
