// @flow

import type { AppState, ComponentProps, Dispatch } from "../../../redux/redux.types";
import { connect } from "react-redux";
import SettingsScreen from "../../../components/home/settings";
import { logout } from "../../../redux/wri-api/auth/actions";
import { launchStartupRoot } from "../../../redux/app/actions";

type OwnProps = {|
  componentId: string
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  return {};
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    onSignOutPressed: () => {
      dispatch(logout());
      dispatch(launchStartupRoot());
    }
  };
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(SettingsScreen);
