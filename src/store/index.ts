import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // ✅ Correct import
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";

import memberSlice from "./slices/memberSlice";
import marketerSlice from "./slices/marketerSlice";
import smallCostSlice from "./slices/smallCostSlice";
import otherCostSlice from "./slices/otherCostSlice";
import moreInfoSlice from "./slices/moreInfoSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["members", "marketers", "smallCosts", "otherCosts", "moreInfo"],
};

const rootReducer = combineReducers({
  members: memberSlice,
  marketers: marketerSlice,
  smallCosts: smallCostSlice,
  otherCosts: otherCostSlice,
  moreInfo: moreInfoSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// ✅ Correct way to type hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
// export const useAppSelector = useSelector.withTypes<RootState>();
