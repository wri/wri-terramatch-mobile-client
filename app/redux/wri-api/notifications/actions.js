// @flow

import type { NamedAsyncAction } from "../../redux.types";
import wriAPI from "../../../api/wri";
import { createAsyncAction } from "../../conditionalActions";
import { NotificationReadAll, NotificationRead } from "wri-api";

export type FetchNotificationsAction = NamedAsyncAction<"wri/notifications/list", NotificationReadAll>;
export type MarkedReadNotificationsAction = NamedAsyncAction<"wri/notifications/read", NotificationRead>;

export function fetchNotifications(): FetchNotificationsAction {
  return createAsyncAction({
    type: "wri/notifications/list",
    payload: wriAPI.notifications.notificationsGet()
  });
}

export function notificationMarkedRead(id: number): MarkedReadNotificationsAction {
  return createAsyncAction({
    type: "wri/notifications/read",
    payload: wriAPI.notifications.notificationsIDMarkPatch(id)
  });
}
