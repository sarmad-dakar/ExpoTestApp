import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";

const initialState = {
  btnLoader: false,
  generalLoader: false,
  internetConnectivity: true,
  clubConfig: {},
  skipIntro: false,
  allClubs: [],
  nextFetchDate: null,
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
      state.internetConnectivity = action.payload;
    },
    setClubConfig: (state, action) => {
      state.clubConfig = action.payload;
    },
    switchUser: (state, action) => {
      state.clubConfig = null;
    },
    skipIntro: (state, action) => {
      state.skipIntro = true;
    },
    setAllClubs: (state, action) => {
      state.allClubs = action.payload;
      // Store nextFetchDate as an ISO string (which is serializable)
      state.nextFetchDate = moment().add(48, "hours").toISOString();
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
  skipIntro,
  setAllClubs,
} = slice.actions;
