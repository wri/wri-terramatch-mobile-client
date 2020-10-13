// @flow

import type { AppState, ComponentProps, Dispatch } from "../../../redux/redux.types";
import NotificationScreen from "../../../components/home/notifications";
import { connect } from "react-redux";
import { fetchNotifications, notificationMarkedRead } from "../../../redux/wri-api/notifications/actions";

type OwnProps = {|
  componentId: string
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  return {
    notifications: state.wri.notifications.notifications
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    onReadNotificationPressed: async (id: number) => {
      await dispatch(notificationMarkedRead(id));
      dispatch(fetchNotifications());
    },
    refreshData: () => {
      dispatch(fetchNotifications());
    }
  };
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(NotificationScreen);
