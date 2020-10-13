// @flow

import type { NamedAsyncAction } from "../redux.types";
import apiClient from "../../api/wri/wordpress";
import { createAsyncAction } from "../conditionalActions";

export type fetchNewsContentAction = NamedAsyncAction<"wordpress/news/fetch_details", any>;
export type fetchTestimonialContentAction = NamedAsyncAction<"wordpress/testimonials/fetch_details", any>;
export type fetchProjectsContentAction = NamedAsyncAction<"wordpress/projects/fetch_details", any>;

/**
 * Creates an action that when dispatched will make a request to get news items from the wordpress API
 *
 * @return The created action
 */
export function fetchNewsContent(): fetchNewsContentAction {
  return createAsyncAction({
    type: "wordpress/news/fetch_details",
    payload: apiClient.fetchWordpressDetails("news-items")
  });
}

/**
 * Creates an action that when dispatched will make a request to get testimonials items from the wordpress API
 *
 * @return The created action
 */
export function fetchTestimonialContent(): fetchTestimonialContentAction {
  return createAsyncAction({
    type: "wordpress/testimonials/fetch_details",
    payload: apiClient.fetchWordpressDetails("testimonials")
  });
}

/**
 * Creates an action that when dispatched will make a request to get project items from the wordpress API
 *
 * @return The created action
 */
export function fetchProjectsContent(): fetchProjectsContentAction {
  return createAsyncAction({
    type: "wordpress/projects/fetch_details",
    payload: apiClient.fetchWordpressDetails("projects")
  });
}
