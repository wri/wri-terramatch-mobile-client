// @flow

import type { AppState, Dispatch, ComponentProps } from "../../../../redux/redux.types";

import VerifyScreen from "../../../../components/welcome/signUp/verify";
import { connect } from "react-redux";
import { UserRead } from "wri-api";
import { requestVerificationEmail } from "../../../../redux/wri-api/auth/actions";
import { fetchMe } from "../../../../redux/wri-api/users/actions";
import { launchLoggedInRoot } from "../../../../redux/app/actions";

type OwnProps = {|
  componentId: string
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  return {
    requestVerificationEmailState: state.wri.auth.verifyRequest,
    userDetailsState: state.wri.users.me
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    continueAfterVerified: () => {
      dispatch(launchLoggedInRoot(false));
    },
    refreshUserDetails: async (): Promise<UserRead> => {
      const result = await dispatch(fetchMe());
      return result.value;
    },
    requestVerificationEmail: async () => {
      await dispatch(requestVerificationEmail());
    }
  };
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(VerifyScreen);
