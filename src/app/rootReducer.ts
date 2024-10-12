import { clientApi } from "@/client-api";
import { combineReducers } from "@reduxjs/toolkit";

export const rootReducer = combineReducers({
  [clientApi.reducerPath]: clientApi.reducer,
});
