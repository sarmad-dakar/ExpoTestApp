import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  FetchAvailableSports,
  GetAccountData,
  GetNotificationsData,
  GetSubscriptionData,
} from "../../api/Bookings";

const initialState = {
  accountData: [],
  subscriptionData: [],
  notificationsData: [],
  sportsData: [],
};

export const fetchMyAccount = createAsyncThunk("myAccount", async (data) => {
  try {
    const response = await GetAccountData(data);
    return response.data;
  } catch (error) {}
});

export const fetchMySubscription = createAsyncThunk(
  "mySubscription",
  async (data) => {
    try {
      const response = await GetSubscriptionData(data);
      return response.data;
    } catch (error) {}
  }
);

export const fetchMyNotifications = createAsyncThunk(
  "myNotifications",
  async (data) => {
    try {
      const response = await GetNotificationsData(data);
      return response.data;
    } catch (error) {}
  }
);

export const fetchCurrentSports = createAsyncThunk(
  "currentSports",
  async (data) => {
    try {
      const response = await FetchAvailableSports();
      return response.data;
    } catch (error) {}
  }
);

// create a slice of user
const slice = createSlice({
  name: "booking",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchMyAccount.fulfilled, (state, action) => {
      state.accountData = action.payload.data;
    });
    builder.addCase(fetchMySubscription.fulfilled, (state, action) => {
      state.subscriptionData = action.payload.data.details;
    });
    builder.addCase(fetchMyNotifications.fulfilled, (state, action) => {
      state.notificationsData = action.payload.data;
    });
    builder.addCase(fetchCurrentSports.fulfilled, (state, action) => {
      console.log(action.payload, "data ");
      state.sportsData = action.payload;
    });
  },
});
const reducer = slice.reducer;

export default reducer;

export const {} = slice.actions;
