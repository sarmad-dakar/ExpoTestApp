import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  FetchAvailableSports,
  GetAccountData,
  GetNotificationsData,
  GetRemainingBalance,
  GetSubscriptionData,
} from "../../api/Bookings";

const initialState = {
  accountData: [],
  subscriptionData: [],
  notificationsData: [],
  sportsData: [],
  balance: 0,
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
export const fetchRemainingBalance = createAsyncThunk(
  "remainingBalance",
  async () => {
    try {
      const response = await GetRemainingBalance();
      return response.data;
    } catch (error) {}
  }
);

// create a slice of user
const slice = createSlice({
  name: "booking",
  initialState: initialState,
  reducers: {
    clearSportsAndWallet: (state) => {
      state.balance = 0;
      state.sportsData = [];
    },
  },
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
    builder.addCase(fetchRemainingBalance.fulfilled, (state, action) => {
      console.log(action.payload, "remaining balance ");
      state.balance = action.payload;
    });
  },
});
const reducer = slice.reducer;

export default reducer;

export const { clearWallet, clearSportsAndWallet } = slice.actions;
