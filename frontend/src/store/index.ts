import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import habitsReducer from "./slices/habitsSlice";
import mascotReducer from "./slices/mascotSlice";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["auth"], // Only persist auth state
};

const rootReducer = combineReducers({
  auth: authReducer,
  habits: habitsReducer,
  mascot: mascotReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks for use throughout the app
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
