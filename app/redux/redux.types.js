// @flow

import type { Actions, State } from "./reducers";
import type { Reducer, Store } from "redux";
import TSCError from "../utils/tscError";

/**
 * Re-export the root reducer state and supported actions from this file for convenience
 */
export type AppActions = Actions | LogoutAction | ClearTransientStateAction;
export type AppActionName = $PropertyType<AppActions, "type">;
export type AppState = State;
export type AppStore = Store<AppState, AppActions, Dispatch>;

/**
 * We assume our reducers are receiving Flux Standard Actions throughout this codebase
 *
 * See https://github.com/redux-utilities/flux-standard-action
 */
export type FluxStandardAction = {|
  +type: string,
  +payload?: ?any,
  +meta?: ?any,
  +error?: boolean
|};

/**
 * Global logout action - not specific to any single reducer
 *
 * Reducers should reset any user-related state when this is received
 */
export const ACTION_TYPE_LOGOUT = "logout";
export type LogoutAction = {|
  +type: "logout"
|};

/**
 * Global action to clear transient state - not specific to any single reducer
 *
 * Reducers should reset any transient state (e.g. isFetching, or currentDate) when this is received
 */
export const ACTION_TYPE_CLEAR_TRANSIENT_STATE = "init/clear_transient_state";
export type ClearTransientStateAction = {|
  +type: "init/clear_transient_state"
|};

/**
 * An item that when dispatched can conditionally dispatch further actions
 */
export type Thunk<T> = (dispatch: Dispatch, getState: GetState) => T;
export type GetState = () => AppState;
export type DispatchPromise = <T>(
  action: AppActions & AsyncAction<T>
) => Promise<{ value: T, action: AsyncSuccessAction<T> }>;
export type DispatchThunk = <T>(action: Thunk<T>) => T;
export type Dispatch = DispatchPromise & ((action: AppActions) => void) & DispatchThunk;

/**
 * The type of action handled by redux-promise-middleware, which takes a promise or async function as its payload
 *
 * T is the type that the async action's promise will resolve to
 */
type PromiseOrAsyncFunction<T> = Promise<T> | (() => Promise<T>);
export type AsyncAction<T> = NamedAsyncAction<string, T>;
export type NamedAsyncActionBase<NAME: string, T> = {|
  +type: NAME,
  +payload: PromiseOrAsyncFunction<T> | {| promise: PromiseOrAsyncFunction<T>, data?: T |},
  +meta?: {
    +cacheKey?: string | number
  }
|};
export type NamedAsyncAction<NAME: string, T> = {|
  +type: NAME,
  +payload: PromiseOrAsyncFunction<T> | {| promise: PromiseOrAsyncFunction<T>, data?: T |},
  +meta: {
    +cacheKey?: string | number,
    +requestId: number,
    +timestamp: number
  }
|};

/**
 * A map of reducers, each reducer corresponding to a key in a part of Redux state (S)
 *
 * This is the type of the value passed to the combineReducers function, which creates a reducer from a reducer map.
 */
export type ReducerMap<S, A> = $ObjMap<S, <T>(T) => Reducer<T, A>>;

/**
 * The action emitted by redux-promise-middleware when it starts processing an async action
 *
 * T is the type of any optimistic payload that is present
 */
export type AsyncPendingAction<NAME: string, T> = {|
  +type: NAME,
  +payload?: ?T,
  +meta: {
    +cacheKey?: string | number,
    +requestId: number,
    +timestamp: number
  },
  +error?: false
|};

/**
 * The success action emitted by redux-promise-middleware when the promise resolves
 *
 * T is the type of the resolved value
 */
export type AsyncSuccessAction<NAME: string, T> = {|
  +type: NAME,
  +payload: T,
  +meta: {
    +cacheKey?: string | number,
    +requestId: number,
    +timestamp: number
  },
  +error?: false
|};

/**
 * The success action emitted by redux-promise-middleware when the promise rejects
 */
export type AsyncErrorAction<NAME: string> = {|
  +type: NAME,
  +payload: TSCError,
  +meta: {
    +cacheKey?: string | number,
    +requestId: number,
    +timestamp: number
  },
  +error: true
|};

export type AsyncLifecycleActions<T> =
  | AsyncPendingAction<string, T>
  | AsyncSuccessAction<string, T>
  | AsyncErrorAction<string>;

/**
 * State used by all of our async reducers
 *
 * T is the type of the data held in state
 */
export type AsyncState<T> = {|
  +consecutiveFailureCount: number,
  +data: ?T,
  +error: ?TSCError,
  +isFetching: boolean,
  +isInvalidated: boolean,
  +lastFetchTime: number,
  +lastSuccessTime: number,
  +meta: ?{
    +cacheKey?: string | number,
    +requestId: number,
    +timestamp: number
  }
|};

/**
 * State used by all of our paginated reducers
 *
 * T is the type of each entry of the array held in state
 * P is the type of the pagination payload returned by the server
 */
export type AsyncPaginatedState<T, P> = {|
  +consecutiveFailureCount: number,
  +data: ?Array<T>,
  +error: ?TSCError,
  +isFetching: boolean,
  +isInvalidated: boolean,
  +lastFetchTime: number,
  +lastSuccessTime: number,
  +meta: ?{
    +requestId: number,
    +timestamp: number
  },
  +pagination: ?P
|};

/**
 * Settings used to configure the mapping reducer
 *
 * S is the type of the state managed by the nested reducer
 */
export type MappingReducerSettings<S> = {
  handledAction: string,
  mappingKeyExtractor: FluxStandardAction => string | typeof undefined,
  nestedReducer: (S, FluxStandardAction) => S
};

/**
 * State used by the mapping reducer
 *
 * S is the type of the state managed by the nested reducer
 */
export type MappingReducerState<S> = {
  +[string]: S
};

/**
 * Properties sent through to a connected component.
 *
 * Taken from https://engineering.wework.com/adventures-in-static-typing-react-redux-flow-oh-my-284c5f74adac
 */
export type ExtractReturn<Fn> = $Call<<T>((...Iterable<any>) => T) => T, Fn>;
type ReduxProps<M, D> = $ReadOnly<{|
  ...ExtractReturn<M>,
  ...ExtractReturn<D>
|}>;
export type ComponentProps<OP, MSP, MDP> = {|
  ...OP,
  ...ReduxProps<MSP, MDP>
|};
