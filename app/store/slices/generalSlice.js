import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  btnLoader: false,
  generalLoader: false,
  internetConnectivity: true,
  clubConfig: {},
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
    toggletInternet: (state, action) => {
      state.generalLoader = action.payload;
    },
    setClubConfig: (state, action) => {
      state.clubConfig = action.payload;
    },
    switchUser: (state, action) => {
      state.clubConfig = null;
    },
  },
});
const reducer = slice.reducer;

export default reducer;

export const {
  toggleBtnLoader,
  toggleGeneralLoader,
  toggletInternet,
  setClubConfig,
  switchUser,
} = slice.actions;
