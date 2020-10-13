// @flow

import type { AppState, Dispatch, ComponentProps } from "../../../../redux/redux.types";
import { AuthChange } from "wri-api";

import { updatePassword } from "../../../../redux/wri-api/auth/actions";
import { connect } from "react-redux";
import UpdatePasswordScreen from "../../../../components/welcome/login/updatePassword";

type OwnProps = {|
  componentId: string,
  token: string
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  return { updatePasswordState: state.wri.auth.updatePassword };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    onUpdatePasswordPressed: async (form: AuthChange) => {
      await dispatch(updatePassword(form));
    }
  };
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(UpdatePasswordScreen);
