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
  Platform,
  Image,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import BerlingskeBold from "../TextWrapper/BerlingskeBold";
import InputField from "../InputField";
import { TopupBalance } from "@/app/api/Bookings";
import * as WebBrowser from "expo-web-browser";
import InAppBrowser from "react-native-inappbrowser-reborn";
import WebView from "react-native-webview";
import { icons } from "@/app/MyAssets";
import { vh } from "@/app/utils/units";
// import Pdf from "react-native-pdf";

// Get screen dimensions
const { height } = Dimensions.get("window");

export type ImageGalleryViewerPopupRef = {
  show: (images: Array<string | { uri: string }>) => void; // Example: Array of strings (URLs) or objects with a `uri` property.
  hide: () => void;
};

type ImageGalleryViewerPopupProps = {
  reference?: RefObject<ImageGalleryViewerPopupRef>;
};

const ImageGalleryViewerPopup = forwardRef<
  ImageGalleryViewerPopupRef,
  ImageGalleryViewerPopupProps
>((props, ref) => {
  const translateY = useRef(new Animated.Value(height)).current;
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [sportName, setSportName] = useState("");
  const [loading, setLoading] = useState(false);

  useImperativeHandle(ref || props.reference, () => ({
    hide: hide,
    show: show,
  }));

  const hide = () => {
    setVisible(false);
  };

  const show = (images, title) => {
    setImages(images);
    setSportName(title);

    console.log(images, "images");
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

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
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
        style={[styles.bottomSheet, { transform: [{ translateY }] }]}
      >
        <View style={styles.content}>
          <BerlingskeBold style={{ marginBottom: 10 }}>
            {sportName} Gallery
          </BerlingskeBold>
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
          <ImageBackground
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            source={{ uri: images[currentIndex] }}
            imageStyle={{ height: "100%", width: "104%", resizeMode: "cover" }}
            style={styles.imageViewer}
          >
            <TouchableOpacity style={styles.circle} onPress={handlePrevious}>
              <Image source={icons.backArrow} style={styles.icon} />
            </TouchableOpacity>
            {loading ? <ActivityIndicator size={"small"} /> : null}
            <TouchableOpacity
              style={styles.circle}
              onPress={handleNext}

              // onPress={}
            >
              <Image source={icons.nextArrow} style={styles.icon} />
            </TouchableOpacity>
          </ImageBackground>
          <Text style={{ alignSelf: "center", marginTop: 10 }}>
            {currentIndex + 1} / {images.length}
          </Text>
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
    height: height * 0.6,
  },
  content: {
    flex: 1,
    paddingTop: vh * 3,
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
  imageViewer: {
    height: vh * 35,
    backgroundColor: "#0002",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: "2%",
    borderRadius: vh * 4,
    overflow: "hidden",
  },
  icon: {
    height: "40%",
    width: "40%",
    resizeMode: "contain",
  },
  circle: {
    height: vh * 4,
    width: vh * 4,
    backgroundColor: "white",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ImageGalleryViewerPopup;
