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
  Image,
  ImageBackground,
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
import { icons, images } from "@/app/MyAssets";
import GeneralHeader from "../GeneralHeader";
import { themeColors } from "@/app/utils/theme";
import { vh } from "@/app/utils/units";
import ArchivoRegular from "../TextWrapper/ArchivoRegular";
import { useSelector } from "react-redux";

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
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const [url, setUrl] = useState("");
  const user = useSelector((state: any) => state.user.profile);
  const profile = useSelector((state: any) => state.user.user);

  // const savedCards = JSON.parse(profile?.payInfo) || [];

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
    if (selectedCardId !== "other") {
      data.payment;
    }
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
      statusBarTranslucent={steps === 2}
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
            height: steps == 1 ? height * 0.4 : height * 1.02,
            padding: steps == 1 ? 10 : 0,
          },
          { transform: [{ translateY }] },
        ]}
      >
        {steps == 1 ? (
          <ImageBackground
            source={images.linesBackground}
            imageStyle={{
              width: "100%",
              height: "100%",
              resizeMode: "cover",
              opacity: 0.6,
            }}
            style={styles.content}
          >
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
            <BerlingskeBold>Confirm Top-up</BerlingskeBold>
            <ArchivoRegular style={{ fontSize: 13 }}>
              Please enter the amount you wish to top-up:
            </ArchivoRegular>

            {/* Saved Cards as Radio Buttons */}
            {/* {savedCards.map((card: any) => (
              <TouchableOpacity
                key={card.Id}
                style={styles.cardContainer}
                onPress={() => {
                  setSelectedCardId(card.Id);
                  setAmount(""); // Clear input when a card is selected
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={styles.radio}>
                    {selectedCardId === card.Id && (
                      <View style={styles.radioInner} />
                    )}
                  </View>
                  <Text style={styles.cardText}>
                    {card.CardNumber} {"    "} (Exp: {card.CardExpiryDate})
                  </Text>
                </View>
                <Image source={icons.card} style={styles.cardIcon} />
              </TouchableOpacity>
            ))} */}

            {/* <TouchableOpacity
              style={styles.cardContainer}
              onPress={() => {
                setSelectedCardId("other");
                setAmount(""); // Clear input when a card is selected
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={styles.radio}>
                  {selectedCardId === "other" && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <Text style={styles.cardText}>Add New Card</Text>
              </View>
            </TouchableOpacity> */}

            <InputField
              keyboardType="decimal-pad"
              placeholder="Amount"
              value={amount}
              maxLength={4}
              onChangeText={(text) => {
                console.log(text);
                const regex = /^(\d+(\.\d{0,2})?)?$/;
                const validate = regex.test(text);
                if (validate) {
                  setAmount(text);
                }
              }}
            />

            <View style={styles.rowDirection}>
              <TouchableOpacity onPress={hide} style={styles.btn}>
                <Text style={{ color: "white" }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, { backgroundColor: themeColors.secondary }]}
                onPress={handleConfirm}
              >
                <Text style={{ color: "black" }}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        ) : (
          <View style={styles.content}>
            <View style={styles.webHeder}>
              <TouchableOpacity onPress={hide}>
                <Image source={icons.cross} style={styles.backIcon} />
              </TouchableOpacity>
            </View>

            <View />
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
  backIcon: {
    height: 30,
    width: 30,
    resizeMode: "contain",

    tintColor: "white",
  },
  webHeder: {
    height: vh * 12,
    backgroundColor: themeColors.primary,
    justifyContent: "center",
    paddingLeft: "5%",
    paddingTop: "4%",
  },
  crossIconContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 100,
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "black",
  },
  cardText: { marginLeft: 10 },
  cardIcon: {
    height: vh * 3,
    width: vh * 3,
    resizeMode: "contain",
  },
});

export default TopupConfirmationPopup;
