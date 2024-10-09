import instance from ".";
import { endpoints } from "./config";

const loginApi = async (data) => {
  return instance.post(endpoints.login, data);
};

const getMyProfile = async () => {
  return instance.get(endpoints.getMyProfile);
};

export { loginApi, getMyProfile };
