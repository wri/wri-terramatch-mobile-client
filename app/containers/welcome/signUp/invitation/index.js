// @flow

import type { AppState, Dispatch, ComponentProps } from "../../../../redux/redux.types";
import { AuthLogIn, UserAccept, UserCreate } from "wri-api";

import SignUpScreen from "../../../../components/welcome/signUp";
import { logIn } from "../../../../redux/wri-api/auth/actions";
import { connect } from "react-redux";
import { launchLoggedInRoot } from "../../../../redux/app/actions";
import { acceptInvitation } from "../../../../redux/wri-api/users/actions";

type OwnProps = {|
  componentId: string,
  email: ?string
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  return {
    accountCreationState: state.wri.users.createAccount
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    onSignUpPressed: async (userDetails: $Shape<UserAccept & UserCreate>) => {
      await dispatch(acceptInvitation(userDetails));
      await dispatch(logIn(AuthLogIn.constructFromObject(userDetails)));
      dispatch(launchLoggedInRoot(true));
    }
  };
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(SignUpScreen);
