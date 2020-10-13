// @flow

import {
  ACTION_TYPE_CLEAR_TRANSIENT_STATE,
  ACTION_TYPE_LOGOUT,
  type AppActionName,
  type AsyncState,
  type AsyncLifecycleActions,
  type AsyncPaginatedState,
  type AsyncPendingAction,
  type AsyncSuccessAction,
  type AsyncErrorAction,
  type ClearTransientStateAction,
  type FluxStandardAction,
  type LogoutAction,
  type MappingReducerSettings,
  type MappingReducerState
} from "./redux.types";
import reduxConstants from "./reduxConstants";

/**
 * A standard state structure for asynchronously retrieved data.
 */
export const initialAsyncState: AsyncState<any> = Object.freeze({
  /**
   * Whether or not the async action is currently in progress (awaiting data)
   */
  isFetching: false,

  /**
   * The last time the action was initiated
   */
  lastFetchTime: 0,

  /**
   * The last time the action succeeded
   */
  lastSuccessTime: 0,

  /**
   * The metadata associated with the async action. This is applied locally and includes e.g. a timestamp and a requestId
   */
  meta: null,

  /**
   * The data retrieved last time this async action was successfully performed.
   */
  data: null,

  /**
   * The error received last time this async action failed.
   */
  error: null,

  /**
   * Whether or not the data retrieved last time this async action was successfully performed is now marked as
   * invalid or out-of-date.
   */
  isInvalidated: false,

  /**
   * How many times consecutively this action has failed. (Reset upon success).
   *
   * This is used by {@code shouldPerformAsyncAction} to ensure the same action does not occur too many times in
   * quick succession.
   */
  consecutiveFailureCount: 0
});

/**
 * A standard reducer to handle async actions
 *
 * @param {String} handledAction - The action name for the action that is handled by this reducer
 * @param {Object} [state=initialAsyncState] - The pre-existing state to be mutated by this reducer
 * @param {Object} action - The action that this reducer must mutate state in response to
 * @param {String} action.type - The type of the action
 * @param {Object} action.payload - The payload of the action
 *
 * @returns {Object} The new state
 */
export function asyncActionReducer<T>(
  handledAction: AppActionName,
  state: AsyncState<T> = initialAsyncState,
  action: AsyncLifecycleActions<T> | ClearTransientStateAction | LogoutAction
): AsyncState<T> {
  switch (action.type) {
    case handledAction + "_" + reduxConstants.PENDING_SUFFIX: {
      const pendingAction = ((action: any): AsyncPendingAction<string, T>);

      const oldCacheKey = state.meta?.cacheKey;
      const newCacheKey = pendingAction.meta?.cacheKey;
      const shouldClearData = oldCacheKey !== newCacheKey;

      return {
        ...state,
        data: shouldClearData ? null : state.data,
        meta: pendingAction.meta,
        isFetching: true,
        lastFetchTime: pendingAction.meta.timestamp
      };
    }
    case handledAction + "_" + reduxConstants.SUCCESS_SUFFIX: {
      const successAction = ((action: any): AsyncSuccessAction<string, T>);

      // Ignore stale requests
      if (successAction.meta.requestId !== state.meta?.requestId) {
        return state;
      }

      return {
        ...state,
        isFetching: false,
        data: successAction.payload,
        error: null,
        isInvalidated: false,
        consecutiveFailureCount: 0,
        lastSuccessTime: successAction.meta.timestamp
      };
    }
    case handledAction + "_" + reduxConstants.FAILURE_SUFFIX: {
      const failureAction = ((action: any): AsyncErrorAction<string>);

      // Ignore stale requests
      if (failureAction.meta.requestId !== state.meta?.requestId) {
        return state;
      }

      return {
        ...state,
        isFetching: false,
        error: failureAction.payload,
        consecutiveFailureCount: state.consecutiveFailureCount + 1
      };
    }
    case handledAction + "_" + reduxConstants.INVALIDATE_SUFFIX:
      return {
        ...state,
        isInvalidated: true
      };
    case handledAction + "_" + reduxConstants.CLEAR_SUFFIX:
      return {
        ...state,
        ...initialAsyncState
      };
    case ACTION_TYPE_LOGOUT: {
      // Possibly ignore some types of handledAction here....
      return {
        ...initialAsyncState
      };
    }
    case ACTION_TYPE_CLEAR_TRANSIENT_STATE: {
      // Clear transient properties when requested (usually on app startup)
      return {
        ...state,
        isFetching: false,
        isInvalidated: true
      };
    }
  }
  return state;
}

/**
 * Generic reducer for state that maps a key extracted from the meta block of each action to async state concerning that key.
 *
 * For instance, it could be used to maintain a map from "business IDs" to async state about each of those businesses.
 *
 * @param {Object} settings - Configuration for this reducer
 * @param {string} settings.handledAction - The name of the action to handle
 * @param {string} settings.mappingKeyExtractor - Function that extracts the name of the key to use in order to map actions to the correct nested reducer
 * @param {func} settings.nestedReducer - A reducer to handle each mapped key
 * @param {Object} [state={}] The previous chunk of state, in the form of a map from IDs to async state.
 * @param {Object} action - The redux standard action used to update state
 * @returns {Object} The updated chunk of state
 */
