// @flow

import type { AppState, ComponentProps, Dispatch } from "../../redux/redux.types";
import { connect } from "react-redux";

import HomeScreen from "../../components/home";
import { checkPermission, fetchPushToken, requestPermission } from "../../utils/pushNotifications";

type OwnProps = {|
  +componentId: string
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  return {
    hasNotifications: (state.wri.notifications.notifications.data ?? []).some(notification => !!notification.unread),
    newsWordpressState: state.wordpress.news.data
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    checkNotificationPermission: async () => {
      const enabled = await checkPermission();
      if (!enabled) {
        try {
          await requestPermission();
          fetchPushToken(dispatch);
        } catch (err) {
          console.warn("3SC", "Push Permission Declined");
        }
      } else {
        fetchPushToken(dispatch);
      }
    }
  };
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen);
