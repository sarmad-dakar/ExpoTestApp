import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  btnLoader: false,
  generalLoader: false,
};

// create a slice of user
const slice = createSlice({
  name: "general",
  initialState,
  reducers: {
    toggleBtnLoader: (state, action) => {
      state.btnLoader = action.payload;
    },
    toggleGeneralLoader: (state, action) => {
      state.generalLoader = action.payload;
    },
  },
});
const reducer = slice.reducer;

export default reducer;

export const { toggleBtnLoader, toggleGeneralLoader } = slice.actions;
