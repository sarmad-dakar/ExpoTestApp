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
  Image,
  Alert,
} from "react-native";
import BerlingskeBold from "../TextWrapper/BerlingskeBold";
import { images } from "@/app/MyAssets";
import moment from "moment";
import InputField from "../InputField";
import { showErrorToast } from "@/app/utils/toastmsg";

// Get screen dimensions
const { height } = Dimensions.get("window");

export type BookingConfirmationPopupRef = {
  show: () => void;
  hide: () => void;
};

type BookingConfirmationPopupProps = {
  onAccept: (item: any) => void;
  reference?: RefObject<BookingConfirmationPopupRef>; // Optional if passing forwardRef
};

const BookingConfirmationPopup = forwardRef<
  BookingConfirmationPopupRef,
  BookingConfirmationPopupProps
>((props, ref) => {
  const translateY = useRef(new Animated.Value(height)).current; // Initial position (off-screen)
  const [visible, setVisible] = useState(false);
  const [pinCode, setPinCode] = useState();

  useImperativeHandle(ref || props.reference, () => ({
    hide: hide,
    show: show,
  }));

  const hide = () => {
    setVisible(false);
  };

  const show = () => {
    setVisible(true);
  };

  useEffect(() => {
    if (visible) {
      slideUp();
    } else {
      slideDown();
    }
  }, [visible]);

  // Slide-up animation
  const slideUp = () => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Slide-down animation
  const slideDown = () => {
    Animated.timing(translateY, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setVisible(false)); // Call onClose after animation
  };

  const handleAccept = () => {
    if (!pinCode) {
      showErrorToast("Please provide the pin code");
      return;
    }
    hide();
    props.onAccept(pinCode);
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
          { transform: [{ translateY }] }, // Animated slide-up
        ]}
      >
        {/* Bottom sheet content */}
        <View style={styles.content}>
          <BerlingskeBold>Confirm Booking</BerlingskeBold>
          <Text>Please provide pin to book this session ?</Text>

          <InputField
            // keyboardType="number-pad"
            placeholder="Pin code"
            onChangeText={setPinCode}
          />

          <View style={styles.rowDirection}>
            <TouchableOpacity onPress={hide} style={styles.btn}>
              <Text style={{ color: "white" }}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, { backgroundColor: "#6AAF2E" }]}
              onPress={handleAccept}
            >
              <Text style={{ color: "white" }}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
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
    height: height * 0.4, // Adjust height as needed
  },
  content: {
    flex: 1,
    paddingTop: 10,
  },
  courtImage: {
    height: 250,
    marginTop: 20,
    borderRadius: 20,
    overflow: "hidden",
  },
  image: {
    height: "100%",
    width: "100%",
    resizeMode: "cover",
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
  yesBtn: {
    height: 40,
    width: "48%",
    backgroundColor: "#6AAF2E",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default BookingConfirmationPopup;
