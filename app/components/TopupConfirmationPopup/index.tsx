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
  FlatList,
  Platform,
  ActivityIndicator,
  Keyboard,
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
import { vh, vw } from "@/app/utils/units";
import ArchivoRegular from "../TextWrapper/ArchivoRegular";
import { useSelector } from "react-redux";
import { useTheme } from "@react-navigation/native";

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
  const [amount, setAmount] = useState<string>("20");
  const [steps, setSteps] = useState(1);
  const [selectedCardId, setSelectedCardId] = useState("Add");
  const [predefineEuro, setPreDefineEuro] = useState([
    "20",
    "25",
    "30",
    "35",
    "40",
    "Other",
  ]);
  const [selectedAmountType, setSelectedAmountType] = useState("20");
  const [localLoader, setLocalLoader] = useState(false);

  const [url, setUrl] = useState("");
  const user = useSelector((state: any) => state.user.profile);
  const profile = useSelector((state: any) => state.user.user);
  const { colors } = useTheme();
  const styles = MyStyles();
  // const savedCards = JSON.parse(profile?.payInfo) || [];
  const club = useSelector((state: RootState) => state.general.clubConfig);

  const dispatch = useAppDispatch();
  useImperativeHandle(ref || props.reference, () => ({
    hide: hide,
    show: show,
  }));

  const hide = () => {
    setSteps(1);
    dispatch(fetchRemainingBalance());
    setSelectedAmountType("20");
    setAmount("20");
    setSelectedCardId("Add");
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
    try {
      const topupAmount = parseFloat(amount);
      if (!topupAmount) {
        showErrorToast("Please write an amount");
        return;
      }
      if (topupAmount < 20) {
        showErrorToast("Minimum topup amount should be 20");
        return;
      }
      setLocalLoader(true);
      let data = {
        Amount: topupAmount,
        RequestMediumId: 1,
        Comment: "",
        PinCode: "",
      };
      if (
        selectedCardId !== "Add" &&
        selectedCardId !== "Gpay" &&
        selectedCardId !== "ApplePay"
      ) {
        data.PaymentId = selectedCardId;
      }
      const result = await TopupBalance(data);

      console.log(result.data, "amount");
      // hide();
      setLocalLoader(false);

      if (result.data?.data?.isok) {
        const paymentUrl = result.data?.data?.url;
        console.log(paymentUrl);

        setUrl(paymentUrl);
        setSteps(2);
        // let webResponse = await WebBrowser.openBrowserAsync(paymentUrl, {});
        // console.log(webResponse, "web response");
        // Linking.openURL(result.data?.data?.url);
      }
    } catch (error) {
      setLocalLoader(false);
    }
  };

  const generateListData = () => {
    let cardListArray = [{ Id: "Add", CardNumber: "Add" }];

    if (Platform.OS == "android") {
      if (club?.paymentSettings?.showGoogleWallet == "1") {
        let obj = {
          Id: "Gpay",
          CardNumber: "Google Pay",
        };
        cardListArray.push(obj);
      }
    }

    if (Platform.OS == "ios") {
      if (club?.paymentSettings?.showApplePay == "1") {
        let obj = {
          Id: "ApplePay",
          CardNumber: "Apple Pay",
        };
        cardListArray.push(obj);
      }
    }

    if (profile?.payInfo) {
      let paymentInfoArray = JSON.parse(profile?.payInfo);
      if (paymentInfoArray?.length) {
        cardListArray.push(...paymentInfoArray);
      }
    }

    return cardListArray;
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
            height: steps == 1 ? height * 0.45 : height * 1.02,
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
            <ArchivoRegular style={{ fontSize: vh * 1.4 }}>
              To topup kindly enter the amount below. €20 euros is the minimum
              amount.
            </ArchivoRegular>

            {true ? (
              <View
                style={{
                  marginTop: 10,
                  // height: vh * 11,
                }}
              >
                <FlatList
                  data={generateListData()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item, index }) => {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedCardId(item.Id);
                        }}
                        style={{
                          alignItems: "center",
                          marginRight: vw * 3,
                        }}
                        activeOpacity={0.7}
                      >
                        <View
                          style={[
                            styles.smallCard,
                            item.Id == selectedCardId && styles.selected,
                          ]}
                        >
                          {selectedCardId == item.Id ? (
                            <View style={styles.checked}>
                              <Image
                                source={icons.tick}
                                style={{
                                  height: "45%",
                                  width: "45%",
                                  resizeMode: "contain",
                                  tintColor: "white",
                                }}
                              />
                            </View>
                          ) : null}
                          {item?.Id == "Add" ? (
                            <View>
                              <View style={styles.circle}>
                                <Image
                                  source={icons.addMore}
                                  style={{
                                    height: "45%",
                                    width: "45%",
                                    resizeMode: "contain",
                                    tintColor: "#919193",
                                  }}
                                />
                              </View>
                              {/* <ArchivoRegular style={styles.cardNumber}>
                                Add New
                              </ArchivoRegular> */}
                            </View>
                          ) : (
                            <View>
                              <Image
                                source={
                                  item?.Id == "Gpay"
                                    ? icons.gpay
                                    : item?.Id == "ApplePay"
                                    ? icons.applePay
                                    : icons.card3
                                }
                                style={[
                                  styles.cardIcon,
                                  item?.Id !== "Gpay" && {
                                    tintColor: "#7D7D88",
                                    height: vh * 4,
                                    width: vh * 4,
                                  },
                                ]}
                              />

                              {/* <ArchivoRegular style={styles.cardNumber}>
                                {item.CardNumber}
                              </ArchivoRegular> */}
                            </View>
                          )}
                        </View>
                        <ArchivoRegular style={styles.cardNumber}>
                          {item.CardNumber || "+Add"}
                        </ArchivoRegular>
                        {/* {item?.Id !== "Add" ? (
                          <ArchivoRegular style={styles.expiry}>
                            Exp : 10/2024{" "}
                          </ArchivoRegular>
                        ) : null} */}
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            ) : null}

            <View
              pointerEvents={selectedAmountType == "Other" ? "auto" : "none"}
            >
              <InputField
                keyboardType="decimal-pad"
                placeholder="Amount"
                value={`${amount}`}
                style={{
                  color: selectedAmountType == "Other" ? "black" : "#0006",
                }}
                // style={{ marginTop: 20 }}
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
            </View>

            <View
              style={{
                flexWrap: "wrap",
                flexDirection: "row",
                alignItems: "center",
                marginVertical: vh * 1,
              }}
            >
              {predefineEuro.map((item) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedAmountType(item);
                      Keyboard.dismiss();
                      if (item !== "Other") {
                        setAmount(item);
                      }
                    }}
                    style={[
                      styles.chips,
                      item == selectedAmountType && styles.selectedChip,
                    ]}
                  >
                    <ArchivoRegular
                      style={{
                        fontSize: vh * 1.4,
                        color: selectedAmountType == item ? "white" : "black",
                      }}
                    >
                      {item !== "Other" && "€"} {item}
                    </ArchivoRegular>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.rowDirection}>
              <TouchableOpacity onPress={hide} style={styles.btn}>
                <Text style={{ color: "white" }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, { backgroundColor: themeColors.secondary }]}
                disabled={localLoader}
                onPress={handleConfirm}
              >
                {localLoader ? (
                  <ActivityIndicator size={"small"} color={"black"} />
                ) : (
                  <Text style={{ color: "black" }}>Confirm</Text>
                )}
              </TouchableOpacity>
            </View>
          </ImageBackground>
        ) : (
          <View style={[styles.content, { paddingTop: 0 }]}>
            <View style={styles.webHeder}>
              <TouchableOpacity style={styles.backIcon} onPress={hide}>
                <Image
                  source={icons.cross}
                  style={{
                    height: "100%",
                    width: "100%",
                    resizeMode: "contain",
                    tintColor: "white",
                  }}
                />
              </TouchableOpacity>
              <ArchivoRegular style={{ color: "white" }}>
                Proceed to Payment
              </ArchivoRegular>
              <View
                style={{
                  width: 30,
                }}
              ></View>
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

const MyStyles = () => {
  const { colors } = useTheme();

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
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,

      elevation: 3,
    },
    backIcon: {
      height: 30,
      width: 30,
      resizeMode: "contain",

      tintColor: "white",
    },
    webHeder: {
      height: vh * 12,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "space-between",
      flexDirection: "row",
      paddingTop: 10,
      paddingHorizontal: "5%",
      // paddingLeft: "5%",
      // paddingTop: "4%",
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
      height: vh * 5,
      width: vh * 5,
      marginLeft: vw * 1,
      resizeMode: "contain",
    },
    smallCard: {
      height: vh * 7.5,
      width: vw * 26,
      borderColor: "#cdced1",
      backgroundColor: "white",
      borderWidth: 2,
      borderRadius: 5,
      justifyContent: "center",
      alignItems: "center",
      padding: "3%",
      // shadowColor: "#000",
      // shadowOffset: {
      //   width: 0,
      //   height: 1,
      // },
      // shadowOpacity: 0.18,
      // shadowRadius: 1.0,
      // elevation: 1,
    },
    selected: {
      borderColor: "#4FA052",
      borderWidth: 2,
    },
    cardNumber: {
      fontSize: vh * 1.5,
      // marginLeft: vw * 1,
      marginTop: 3,
      color: "black",
    },
    expiry: {
      fontSize: vh * 1.1,
      color: "black",
      // position: "absolute",
      // top: 10,
      // right: 5,
    },
    circle: {
      height: vh * 3.5,
      width: vh * 3.5,
      backgroundColor: "#e5e5e8",
      borderRadius: vh * 10,
      justifyContent: "center",
      alignItems: "center",
      marginLeft: vw * 1,
    },
    checked: {
      height: vh * 3,
      width: vh * 3,
      borderRadius: 100,
      position: "absolute",
      backgroundColor: "#4FA052",
      zIndex: 100,
      bottom: "-12%",
      right: "-12%",
      justifyContent: "center",
      alignItems: "center",
    },
    chips: {
      height: vh * 3,
      paddingHorizontal: vw * 3,
      backgroundColor: "#0002",
      marginRight: vw * 2,
      borderRadius: 5,
      justifyContent: "center",
    },
    selectedChip: {
      backgroundColor: colors.primary,
    },
  });

  return styles;
};

export default TopupConfirmationPopup;
