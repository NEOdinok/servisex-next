import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface CartState {
  items: Array<number>;
}

const initialState = {
  items: [1, 2, 3],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    noop: () => {},
  },
});

export const { noop } = cartSlice.actions;

export default cartSlice.reducer;
