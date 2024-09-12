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
} from "react-native";
import BerlingskeBold from "../TextWrapper/BerlingskeBold";
import { images } from "@/app/MyAssets";

// Get screen dimensions
const { height } = Dimensions.get("window");

export type ConfirmationPopupRef = {
  show: () => void;
  hide: () => void;
};

type ConfirmationPopupProps = {
  onAccept: () => void;
  reference?: RefObject<ConfirmationPopupRef>; // Optional if passing forwardRef
};

const ConfirmationPopup = forwardRef<
  ConfirmationPopupRef,
  ConfirmationPopupProps
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
          <BerlingskeBold>Tennis booking</BerlingskeBold>
          <Text>Are you sure you want to book</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontWeight: "700" }}>Court 2 </Text>
            <Text>for </Text>
            <Text style={{ fontWeight: "700" }}>07/07/2024 </Text>
            <Text>at </Text>
            <Text style={{ fontWeight: "700" }}>07:00 AM</Text>
          </View>

          <View style={styles.courtImage}>
            <Image source={images.tennis} style={styles.image} />
          </View>
          <View style={styles.rowDirection}>
            <TouchableOpacity style={styles.btn}>
              <Text style={{ color: "white" }}>NO</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, { backgroundColor: "#6AAF2E" }]}
              onPress={props.onAccept}
            >
              <Text style={{ color: "white" }}>YES</Text>
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
    height: height * 0.9, // Adjust height as needed
  },
  content: {
    flex: 1,
    paddingTop: 10,
  },
  courtImage: {
    height: 250,
    backgroundColor: "red",
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

export default ConfirmationPopup;
