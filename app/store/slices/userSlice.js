import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
};

// create a slice of user
const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
    saveLoginDetails: (state, action) => {
      state.user = action.payload;
      state.token = action.payload.token;
    },
  },
});
const reducer = user.reducer;

export default reducer;

export const { logout, saveLoginDetails } = user.actions;
