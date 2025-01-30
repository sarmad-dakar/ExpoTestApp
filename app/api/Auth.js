import axios from "axios";
import instance, { generalApi } from ".";
import { endpoints } from "./config";

const loginApi = async (data) => {
  return instance.post(endpoints.login, data);
};

const getMyProfile = async () => {
  return instance.get(endpoints.getMyProfile);
};

const getUserProfile = async () => {
  return instance.get(endpoints.validate);
};

const refreshToken = async (data) => {
  const formData = new URLSearchParams();

  // Append key-value pairs
  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });

  return instance.post(endpoints.refresh, formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};

const updateUserInfo = async (data) => {
  return instance.post(endpoints.updateUserInfo, data);
};

const postContactus = async (data) => {
  return instance.post(endpoints.contactus, data);
};

const updateProfilePic = async (data) => {
  return instance.post(endpoints.updateProfile, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const changePassword = async (data) => {
  return instance.post(endpoints.changePass, data);
};

const changePin = async (data) => {
  return instance.post(endpoints.changePass, data);
};

const forgotPassword = async (data) => {
  return instance.get(endpoints.forgotPassword + data);
};

const getAllClubs = async () => {
  return instance.get(endpoints.getClubs);
};

const getGeneralAllClubs = async () => {
  return axios.get(generalApi + "api/v1/" + endpoints.getClubs);
};

export {
  loginApi,
  getMyProfile,
  updateProfilePic,
  updateUserInfo,
  getUserProfile,
  postContactus,
  changePassword,
  changePin,
  forgotPassword,
  getAllClubs,
  getGeneralAllClubs,
  refreshToken,
};
