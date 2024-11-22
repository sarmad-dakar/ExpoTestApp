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
import Pdf from "react-native-pdf";

// Get screen dimensions
const { height } = Dimensions.get("window");

export type PaymentWebviewPopupRef = {
  show: (url: string) => void;
  hide: () => void;
};

type PaymentWebviewPopupProps = {
  reference?: RefObject<PaymentWebviewPopupRef>;
};

const PaymentWebviewPopup = forwardRef<
  PaymentWebviewPopupRef,
  PaymentWebviewPopupProps
>((props, ref) => {
  const translateY = useRef(new Animated.Value(height)).current;
  const [visible, setVisible] = useState(false);
  const [url, setUrl] = useState("");

  useImperativeHandle(ref || props.reference, () => ({
    hide: hide,
    show: show,
  }));

  const hide = () => {
    setVisible(false);
  };

  const show = (url: string) => {
    setUrl(url);
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
    }).start(() => setVisible(false));
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
        style={[styles.bottomSheet, { transform: [{ translateY }] }]}
      >
        <View style={styles.content}>
          {/* <WebView
            source={{
              uri: url,
            }}
            style={{ flex: 1 }}
          /> */}
          <Pdf source={{ uri: url, cache: true }} />
        </View>
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
    height: height * 0.8,
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

export default PaymentWebviewPopup;
