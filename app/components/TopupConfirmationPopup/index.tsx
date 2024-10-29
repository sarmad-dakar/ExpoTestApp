import React, {
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
  RefObject,
} from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
  Text,
  Linking,
  Alert,
} from "react-native";
import BerlingskeBold from "../TextWrapper/BerlingskeBold";
import InputField from "../InputField";
import { TopupBalance } from "@/app/api/Bookings";
import * as WebBrowser from "expo-web-browser";
import InAppBrowser from "react-native-inappbrowser-reborn";
import WebView from "react-native-webview";
import { fetchRemainingBalance } from "@/app/store/slices/accountSlice";
import { useAppDispatch } from "@/app/screens/HomeScreens/LandingScreen";
import { showErrorToast } from "@/app/utils/toastmsg";

// Get screen dimensions
const { height } = Dimensions.get("window");

export type TopupConfirmationPopupRef = {
  show: () => void;
  hide: () => void;
};

type TopupConfirmationPopupProps = {
  reference?: RefObject<TopupConfirmationPopupRef>;
};

const TopupConfirmationPopup = forwardRef<
  TopupConfirmationPopupRef,
  TopupConfirmationPopupProps
>((props, ref) => {
  const translateY = useRef(new Animated.Value(height)).current;
  const [visible, setVisible] = useState(false);
  const [amount, setAmount] = useState<string>("");
  const [steps, setSteps] = useState(1);
  const [url, setUrl] = useState("");
  const dispatch = useAppDispatch();
  useImperativeHandle(ref || props.reference, () => ({
    hide: hide,
    show: show,
  }));

  const hide = () => {
    setSteps(1);
    dispatch(fetchRemainingBalance());
    setVisible(false);
  };

  const show = () => {
    setSteps(1);
    setVisible(true);
  };

  useEffect(() => {
    if (visible) {
      slideUp();
    } else {
      slideDown();
    }
  }, [visible]);

  const slideUp = () => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const slideDown = () => {
    Animated.timing(translateY, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => hide());
  };

  const handleConfirm = async () => {
    const topupAmount = parseFloat(amount);
    if (!topupAmount) {
      showErrorToast("Please write an amount");
      return;
    }
    if (topupAmount < 20) {
      showErrorToast("Minimum topup amount should be 20");
      return;
    }
    let data = {
      Amount: topupAmount,
      Comment: "",
      PinCode: "",
    };
    const result = await TopupBalance(data);
    console.log(result.data, "amount");
    // hide();

    if (result.data?.data?.isok) {
      const paymentUrl = result.data?.data?.url;
      setUrl(paymentUrl);
      setSteps(2);
      // let webResponse = await WebBrowser.openBrowserAsync(paymentUrl, {});
      // console.log(webResponse, "web response");
      // Linking.openURL(result.data?.data?.url);
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={slideDown}
    >
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={slideDown}
      />
      <Animated.View
        style={[
          styles.bottomSheet,
          {
            height: steps == 1 ? height * 0.4 : height * 1,
          },
          { transform: [{ translateY }] },
        ]}
      >
        {steps == 1 ? (
          <View style={styles.content}>
            <BerlingskeBold>Confirm Top-up</BerlingskeBold>
            <Text>Please enter the amount you wish to top-up:</Text>

            <InputField
              keyboardType="decimal-pad"
              placeholder="Amount"
              value={amount}
              onChangeText={setAmount}
            />

            <View style={styles.rowDirection}>
              <TouchableOpacity onPress={hide} style={styles.btn}>
                <Text style={{ color: "white" }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#6AAF2E" }]}
                onPress={handleConfirm}
              >
                <Text style={{ color: "white" }}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.content}>
            <WebView
              source={{
                uri: url,
              }}
              style={{ flex: 1 }}
            />
          </View>
        )}
      </Animated.View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    height: height * 0.4,
  },
  content: {
    flex: 1,
    paddingTop: 10,
  },
  rowDirection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  btn: {
    height: 50,
    width: "48%",
    backgroundColor: "#D0373F",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TopupConfirmationPopup;
