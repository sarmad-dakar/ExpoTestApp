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
  console.log(`Member/sport/${data.sport}/members`, "api url");

  return instance.get(`Member/sport/${data.sport}/members`);
};

const FetchAmountDue = async (data) => {
  return instance.post(`Booking/sport/booking/amountdue`, data);
};

const FetchAvailableSports = async (data) => {
  return instance.get("SportServices/sport/services");
};

const AddToFavorite = async (data) => {
  return instance.post(endpoints.addToFavorite, data);
};

const CreateBooking = async (data) => {
  return instance.post(endpoints.confirmBooking, data);
};
const CancelBooking = async (data) => {
  return instance.post(endpoints.cancelBooking, data);
};
const GetAlreadyBookedDetails = async (data) => {
  return instance.get(
    `${endpoints.getAlreadyBookedDetails}${data.sport}/${data.id}`
  );
};
export {
  FetchMyBookings,
  GetAccountData,
  GetSubscriptionData,
  GetNotificationsData,
  FetchCalendarData,
  FetchMembers,
  FetchAmountDue,
  FetchAvailableSports,
  AddToFavorite,
  CreateBooking,
  CancelBooking,
  GetAlreadyBookedDetails,
};
