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
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import BerlingskeBold from "../TextWrapper/BerlingskeBold";
import InputField from "../InputField";
import { showErrorToast } from "@/app/utils/toastmsg";
import { icons } from "@/app/MyAssets";
import { themeColors } from "@/app/utils/theme";

// Get screen dimensions
const { height } = Dimensions.get("window");

export type BookingConfirmationPopupRef = {
  show: () => void;
  hide: () => void;
};

type BookingConfirmationPopupProps = {
  onAccept: (item: any) => void;
  reference?: RefObject<BookingConfirmationPopupRef>; // Optional if passing forwardRef
  cancel?: boolean;
};

const BookingConfirmationPopup = forwardRef<
  BookingConfirmationPopupRef,
  BookingConfirmationPopupProps
>((props, ref) => {
  const translateY = useRef(new Animated.Value(height)).current; // Initial position (off-screen)
  const [visible, setVisible] = useState(false);
  const [pinCode, setPinCode] = useState("");

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
    }).start(() => setVisible(false));
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardAvoidingView}
      >
        <Animated.View
          style={[
            styles.bottomSheet,
            { transform: [{ translateY }] }, // Animated slide-up
          ]}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.content}>
              <TouchableOpacity
                onPress={hide}
                style={styles.crossIconContainer}
              >
                <Image
                  source={icons.cross}
                  style={{
                    width: 25,
                    height: 25,
                    resizeMode: "contain",
                  }}
                />
              </TouchableOpacity>
              <BerlingskeBold style={styles.title}>Confirmation</BerlingskeBold>
              <Text style={styles.description}>
                Please provide pin to {props.cancel ? "cancel" : "book"} this
                session.
              </Text>

              <InputField
                placeholder="Pin code"
                value={pinCode}
                onChangeText={setPinCode}
              />

              <View style={styles.rowDirection}>
                <TouchableOpacity onPress={hide} style={styles.btn}>
                  <Text style={{ color: "white" }}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.btn,
                    { backgroundColor: themeColors.secondary },
                  ]}
                  onPress={handleAccept}
                >
                  <Text style={{ color: "black" }}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
});

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    justifyContent: "flex-end",
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  bottomSheet: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: height * 0.6, // Adjust height as needed
    overflow: "hidden",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingTop: 10,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: "gray",
    marginBottom: 0,
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
  crossIconContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 100,
  },
});

export default BookingConfirmationPopup;