export function mappingReducer<S>(
  settings: MappingReducerSettings<S>,
  state: MappingReducerState<S> = {},
  action: FluxStandardAction
): MappingReducerState<S> {
  const { handledAction, mappingKeyExtractor, nestedReducer } = settings;

  if (action.type.startsWith(handledAction)) {
    const mappingKey = mappingKeyExtractor(action);
    if (mappingKey === undefined) {
      if (action.type.endsWith(reduxConstants.CLEAR_SUFFIX)) {
        return {};
      } else {
        console.warn(`${handledAction} without a mapping key`, action);
      }
    } else {
      const previousState: S = state[mappingKey] || undefined;
      return {
        ...state,
        [mappingKey]: nestedReducer(previousState, action)
      };
    }
  }

  return state;
}

export const initialPaginatedState: AsyncPaginatedState<any, any> = Object.freeze({
  ...initialAsyncState,
  pagination: null
});

/**
 * A standard reducer to handle async actions that refer to paginatable states
 *
 * @param {string} handledAction - The action name for the action that is handled by this reducer
 * @param {Object} [state=initialPaginatedState] - The pre-existing state to be mutated by this reducer
 * @param {function} isFirstPageFn - Predicate accepting the pagination object as parameter, which indicates whether or not
 *  this is the first page
 * @param {Object} action - The action that this reducer must mutate state in response to
 * @param {string} action.type - The type of the action
 * @param {Object} action.payload - The payload of the action
 * @param {Object} [action.payload.meta] - The meta of the original action
 * @param {Object} [action.payload.meta.pagination] - The pagination object of the action
 * @param {Object} action.payload[dataParameter] - The data to be saved/appended into state
 *
 * @returns {Object} The new state
 */
export function asyncPaginatedActionReducer<T, P>(
  handledAction: string,
  isFirstPageFn: P => boolean,
  state: AsyncPaginatedState<T, P> = initialPaginatedState,
  action: AsyncLifecycleActions<T> | ClearTransientStateAction | LogoutAction
): AsyncPaginatedState<T, P> {
  switch (action.type) {
    case handledAction + "_" + reduxConstants.PENDING_SUFFIX: {
      const pendingAction = ((action: any): AsyncPendingAction<string, *>);
      return {
        ...state,
        meta: pendingAction.meta,
        isFetching: true,
        lastFetchTime: pendingAction.meta.timestamp
      };
    }
    case handledAction + "_" + reduxConstants.SUCCESS_SUFFIX: {
      const successAction = ((action: any): AsyncSuccessAction<string, {| data: Array<T>, pagination: P |}>);

      // Ignore stale requests
      if (successAction.meta.requestId !== state.meta?.requestId) {
        return state;
      }

      const pagination = successAction.payload?.pagination;
      const payloadData = successAction.payload?.data;

      let data = [];

      if (!payloadData) {
        data = state.data;
      } else if (!pagination || isFirstPageFn(pagination)) {
        // If there wasn't any pagination available, still save the data (in case it's fake offline data, which has no pagination)
        data = payloadData;
      } else {
        data = [...(state.data ?? []), ...payloadData];
      }

      return {
        ...state,
        isFetching: false,
        data: data,
        pagination: pagination,
        error: null,
        isInvalidated: false,
        consecutiveFailureCount: 0,
        lastSuccessTime: successAction.meta.timestamp
      };
    }
    case handledAction + "_" + reduxConstants.FAILURE_SUFFIX: {
      const failureAction = ((action: any): AsyncErrorAction<string>);

      // Ignore stale requests
      if (failureAction.meta.requestId !== state.meta?.requestId) {
        return state;
      }

      return {
        ...state,
        isFetching: false,
        error: failureAction.payload,
        consecutiveFailureCount: state.consecutiveFailureCount + 1
      };
    }
    case handledAction + "_" + reduxConstants.INVALIDATE_SUFFIX:
      return {
        ...state,
        pagination: null,
        isInvalidated: true
      };
    case handledAction + "_" + reduxConstants.CLEAR_SUFFIX:
      return {
        ...state,
        ...initialPaginatedState
      };
    case ACTION_TYPE_LOGOUT: {
      // Possibly ignore some types of handledAction here....
      return {
        ...initialPaginatedState
      };
    }
    case ACTION_TYPE_CLEAR_TRANSIENT_STATE: {
      // Clear transient properties when requested (usually on app startup)
      return {
        ...state,
        isFetching: false,
        isInvalidated: true
      };
    }
  }
  return state;
}

/**
 * Helper function that creates a valid successful async state with pre-defined data
 */
export function successState<T>(data: T, cacheKey: ?string = null): AsyncState<T> {
  const now = Date.now();
  return {
    consecutiveFailureCount: 0,
    data: data,
    error: null,
    isFetching: false,
    isInvalidated: false,
    lastFetchTime: now,
    lastSuccessTime: now,
    meta: {
      cacheKey: cacheKey,
      requestId: now,
      timestamp: now
    }
  };
}

/**
 * Helper function that converts the data type of another AsyncState object, leaving everything else intact
 */
export function transformAsyncState<X, Y>(state: AsyncState<X>, fn: X => ?Y, fallbackData: ?Y = null): AsyncState<Y> {
  return {
    consecutiveFailureCount: state.consecutiveFailureCount,
    data: state.data ? fn(state.data) : fallbackData,
    error: state.error,
    isFetching: state.isFetching,
    isInvalidated: state.isInvalidated,
    lastFetchTime: state.lastFetchTime,
    lastSuccessTime: state.lastSuccessTime,
    meta: state.meta
  };
}
