import Toast from "react-native-toast-message";
import { vh } from "./units";

export const showSuccessToast = (message) => {
  Toast.show({
    type: "success",
    text1: message,
  });
};

export const showErrorToast = (message) => {
  Toast.show({
    type: "error",
    text1: "Error",
    text2Style: { fontSize: vh * 1.2 },
    text2: message,
  });
};

export const showInfoToast = (message) => {
  Toast.show({
    type: "info",
    text1: "Info",
    text2: message,
    text2Style: { fontSize: vh * 1.2 },
  });
};
