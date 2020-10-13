// @flow

import type { AppState, Dispatch, ComponentProps } from "../../../../redux/redux.types";
import { connect } from "react-redux";
import { OfferRead, PitchRead } from "wri-api";
import ReportingCapabilities from "../../../../components/projects/details/reporting-capabilities";

type OwnProps = {|
  project: PitchRead | OfferRead
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  return {
    reportingFrequency: state.wri.projects.reportingFrequencies,
    reportingLevel: state.wri.projects.reportingLevels
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {};
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(ReportingCapabilities);
