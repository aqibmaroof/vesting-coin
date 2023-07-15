import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { persistReducer, createTransform } from "redux-persist";
import thunk from "redux-thunk";
import { metaMaskReducer } from "./reducer";
import providerReducer from "./provider";
import { stakeTransactionReducer } from "./stakeTransaction";

const reducers = combineReducers({
  reducer: metaMaskReducer,
  providerReducer,
});
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["reducer", "stakeTransactionReducer"],
};
const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: { persistedReducer, stakeTransactionReducer },
  middleware: [thunk],
});

export default store;
