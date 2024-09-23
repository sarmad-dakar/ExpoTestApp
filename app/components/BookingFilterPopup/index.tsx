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
  Image,
} from "react-native";
import BerlingskeMedium from "../TextWrapper/BerlingskeMedium";
import { icons } from "@/app/MyAssets";
import InputField from "../InputField";
import MainButton from "../MainButton";

// Get screen dimensions
const { height } = Dimensions.get("window");

export type BookingFilterPopupRef = {
  show: () => void;
  hide: () => void;
};

type BookingFilterPopupProps = {
  reference?: RefObject<BookingFilterPopupRef>; // Optional if passing forwardRef
};

const BookingFilterPopup = forwardRef<
  BookingFilterPopupRef,
  BookingFilterPopupProps
>((props, ref) => {
  const translateY = useRef(new Animated.Value(height)).current; // Initial position (off-screen)
  const [visible, setVisible] = useState(false);

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
          <View style={styles.rowDirection}>
            <BerlingskeMedium>My Bookings Filters</BerlingskeMedium>
            <TouchableOpacity onPress={hide}>
              <Image source={icons.cross} style={styles.icon} />
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />

          <BerlingskeMedium style={styles.heading}>Search</BerlingskeMedium>
          <InputField
            value="01/07/2024"
            icon={icons.calendar}
            rightIcon={icons.dropdown}
          />
          <View style={styles.btnContainer}>
            <MainButton title="Prev" style={styles.prevBtn} />
            <MainButton title="Next" style={styles.smallBtn} />
          </View>

          <BerlingskeMedium style={styles.heading}>
            Booking Info
          </BerlingskeMedium>
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
    height: height * 0.9, // Adjust height as needed
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
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
    marginTop: 10,
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
  icon: {
    width: 25,
    height: 25,
    resizeMode: "contain",
  },
  heading: {
    marginTop: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#0002",
    marginTop: 10,
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  prevBtn: {
    width: 100,
    height: 25,
    marginRight: 10,
  },
  smallBtn: {
    width: 100,
    height: 25,
  },
});

export default BookingFilterPopup;
