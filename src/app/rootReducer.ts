import { baseApi } from "@/api";
import { cartSlice } from "@/slices/cartSlice";
import { combineReducers } from "@reduxjs/toolkit";

export const rootReducer = combineReducers({
  [cartSlice.reducerPath]: cartSlice.reducer,
  [baseApi.reducerPath]: baseApi.reducer,
});
