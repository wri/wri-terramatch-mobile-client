// @flow

import type { AppState, Dispatch, ComponentProps } from "../../redux/redux.types";
import WelcomeScreen from "../../components/welcome";
import { connect } from "react-redux";

type OwnProps = {|
  componentId: string
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  return {
    hasNotifications: (state.wri.notifications.notifications.data ?? []).some(notification => !!notification.unread),
    user: state.wri.users.me.data ?? state.wri.users.createAccount.data,
    newsWordpressState: state.wordpress.news,
    projectsWordpressState: state.wordpress.projects
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {};
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(WelcomeScreen);
