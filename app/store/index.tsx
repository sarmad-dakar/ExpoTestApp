import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import generalSlice from "./slices/generalSlice";
import bookingSlice from "./slices/bookingSlice";
import accountSlice from "./slices/accountSlice";

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
const persistedConfig = {
  key: "root",
  storage: AsyncStorage,
  blacklist: ["commonReducer"],
};
const reducers = combineReducers({
  user: userSlice,
  general: generalSlice,
  booking: bookingSlice,
  account: accountSlice,
});
const persistedStore = persistReducer(persistedConfig, reducers);

const store = configureStore({
  reducer: persistedStore,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
const persistor = persistStore(store);

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>; // This will infer the shape of the root state
export type AppDispatch = typeof store.dispatch; // The type of dispatch

export { store, persistor };
