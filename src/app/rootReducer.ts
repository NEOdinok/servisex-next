import { combineReducers } from "@reduxjs/toolkit";
import { baseApi } from "@/api";
import { cartSlice } from "@/slices/cartSlice";

export const rootReducer = combineReducers({
  [cartSlice.reducerPath]: cartSlice.reducer,
  [baseApi.reducerPath]: baseApi.reducer,
});
