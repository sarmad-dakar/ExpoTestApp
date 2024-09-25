import instance from ".";
import { endpoints } from "./config";

const loginApi = async (data) => {
  return instance.post(endpoints.login, data);
};

export { loginApi };
