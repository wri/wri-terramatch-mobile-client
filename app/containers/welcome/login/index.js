// @flow

import type { AppState, Dispatch, ComponentProps } from "../../../redux/redux.types";
import { connect } from "react-redux";
import { Navigation } from "react-native-navigation";
import { AuthLogIn } from "wri-api";

import LoginScreen from "../../../components/welcome/login";
import { logIn, logout } from "../../../redux/wri-api/auth/actions";
import { launchLoggedInRoot } from "../../../redux/app/actions";

type OwnProps = {|
  completionCallback?: () => void,
  componentId: string,
  isModal?: boolean
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  const createAccountState = state.wri.users.createAccount;
  const fetchUserState = state.wri.users.me;
  return {
    initialEmailAddress: fetchUserState.data?.email_address ?? createAccountState.data?.email_address,
    loginState: state.wri.auth.login
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    onLoginPressed: async (loginDetails: AuthLogIn, isModified: boolean): Promise<void> => {
      if (isModified) {
        await dispatch(logout());
      }

      await dispatch(logIn(loginDetails));

      if (props.completionCallback) {
        props.completionCallback();
      }

      if (props.isModal) {
        Navigation.dismissModal(props.componentId);
      } else {
        dispatch(launchLoggedInRoot(true));
      }
    }
  };
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(LoginScreen);
