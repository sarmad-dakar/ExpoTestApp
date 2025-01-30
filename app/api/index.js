import axios from "axios";
import { store } from "../store";
import { fetchnewToken, fetchuserProfile } from "../store/slices/userSlice";
import { toggleGeneralLoader } from "../store/slices/generalSlice";

export const version = "v1/";
export const liveUrl = "https://api.mscbookings.com/";
export const generalApi = "https://unionclubapi.dakarhr.com/";
export const testUrl = "https://mscapi.dakarhr.com/";

const instance = axios.create({
  baseURL: generalApi + "api/" + version,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setBaseURL = (url) => {
  let baseUrl = url + "api/" + version;
  instance.defaults.baseURL = baseUrl;
};

// Request Interceptor
instance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    store.dispatch(toggleGeneralLoader(true));
    if (state.user?.token) {
      config.headers.Authorization = `Bearer ${state.user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Flag to prevent multiple token refresh calls at once
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });

  failedQueue = [];
};

// Response Interceptor
instance.interceptors.response.use(
  (response) => {
    store.dispatch(toggleGeneralLoader(false));
    return response;
  },
  async (error) => {
    store.dispatch(toggleGeneralLoader(false));

    const originalRequest = error.config;
    console.log(originalRequest, "api error");
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // If a token refresh request is already in progress, queue the failed request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return instance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const state = store.getState();
        const previousToken = {
          token: state.user.token,
        };
        await store.dispatch(fetchnewToken(previousToken)); // Refresh the token
        const newToken = state.user?.token;

        processQueue(null, newToken);

        if (newToken) {
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return instance(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
