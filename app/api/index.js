import axios from "axios";
import { store } from "../store";
import { logout } from "../store/slices/userSlice";
import { toggleGeneralLoader } from "../store/slices/generalSlice";

const version = "v1/";
const liveUrl = "https://api.mscbookings.com/api/";
const generalApi = "https://unionclubapi.dakarhr.com/api/";
const testUrl = "http://mscapi.dakarhr.com/api/";

const instance = axios.create({
  baseURL: generalApi + version,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setBaseURL = (url) => {
  let baseUrl = url + "api/" + version;
  instance.defaults.baseURL = baseUrl;
};

instance.interceptors.request.use(
  (config) => {
    // You can add request headers or do other modifications here
    const state = store.getState();
    store.dispatch(toggleGeneralLoader(true));
    if (state.user?.token) {
      config.headers.Authorization = `Bearer ${state.user.token}`;
    }
    return config;
  },
  (error) => {
    // Handle request error (e.g., network issues)
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    store.dispatch(toggleGeneralLoader(false));

    // Check for successful response status codes (e.g., 2xx)
    if (response.status >= 200 && response.status < 300) {
      // You can perform response transformations here
      // For example, you can extract the data you need
      return response;
    } else {
      // Handle other non-successful status codes (e.g., 4xx, 5xx)
      return Promise.reject(response);
    }
  },
  async (error) => {
    // Handle response error (e.g., 4xx, 5xx)
    store.dispatch(toggleGeneralLoader(false));
    console.log(JSON.stringify(error), "error");
    if (error.response) {
      // You can access the response status code, data, headers, etc.
      const { status, data } = error.response;
      console.log(data, "error");
      // Handle specific error codes as needed
      if (status === 401) {
        await store.dispatch(logout());

        // return Promise.reject({message: 'Token Expired', status: 401});
        // Unauthorized: Redirect or handle accordingly
      } else if (status === 404) {
        // Resource not found: Handle accordingly
      } else {
        // Handle other error codes
        // You can log the error or display a user-friendly message
      }
      if (data.message) {
        return Promise.reject(data.message);
      }

      return Promise.reject(error);
    } else {
      // Handle network errors or other issues
      return Promise.reject(error);
    }
  }
);

export default instance;
