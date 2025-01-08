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
  ScrollView,
} from "react-native";
import BerlingskeBold from "../TextWrapper/BerlingskeBold";
import InputField from "../InputField";
import {
  GetSubscriptionReciept,
  GetSubscriptionRecieptDetail,
  TopupBalance,
} from "@/app/api/Bookings";
import * as WebBrowser from "expo-web-browser";
import InAppBrowser from "react-native-inappbrowser-reborn";
import WebView from "react-native-webview";
import { icons } from "@/app/MyAssets";
import { vh, vw } from "@/app/utils/units";
import { themeColors } from "@/app/utils/theme";
import ArchivoRegular from "../TextWrapper/ArchivoRegular";
import BerlingskeMedium from "../TextWrapper/BerlingskeMedium";
// import Pdf from "react-native-pdf";

// Get screen dimensions
const { height } = Dimensions.get("window");

const DetailComponent = ({ label, value, hideBorder }: any) => {
  return (
    <View style={[styles.container, hideBorder && { borderBottomWidth: 0 }]}>
      <ArchivoRegular style={styles.label}>
        {label} {value ? ":" : ","}{" "}
      </ArchivoRegular>
      <View style={{ width: "40%", alignItems: "flex-end" }}>
        <ArchivoRegular
          style={{ fontSize: vh * 1.4, color: themeColors.darkText }}
        >
          {" "}
          {value}
        </ArchivoRegular>
      </View>
    </View>
  );
};

export type SubscriptionRecieptViewerPopupRef = {
  show: (images: Array<string | { uri: string }>) => void; // Example: Array of strings (URLs) or objects with a `uri` property.
  hide: () => void;
};

type SubscriptionRecieptViewerPopupProps = {
  reference?: RefObject<SubscriptionRecieptViewerPopupRef>;
};

const SubscriptionRecieptViewerPopup = forwardRef<
  SubscriptionRecieptViewerPopupRef,
  SubscriptionRecieptViewerPopupProps
