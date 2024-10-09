import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  GetAccountData,
  GetNotificationsData,
  GetSubscriptionData,
} from "../../api/Bookings";

const initialState = {
  accountData: [],
  subscriptionData: [],
  notificationsData: [],
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

// create a slice of user
const slice = createSlice({
  name: "booking",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchMyAccount.fulfilled, (state, action) => {
      state.accountData = action.payload.data;
    });
    builder.addCase(fetchMySubscription.fulfilled, (state, action) => {
      console.log(action.payload.data.data.details, "payload in subscription");
      state.subscriptionData = action.payload.data.details;
    });
    builder.addCase(fetchMyNotifications.fulfilled, (state, action) => {
      state.notificationsData = action.payload.data;
    });
  },
});
const reducer = slice.reducer;

export default reducer;

export const {} = slice.actions;
