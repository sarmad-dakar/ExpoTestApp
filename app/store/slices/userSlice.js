import { getMyProfile, getUserProfile } from "@/app/api/Auth";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  profile: null,
  token: null,
};

export const fetchMyProfile = createAsyncThunk("myProfile", async (data) => {
  try {
    console.log("are we here?");
    const response = await getMyProfile(data);
    return response.data;
  } catch (error) {}
});

export const fetchuserProfile = createAsyncThunk(
  "userProfile",
  async (data) => {
    try {
      const response = await getUserProfile(data);
      return response.data;
    } catch (error) {}
  }
);

// create a slice of user
const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.profile = null;
    },
    saveLoginDetails: (state, action) => {
      state.user = action.payload;
      state.token = action.payload.token;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMyProfile.fulfilled, (state, action) => {
      console.log(action.payload.data, "Hello world");
      state.profile = action.payload.data;
    });
    builder.addCase(fetchuserProfile.fulfilled, (state, action) => {
      state.user = action.payload.data;
    });
  },
});
const reducer = user.reducer;

export default reducer;

export const { logout, saveLoginDetails } = user.actions;
