// @flow

import {
  ACTION_TYPE_CLEAR_TRANSIENT_STATE,
  type AppActions,
  type AppState,
  type AppStore,
  type Dispatch
} from "./redux.types";
import type { PersistConfig, Persistor } from "redux-persist/lib/types";

import AsyncStorage from "@react-native-community/async-storage";
import Reactotron from "reactotron-react-native";
import { reactotronRedux } from "reactotron-redux";
import { compose, createStore, applyMiddleware, type Reducer } from "redux";
import { enableBatching } from "redux-batched-actions";
import { createLogger } from "redux-logger";
import { persistStore, persistReducer } from "redux-persist";

import reduxConstants from "./reduxConstants";

import thunk from "redux-thunk";
import promise from "redux-promise-middleware";

import rootReducer from "./reducers";

const promiseMiddleware = promise({
  promiseTypeSuffixes: [reduxConstants.PENDING_SUFFIX, reduxConstants.SUCCESS_SUFFIX, reduxConstants.FAILURE_SUFFIX]
});

const middlewares = [thunk, promiseMiddleware];

/**
 *
 * @param isTest - Flag indicating whether the store is being created for the purposes of automated testing, meaning we will remove some unnecessary functionality such as persistence
 * @param initialState - Optional initial state to populate the store with.
 * @param callback - Callback invoked after rehydration is complete
 * @return {*} - An object containing the store and possibly a persistor object provided by redux-persist
 */
export const storeCreator = (
  isTest: boolean,
  initialState: $Shape<AppState>,
  callback: () => any
): {
  store: AppStore,
  persistor?: Persistor
} => {
  let enhancedRootReducer: Reducer<AppState, AppActions> = enableBatching(rootReducer);

  if (!isTest) {
    // Only top-level keys can currently be blacklisted: https://github.com/rt2zz/redux-persist/issues/128
    const persistConfig: PersistConfig = {
      blacklist: ["wriCache"],
      key: "root",
      storage: AsyncStorage
    };

    const persistedReducer = persistReducer<AppState, AppActions>(persistConfig, enhancedRootReducer);
    enhancedRootReducer = ((persistedReducer: any): Reducer<AppState, AppActions>);

    // Do not log in release mode
    if (__DEV__) {
      // See: https://github.com/fcomb/redux-logger
      middlewares.push(
        createLogger({
          level: {
            prevState: false,
            action: "info",
            nextState: false,
            error: "error"
          },
          duration: true
        })
      );

      // Setup Reactotron
      Reactotron.setAsyncStorageHandler(AsyncStorage)
        .configure({
          host: "localhost" // change this to your dev machine's ip address if connecting to a local device
        })
        .useReactNative()
        .use(reactotronRedux())
        .connect();
    }
  }

  const middlewareEnhancer = applyMiddleware(...middlewares);
  const isReactotronReduxInstalled = !!Reactotron.createEnhancer;
  const store: AppStore = createStore<AppState, AppActions, Dispatch>(
    enhancedRootReducer,
    initialState,
    isReactotronReduxInstalled
      ? compose(
          middlewareEnhancer,
          Reactotron.createEnhancer()
        )
      : middlewareEnhancer
  );

  if (isTest) {
    callback();
    return { store };
  }

  const persistor: Persistor = persistStore(store, null, () => {
    store.dispatch({ type: ACTION_TYPE_CLEAR_TRANSIENT_STATE });
    callback();
  });
  return { store, persistor: persistor };
};

/**
 * Default store creator is not a test store
 */
export default (callback: () => any) => storeCreator(false, {}, callback);
