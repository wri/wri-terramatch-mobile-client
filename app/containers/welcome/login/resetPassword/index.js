// @flow

import type { AppState, Dispatch, ComponentProps } from "../../../../redux/redux.types";
import { AuthReset } from "wri-api";

import { resetPassword } from "../../../../redux/wri-api/auth/actions";
import { connect } from "react-redux";
import ResetPasswordScreen from "../../../../components/welcome/login/resetPassword";

type OwnProps = {|
  componentId: string
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  return {
    resetPasswordState: state.wri.auth.reset
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    onResetPressed: async (form: AuthReset) => {
      await dispatch(resetPassword(form));
    }
  };
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(ResetPasswordScreen);
