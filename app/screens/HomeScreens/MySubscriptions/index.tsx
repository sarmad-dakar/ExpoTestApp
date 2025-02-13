import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import GeneralHeader from "@/app/components/GeneralHeader";
import SearchField from "@/app/components/SearchField";
import ScreenWrapper from "@/app/components/ScreenWrapper";
import { themeColors } from "@/app/utils/theme";
import {
  GetAccountData,
  GetSubscriptionData,
  GetSubscriptionInvoice,
} from "@/app/api/Bookings";
import { useDispatch, useSelector } from "react-redux";
import { fetchMySubscription } from "@/app/store/slices/accountSlice";
import { vh } from "@/app/utils/units";
import MainButton from "@/app/components/MainButton";
import SubscriptionRecieptViewerPopup from "@/app/components/SubscriptionRecieptViewer";
import ArchivoRegular from "@/app/components/TextWrapper/ArchivoRegular";
import ArchivoMedium from "@/app/components/TextWrapper/ArchivoMedium";
import ArchivoExtraLight from "@/app/components/TextWrapper/ArchivoExtraLight";
import { icons } from "@/app/MyAssets";
import Animated, {
  SlideInLeft,
  SlideInRight,
  SlideInUp,
  ZoomInRight,
} from "react-native-reanimated";
import PaymentWebviewPopup from "@/app/components/PaymentWebView";
import { ConfirmationPopupRef } from "@/app/components/ConfirmationPopup";
import axios from "axios";
import { RootState } from "@/app/store";
import { version } from "@/app/api";
import { showErrorToast } from "@/app/utils/toastmsg";
import * as FileSystem from "expo-file-system"; // Ensure expo-file-system is installed

interface SubscriptionData {
  date: string;
  type: string;
  invoiceNo: string;
  details: string;
  dueAmount: string;
  paidAmount: string;
}

