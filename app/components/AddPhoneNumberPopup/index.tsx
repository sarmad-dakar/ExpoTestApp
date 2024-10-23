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
  Text,
} from "react-native";
import BerlingskeMedium from "../TextWrapper/BerlingskeMedium";
import { icons } from "@/app/MyAssets";
import InputField from "../InputField";
import MainButton from "../MainButton";

// Get screen dimensions
const { height } = Dimensions.get("window");

export type AddPhonePopupRef = {
  show: () => void;
  hide: () => void;
};

type AddPhonePopupProps = {
  reference?: RefObject<AddPhonePopupRef>; // Optional if passing forwardRef
  onSavePress: ({ type, number }: any) => void;
};

const AddPhonePopup = forwardRef<AddPhonePopupRef, AddPhonePopupProps>(
  (props, ref) => {
    const translateY = useRef(new Animated.Value(height)).current; // Initial position (off-screen)
    const [visible, setVisible] = useState(false);
    const [phoneType, setPhoneType] = useState("Mobile");
    const [phoneNumber, setPhoneNumber] = useState("");

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

    const onSave = () => {
      let data = {
        type: phoneType,
        number: phoneNumber,
      };
      props.onSavePress(data);
      hide();
    };

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

    const RadioButton = ({ label, selected, onPress }: any) => {
      return (
        <TouchableOpacity
          style={styles.radioButton}
          onPress={onPress}
          activeOpacity={0.7}
        >
          <View style={styles.radioCircle}>
            {selected ? <View style={styles.selectedCircle} /> : null}
          </View>
          <Text>{label}</Text>
        </TouchableOpacity>
      );
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
          style={[styles.bottomSheet, { transform: [{ translateY }] }]} // Animated slide-up
        >
          {/* Bottom sheet content */}
          <View style={styles.content}>
            <View style={styles.rowDirection}>
              <BerlingskeMedium>Add Phone</BerlingskeMedium>
              <TouchableOpacity onPress={hide}>
                <Image source={icons.cross} style={styles.icon} />
              </TouchableOpacity>
            </View>

            <View style={styles.radioGroup}>
              <RadioButton
                label="Mobile"
                selected={phoneType === "Mobile"}
                onPress={() => setPhoneType("Mobile")}
              />
              <RadioButton
                label="Home"
                selected={phoneType === "Home"}
                onPress={() => setPhoneType("Home")}
              />
              <RadioButton
                label="Office"
                selected={phoneType === "Office"}
                onPress={() => setPhoneType("Office")}
              />
            </View>

            <InputField
              onChangeText={setPhoneNumber}
              placeholder="Enter Phone Number"
              keyboardType="phone-pad"
              value={phoneNumber}
            />

            <MainButton title="Save" onPress={onSave} />
          </View>
        </Animated.View>
      </Modal>
    );
  }
);

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
    // height: height * 0.9, // Adjust height as needed
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
  },
  rowDirection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  icon: {
    width: 25,
    height: 25,
    resizeMode: "contain",
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 15,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#000",
  },
});

export default AddPhonePopup;
