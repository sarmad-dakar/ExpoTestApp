import instance from ".";
import { endpoints } from "./config";

const FetchMyBookings = async (data) => {
  return instance.get(`${endpoints.myBookings + data.sport}/${data.year}`);
};

export { FetchMyBookings };