const MySubscriptionScreen = () => {
  const subscriptionData = useSelector(
    (state) => state.account.subscriptionData
  );
  const recieptRef = useRef();
  console.log(subscriptionData, "subscription Datt");
  const token = useSelector((state: RootState) => state.user?.token);
  const dispatch = useDispatch();
  const windowWidth = Dimensions.get("window").width;
  const webviewRef = useRef<ConfirmationPopupRef>(null);
  const loader = useSelector((state: RootState) => state.general.generalLoader);
  const storeConfig = useSelector(
    (state: RootState) => state.general.clubConfig
  );
  useEffect(() => {
    dispatch(fetchMySubscription());
  }, []);

  const fetchInvoice = async (invoice) => {
    try {
      const pdfurl =
        // "https://api.mscbookings.com/api/v1/Subscription/invoice/download/5064M_91716.PDF";
        storeConfig?.apiURL +
        "api/" +
        version +
        "Subscription/invoice/download/" +
        invoice;

      var oReq = new XMLHttpRequest();
      oReq.open("GET", `${pdfurl}`, true);

      // Set the Authorization header
      oReq.setRequestHeader("Authorization", `Bearer ${token}`);

      oReq.responseType = "blob";
      oReq.onload = function (oEvent) {
        if (oReq.status === 200) {
          var blob = oReq.response;

          const reader = new FileReader();
          reader.onloadend = () => {
            const base64Data = reader.result.split(",")[1]; // Extract base64 data
            const dataUrl = `data:application/pdf;base64,${base64Data}`;
            webviewRef?.current?.show(dataUrl, true);
          };
          reader.readAsDataURL(blob);

          // var url = URL.createObjectURL(blob);
          // webviewRef?.current?.show(url);

          //  setDocumentPreview(url);
          //  setIsLoading(false)
        } else {
          //  setIsLoading(false)
        }
      };

      oReq.send();

      return;
      // webviewRef?.current?.show(url);

      const response = await GetSubscriptionInvoice(invoice);
      // webviewRef?.current?.show(pdfurl);

      if (response.status == 200) {
        // webviewRef?.current?.show(pdfurl);
      }
    } catch (error) {
      showErrorToast("No Record Found");
      console.log(error, "error");
    }
  };

  const AccountCard = ({ item, index }) => {
    const [enablePopup, setEnablePopup] = useState(false);
    const [ViewMore, setViewMore] = useState(false);
    return (
      <Pressable
        onPress={() => setEnablePopup(false)}
        style={styles.accountCard}
      >
        {enablePopup && (
          <Animated.View
            entering={ZoomInRight.duration(300)}
            style={styles.listView}
          >
            <TouchableOpacity
              hitSlop={{
                top: 10,
                bottom: 10,
                left: 10,
                right: 10,
              }} // Adjust hitSlop as needed
              onPress={() => {
                setEnablePopup(false);
                setViewMore(true);
              }}
              style={styles.listBtn}
            >
              <Text style={styles.listText}>View More</Text>
            </TouchableOpacity>
            {item?.invoiceURL ? (
              <TouchableOpacity
                onPress={() => {
                  setEnablePopup(false);
                  fetchInvoice(item?.invoiceURL);
                }}
                style={[
                  styles.listBtn,
                  { borderTopWidth: 1, borderColor: "#0001" },
                ]}
              >
                <Text style={styles.listText}>View Invoice</Text>
              </TouchableOpacity>
            ) : null}
          </Animated.View>
        )}
        <View
          style={[styles.rowDirection, { justifyContent: "space-between" }]}
        >
          <ArchivoRegular style={styles.bold}>
            <ArchivoMedium style={styles.bold}>Invoice# :</ArchivoMedium>
            {item?.invoiceNo}
          </ArchivoRegular>

          <TouchableOpacity
            onPress={() => setEnablePopup(!enablePopup)}
            style={styles.iconContainer}
          >
            <Image style={styles.more} source={icons.more} />
          </TouchableOpacity>
        </View>

        <View
          style={[styles.rowDirection, { justifyContent: "space-between" }]}
        >
          <View style={{}}>
            <ArchivoRegular style={styles.bold}>Type</ArchivoRegular>
            <ArchivoExtraLight style={{ fontSize: vh * 1.5, marginTop: "-3%" }}>
              {item?.type}
            </ArchivoExtraLight>
          </View>
          <View
            style={{
              alignItems: "flex-start",
              width: "30%",
            }}
          >
            <ArchivoRegular style={styles.bold}>Date</ArchivoRegular>
            <ArchivoExtraLight style={{ fontSize: vh * 1.5, marginTop: "-3%" }}>
              {item.date}
            </ArchivoExtraLight>
          </View>
        </View>

        <View
          style={[
            styles.rowDirection,
            { justifyContent: "space-between", marginTop: "-0.5%" },
          ]}
        >
          <View style={{ alignItems: "flex-start" }}>
            <ArchivoRegular style={styles.bold}>Amount due</ArchivoRegular>
            <ArchivoExtraLight style={{ fontSize: vh * 1.5, marginTop: "-3%" }}>
              {item.dueAmount}
            </ArchivoExtraLight>
          </View>
          <View
            style={{
              alignItems: "flex-start",
              width: "30%",
            }}
          >
            <ArchivoRegular style={styles.bold}>Amount paid</ArchivoRegular>
            <ArchivoExtraLight style={{ fontSize: vh * 1.5, marginTop: "-3%" }}>
              {item.paidAmount}
            </ArchivoExtraLight>
          </View>
        </View>

        {ViewMore ? (
          <View
            style={[
              styles.rowDirection,
              { justifyContent: "space-between", marginTop: "-0.5%" },
            ]}
          >
            <View style={{ alignItems: "flex-start" }}>
              <ArchivoMedium style={styles.bold}>Balance (€)</ArchivoMedium>
              <ArchivoExtraLight
                style={{ fontSize: vh * 1.5, marginTop: "-3%" }}
              >
                {item?.balance ? parseFloat(item?.balance).toFixed(2) : "N/A"}
              </ArchivoExtraLight>
            </View>
          </View>
        ) : null}
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <GeneralHeader title="My Subscription" back={true} />
      {/* Fixed Header */}
      <ScreenWrapper>
        {/* <SearchField /> */}
        <SubscriptionRecieptViewerPopup reference={recieptRef} />
        <PaymentWebviewPopup reference={webviewRef} />

        {subscriptionData?.length ? (
          <MainButton
            style={styles.viewRecieptBtn}
            title="Subscription Receipts"
            onPress={() => recieptRef?.current?.show()}
          />
        ) : null}

        {/* Scrollable Content */}
        {/* <View
          style={{
            borderWidth: 1,
            // marginTop: vh * 3,
            borderColor: "#0004",
            borderRadius: 2,
          }}
        >
          <ScrollView horizontal>
            <ScrollView style={{}}>
              <View style={[styles.headerRow]}>
                <Text style={[styles.headerText, { width: 150 }]}>Date</Text>
                <View style={styles.rowDirection}>
                  <View style={styles.whiteDivider} />
                  <Text style={[styles.headerText, { width: 100 }]}>Type</Text>
                </View>
                <View style={styles.rowDirection}>
                  <View style={styles.whiteDivider} />
                  <Text style={[styles.headerText, { width: 100 }]}>
                    Invoice #
                  </Text>
                </View>
                <View style={styles.rowDirection}>
                  <View style={styles.whiteDivider} />
                  <Text style={[styles.headerText, { width: 140 }]}>
                    Details
                  </Text>
                </View>
                <View style={styles.rowDirection}>
                  <View style={styles.whiteDivider} />
                  <Text style={[styles.headerText, { width: 120 }]}>
                    Amount Due
                  </Text>
                </View>
                <View style={styles.rowDirection}>
                  <View style={styles.whiteDivider} />
                  <Text style={[styles.headerText, { width: 120 }]}>
                    Amount Paid
                  </Text>
                </View>
              </View>
              {subscriptionData.map((item, index) => (
                <View
                  key={index}
                  style={[
                    styles.row,
                    {
                      backgroundColor:
                        index % 2 !== 0 ? "white" : themeColors.lightShade,
                    },
                  ]}
                >
                  <Text style={[styles.cell, { width: 150 }]}>{item.date}</Text>
                  <View style={styles.rowDirection}>
                    <View style={styles.divider} />
                    <Text style={[styles.cell, { width: 100 }]}>
                      {item.type}
                    </Text>
                  </View>
                  <View style={styles.rowDirection}>
                    <View style={styles.divider} />
                    <Text style={[styles.cell, { width: 100 }]}>
                      {item.invoiceNo}
                    </Text>
                  </View>
                  <View style={styles.rowDirection}>
                    <View style={styles.divider} />
                    <Text style={[styles.cell, { width: 140 }]}>
                      {item.details}
                    </Text>
                  </View>
                  <View style={styles.rowDirection}>
                    <View style={styles.divider} />
                    <Text style={[styles.cell, { width: 120 }]}>
                      {item.dueAmount}
                    </Text>
                  </View>
                  <View style={styles.rowDirection}>
                    <View style={styles.divider} />
                    <Text style={[styles.cell, { width: 120 }]}>
                      {item.paidAmount}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </ScrollView>
        </View> */}
        {/* 
        <ScrollView
          contentContainerStyle={{ paddingBottom: 30 }}
          style={{ flex: 1 }}
        >
          {subscriptionData?.map((item) => {
            return <AccountCard item={item} />;
          })}
        </ScrollView> */}

        <FlatList
          data={subscriptionData}
          ListEmptyComponent={() => {
            return (
              <View>
                {loader ? (
                  <ActivityIndicator
                    color={themeColors.primary}
                    style={{ marginTop: vh * 2 }}
                    size={"small"}
                  />
                ) : (
                  <ArchivoRegular
                    style={{ alignSelf: "center", fontSize: vh * 2 }}
                  >
                    No Subscription Found
                  </ArchivoRegular>
                )}
              </View>
            );
          }}
          renderItem={({ item, index }) => {
            return <AccountCard item={item} />;
          }}
        />
      </ScreenWrapper>
    </View>
  );
};

export default MySubscriptionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  bold: {
    fontSize: vh * 1.7,
    color: themeColors.primary,
  },
  euro: {
    height: vh * 1.5,
    width: vh * 1.5,
    resizeMode: "contain",
    marginRight: 2,
  },
  accountCard: {
    borderWidth: 1,
    padding: 10,
    marginTop: 10,
    borderRadius: 15,
    borderColor: "#0004",
    backgroundColor: "white",
  },
  listView: {
    // height: 90,
    // paddingVertical: 10,
    width: 120,
    backgroundColor: "#BEBEBE",
    position: "absolute",
    right: 20,
    top: 40,
    zIndex: 2,
  },
  listText: {
    fontSize: 12,
  },
  listBtn: {
    flex: 1,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  more: {
    height: "100%",
    width: "100%",
    resizeMode: "contain",
  },
  iconContainer: {
    height: vh * 3,
    width: vh * 3,
  },
});
