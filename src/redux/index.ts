import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { combineReducers } from "redux";
import authReducer from "../redux/auth/store";
import { refreshMiddleware } from "../utils/refreshMiddleware";
import conversationReducer from "../redux/conversation/store";
import messageReducer from "../redux/message/store";
import roomReducer from "../redux/room/store";
import roomDetailReducer from "../redux/room-detail/store";
import roomTypeReducer from "../redux/room-type/store";
import buildingReducer from "../redux/building/store";
import amenitiesReducer from "../redux/amenities/store";
import furnituresReducer from "../redux/furnitures/store";
import servicesReducer from "../redux/services/store";
import contractsReducer from "../redux/contracts/store";
import invoiceReducer from "../redux/invoice/store";
import recentActivitiesReducer from "../redux/recent-activities/store";
import bookingReducer from "../redux/booking/store";
const rootReducer = combineReducers({
  auth: authReducer,
  conversation: conversationReducer,
  message: messageReducer,
  room: roomReducer,
  roomDetail: roomDetailReducer,
  roomType: roomTypeReducer,
  building: buildingReducer,
  amenities: amenitiesReducer,
  furnitures: furnituresReducer,
  services: servicesReducer,
  contracts: contractsReducer,
  invoice: invoiceReducer,
  recentActivities: recentActivitiesReducer,
  booking: bookingReducer,
});
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(refreshMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export default store;
export type AppStore = typeof store;
