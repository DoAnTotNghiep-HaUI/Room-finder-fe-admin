import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { combineReducers } from "redux";

const rootReduce = combineReducers({});
const store = configureStore({ reducer: rootReduce });

export type RootState = ReturnType<typeof store.getState>;
export type AppState = ReturnType<typeof rootReduce>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export default store;
export type AppStore = typeof store;
