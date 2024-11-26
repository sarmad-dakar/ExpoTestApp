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
import { icons, images } from "@/app/MyAssets";
import moment from "moment";
import { themeColors } from "@/app/utils/theme";
import BerlingskeMedium from "../TextWrapper/BerlingskeMedium";
import ArchivoRegular from "../TextWrapper/ArchivoRegular";
import ArchivoExtraLight from "../TextWrapper/ArchivoExtraLight";
import ArchivoMedium from "../TextWrapper/ArchivoMedium";
import { vh } from "@/app/utils/units";

// Get screen dimensions
const { height } = Dimensions.get("window");

export type ConfirmationPopupRef = {
  show: () => void;
  hide: () => void;
};

type ConfirmationPopupProps = {
  onAccept: (item: any) => void;
  reference?: RefObject<ConfirmationPopupRef>; // Optional if passing forwardRef
};

const ConfirmationPopup = forwardRef<
  ConfirmationPopupRef,
  ConfirmationPopupProps
>((props, ref) => {
  const translateY = useRef(new Animated.Value(height)).current; // Initial position (off-screen)
  const [visible, setVisible] = useState(false);
  const [image, setImage] = useState("");
  const [courtDetail, setCourtDetail] = useState();
  const [sessionDetail, setSessionDetail] = useState();
  const [selectedDate, setSelectedDate] = useState();

  useImperativeHandle(ref || props.reference, () => ({
    hide: hide,
    show: show,
  }));

  const hide = () => {
    setVisible(false);
  };

  const show = (court, session, date) => {
    setImage(court.resources[0]);
    setCourtDetail(court);
    setSessionDetail(session);
    setVisible(true);
    setSelectedDate(moment(date).format("DD/MM/YYYY"));
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
    let data = {
      courtDetail,
      sessionDetail,
      selectedDate,
    };
    props.onAccept(data);
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
          <TouchableOpacity onPress={hide} style={styles.crossIconContainer}>
            <Image
              source={icons.cross}
              style={{
                width: 25,
                height: 25,
                resizeMode: "contain",
              }}
            />
          </TouchableOpacity>
          <BerlingskeMedium
            style={{ color: themeColors.darkText, fontSize: vh * 2.7 }}
          >
            {props.selectedSport} booking
          </BerlingskeMedium>
          <ArchivoExtraLight style={{ fontSize: vh * 1.5 }}>
            Are you sure you want to book
          </ArchivoExtraLight>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <ArchivoMedium style={{ fontSize: vh * 1.7 }}>
              {courtDetail?.title} ({courtDetail?.courtType}){" "}
            </ArchivoMedium>
            <ArchivoExtraLight style={{ fontSize: vh * 1.5 }}>
              for{" "}
            </ArchivoExtraLight>
            <ArchivoMedium style={{ fontSize: vh * 1.7 }}>
              {selectedDate}{" "}
            </ArchivoMedium>
            <ArchivoExtraLight style={{ fontSize: vh * 1.5 }}>
              at{" "}
            </ArchivoExtraLight>
            <ArchivoMedium style={{ fontSize: vh * 1.7 }}>
              {sessionDetail?.slot}
            </ArchivoMedium>
          </View>

          <View style={styles.courtImage}>
            <Image source={{ uri: image }} style={styles.image} />
          </View>
          <View style={styles.rowDirection}>
            <TouchableOpacity onPress={hide} style={styles.btn}>
              <Text style={{ color: "white" }}>NO</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, { backgroundColor: themeColors.secondary }]}
              onPress={handleAccept}
            >
              <Text style={{ color: themeColors.primary }}>YES</Text>
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
    // height: height * 0.9, // Adjust height as needed
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
  crossIconContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 100,
  },
});

export default ConfirmationPopup;
