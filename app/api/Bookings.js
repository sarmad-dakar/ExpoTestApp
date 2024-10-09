import instance from ".";
import { endpoints } from "./config";

const FetchMyBookings = async (data) => {
  return instance.get(`${endpoints.myBookings + data.sport}/${data.year}`);
};

const GetAccountData = async (data) => {
  return instance.get(endpoints.getAccountInfo);
};

const GetSubscriptionData = async (data) => {
  return instance.get(endpoints.getSubscriptionData);
};

const GetNotificationsData = async () => {
  return instance.get(endpoints.getNotifications);
};

const FetchCalendarData = async (data) => {
  return instance.get(`Booking/sport/${data.sport}/booking/${data.date}`);
};

const FetchMembers = async (data) => {
  return instance.get(`Member/sport/${data.sport}/members`);
};

const FetchAmountDue = async (data) => {
  return instance.post(`Booking/sport/booking/amountdue`, data);
};

export {
  FetchMyBookings,
  GetAccountData,
  GetSubscriptionData,
  GetNotificationsData,
  FetchCalendarData,
  FetchMembers,
  FetchAmountDue,
};
