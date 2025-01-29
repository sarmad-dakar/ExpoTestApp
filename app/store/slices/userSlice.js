import { getMyProfile, getUserProfile, refreshToken } from "@/app/api/Auth";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  profile: null,
  token: null,
  multipleUsers: [],
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

export const fetchnewToken = createAsyncThunk("newToken", async (data) => {
  try {
    const response = await refreshToken(data);
    return response.data;
  } catch (error) {}
});

// create a slice of user
const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      const removeMultipleUser = state.multipleUsers.filter(
        (item) => item?.user?.token !== state.token
      );

      state.multipleUsers = removeMultipleUser;
      state.user = null;
      state.token = null;
      state.profile = null;
    },
    saveLoginDetails: (state, action) => {
      state.user = action.payload;
      state.token = action.payload.token;
    },
    removeLoginDetails: (state) => {
      state.user = null;
      state.token = null;
    },
    saveMultipleUsers: (state, action) => {
      state.multipleUsers = [...state.multipleUsers, action.payload];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMyProfile.fulfilled, (state, action) => {
      console.log(action.payload.data, "Hello world");
      state.profile = action.payload.data;
    });
    builder.addCase(fetchuserProfile.fulfilled, (state, action) => {
      state.user = action.payload.data;
      state.token = action.payload.data?.token;
    });
    builder.addCase(fetchnewToken.fulfilled, (state, action) => {
      state.user = action.payload.data;
      state.token = action.payload.data?.token;
    });
  },
});
const reducer = user.reducer;

export default reducer;

export const {
  logout,
  saveLoginDetails,
  saveMultipleUsers,
  removeLoginDetails,
} = user.actions;
