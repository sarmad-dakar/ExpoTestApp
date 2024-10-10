import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  testValue: "Hello world",
};

// create a slice of user
const slice = createSlice({
  name: "general",
  initialState,
  reducers: {},
});
const reducer = slice.reducer;

export default reducer;

export const {} = slice.actions;