>((props, ref) => {
  const translateY = useRef(new Animated.Value(height)).current;
  const [visible, setVisible] = useState(false);
  const [recieptsData, setRecieptsData] = useState([]);
  const [recieptDetail, setRecieptDetail] = useState();
  const [step, setStep] = useState(1);
  console.log(recieptDetail, "reciept detail");

  useImperativeHandle(ref || props.reference, () => ({
    hide: hide,
    show: show,
  }));

  useEffect(() => {
    fetchReciepts();
  }, []);

  const fetchReciepts = async () => {
    const response = await GetSubscriptionReciept();
    console.log(response.data?.data, "response of reciepts");
    setRecieptsData(response?.data?.data);
  };

  const hide = () => {
    setVisible(false);
    setStep(1);
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

  const onDetailPress = async (item) => {
    const keys = item.keys.join(",");
    const response = await GetSubscriptionRecieptDetail(keys);
    setRecieptDetail(response?.data?.data[0]);
    setStep(2);
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
          {step == 2 ? (
            <TouchableOpacity
              onPress={() => setStep(1)}
              style={styles.backIcon}
            >
              <Image source={icons.back} style={styles.icon} />
            </TouchableOpacity>
          ) : null}
          <BerlingskeMedium
            style={{ color: themeColors.darkText, fontSize: vh * 2.5 }}
          >
            Annual Subscription :
          </BerlingskeMedium>
          {step == 1 ? (
            <View
              style={{
                borderWidth: 1,
                marginTop: vh * 2,
                borderColor: "#0004",
                borderRadius: 2,
              }}
            >
              <ScrollView horizontal>
                {/* Data Rows - Vertical Scroll */}
                <ScrollView style={{}}>
                  <View style={[styles.headerRow]}>
                    <View style={styles.rowDirection}>
                      <Text style={[styles.headerText, { width: 100 }]}>
                        Receipt #
                      </Text>
                    </View>

                    <View style={styles.rowDirection}>
                      <View style={styles.whiteDivider} />
                      <Text style={[styles.headerText, { width: 140 }]}>
                        Date
                      </Text>
                    </View>

                    <View style={styles.rowDirection}>
                      <View style={styles.whiteDivider} />
                      <Text style={[styles.headerText, { width: 120 }]}>
                        Total
                      </Text>
                    </View>
                    <View style={styles.rowDirection}>
                      <View style={styles.whiteDivider} />
                      <Text style={[styles.headerText, { width: 150 }]}>
                        Description
                      </Text>
                    </View>
                    <View style={styles.rowDirection}>
                      <View style={styles.whiteDivider} />
                      <Text style={[styles.headerText, { width: 120 }]}>
                        Action
                      </Text>
                    </View>
                  </View>
                  {recieptsData?.map((item, index) => {
                    return (
                      <View
                        key={index}
                        style={[
                          styles.row,
                          {
                            backgroundColor:
                              index % 2 !== 0
                                ? "white"
                                : themeColors.lightShade,
                          },
                        ]}
                      >
                        <Text style={[styles.cell, { width: 100 }]}>
                          {item?.receiptNo}
                        </Text>

                        <View style={styles.rowDirection}>
                          <View style={styles.divider} />
                          <Text style={[styles.cell, { width: 140 }]}>
                            {item?.date}
                          </Text>
                        </View>

                        <View style={styles.rowDirection}>
                          <View style={styles.divider} />
                          <Text style={[styles.cell, { width: 120 }]}>
                            {item?.total}
                          </Text>
                        </View>

                        <View style={styles.rowDirection}>
                          <View style={styles.divider} />
                          <Text style={[styles.cell, { width: 150 }]}>
                            {item?.description}
                          </Text>
                        </View>
                        <TouchableOpacity onPress={() => onDetailPress(item)}>
                          <ArchivoRegular
                            style={[
                              styles.cell,
                              {
                                width: 120,
                                textDecorationLine: "underline",
                                color: "#0000EE",
                              },
                            ]}
                          >
                            View Details
                          </ArchivoRegular>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </ScrollView>
              </ScrollView>
            </View>
          ) : (
            <View>
              <DetailComponent
                value={recieptDetail?.from}
                label={"Reciept From"}
              />
              <DetailComponent
                value={recieptDetail?.account}
                label={"Account Number"}
              />
              <View
                style={{
                  borderWidth: 1,
                  marginTop: vh * 2,
                  borderColor: "#0004",
                  borderRadius: 2,
                }}
              >
                {/* Data Rows - Vertical Scroll */}
                <ScrollView style={{}}>
                  <View style={[styles.headerRow]}>
                    <View style={styles.rowDirection}>
                      <Text style={[styles.headerText, { width: "50%" }]}>
                        Description
                      </Text>
                    </View>

                    <View style={styles.rowDirection}>
                      <View style={styles.whiteDivider} />
                      <Text style={[styles.headerText, { width: "50%" }]}>
                        Amount Paid
                      </Text>
                    </View>
                  </View>
                  {recieptsData?.map((item, index) => {
                    return (
                      <View
                        key={index}
                        style={[
                          styles.row,
                          {
                            backgroundColor:
                              index % 2 !== 0
                                ? "white"
                                : themeColors.lightShade,
                          },
                        ]}
                      >
                        <View style={styles.rowDirection}>
                          <Text style={[styles.cell, { width: "50%" }]}>
                            {item?.date}
                          </Text>
                        </View>

                        <View style={styles.rowDirection}>
                          <View style={styles.divider} />
                          <Text style={[styles.cell, { width: "50%" }]}>
                            {item?.total}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            </View>
          )}
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
    paddingBottom: vh * 10,
    // height: height * 0.6,
  },
  content: {
    flex: 1,
    paddingTop: vh * 3,
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
    width: "80%",
    height: "80%",
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
  headerRow: {
    flexDirection: "row",
    backgroundColor: themeColors.primary,
  },
  headerText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "left",
    paddingVertical: 10,
    paddingLeft: 10,
    fontSize: 12,
    backgroundColor: themeColors.primary,
  },
  row: {
    flexDirection: "row",
    height: 30,
    alignItems: "center",
  },
  cell: {
    textAlign: "left",
    fontSize: 12,
    paddingLeft: 10,
  },
  rowDirection: {
    flexDirection: "row",
    alignItems: "center",
  },
  divider: {
    height: 10,
    width: 1,
    backgroundColor: "gray",
  },
  whiteDivider: {
    height: 10,
    width: 1,
    backgroundColor: "white",
  },
  viewRecieptBtn: {
    height: vh * 4,
    width: "50%",
    alignSelf: "flex-end",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    // height: 30,
    marginTop: vh * 0.7,
    paddingVertical: vh * 0.6,
    paddingHorizontal: vw * 2,
    justifyContent: "space-between",
    backgroundColor: themeColors.cardShade,
    borderRadius: 5,
  },
  label: {
    fontSize: vh * 1.5,
    color: "black",
  },
  backIcon: {
    width: 25,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    // top: vh * 1,
    zIndex: 100,
  },
});

export default SubscriptionRecieptViewerPopup;
