import { Dimensions } from "react-native";

export const vw = Dimensions.get("window").width * 0.01;
export const vh = Dimensions.get("window").height * 0.01;

export const reduceString = (str, count) => {
  return str.length > count ? str.slice(0, count) + "..." : str;
};
