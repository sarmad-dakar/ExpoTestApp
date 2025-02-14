import {
  ActivityIndicator,
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import GeneralHeader from "@/app/components/GeneralHeader";
import BerlingskeBold from "@/app/components/TextWrapper/BerlingskeBold";
import { icons } from "@/app/MyAssets";
import { router, useLocalSearchParams } from "expo-router";
import { CancelBooking, GetAlreadyBookedDetails } from "@/app/api/Bookings";
import { themeColors } from "@/app/utils/theme";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import BerlingskeMedium from "@/app/components/TextWrapper/BerlingskeMedium";
import moment from "moment";
import { ConfirmationPopupRef } from "@/app/components/ConfirmationPopup";
import BookingConfirmationPopup from "@/app/components/BookingConfirmationPopup";
import { fetchRemainingBalance } from "@/app/store/slices/accountSlice";
import { useAppDispatch } from "../LandingScreen";
import { toggleBtnLoader } from "@/app/store/slices/generalSlice";
import bookingdetail from "@/app/(tabs)/bookingstack";
import ArchivoMedium from "@/app/components/TextWrapper/ArchivoMedium";
import ArchivoRegular from "@/app/components/TextWrapper/ArchivoRegular";
import { vh, vw } from "@/app/utils/units";
import ArchivoExtraLight from "@/app/components/TextWrapper/ArchivoExtraLight";
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
  AccordionList,
} from "accordion-collapse-react-native";
import LoaderComponent from "@/app/components/Loader";
import NewBookingDetailComponent from "@/app/components/NewBookingDetailComponent";

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

const sportsIcon = {
  tennis: icons.tennis,
  squash: icons.squash,
  padel: icons.padel,
  snooker: icons.snooker,
  cricket: icons.cricket,
};

const AlreadyBookedDetails = () => {
  const bookingData = JSON.parse(useLocalSearchParams()?.bookingData);
  const [bookingDetails, setBookingDetails] = useState();
  const dispatch = useAppDispatch();

  const loading = useSelector((state: RootState) => state.general.btnLoader);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      let data = {
        id: bookingData.id,
        sport: bookingData.sport,
      };
      dispatch(toggleBtnLoader(true));
      const response = await GetAlreadyBookedDetails(data);
      dispatch(toggleBtnLoader(false));

      setBookingDetails(response.data.data);
    } catch (error) {
      dispatch(toggleBtnLoader(false));
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.white }}>
      <GeneralHeader
        sport={{
          name: bookingData.sport,
          icon: sportsIcon[bookingData.sport],
        }}
        title="Booking Details"
        back={true}
      />
      {loading ? (
        <LoaderComponent />
      ) : (
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 20,
          }}
        >
          {/* Booking Info */}

          <NewBookingDetailComponent
            bookingData={bookingData}
            bookingDetails={bookingDetails}
          />
        </ScrollView>
      )}
    </View>
  );
};

export default AlreadyBookedDetails;

const styles = StyleSheet.create({
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
  rowDirection: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    height: vh * 2,
    width: vh * 2,
    resizeMode: "contain",
    marginRight: 5,
    tintColor: themeColors.primary,
  },
  tableContainer: {
    marginVertical: 20,
    borderWidth: 1,
    borderColor: "#0004",
    borderRadius: 5,
  },
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: themeColors.primary, // "#f0f0f0"
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "left",
    fontSize: vh * 1.5,
    color: "white",
    minWidth: 100,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderColor: "#0002",
  },
  tableCell: {
    flex: 1,
    textAlign: "left",
    fontSize: vh * 1.4,
    minWidth: 100,
    color: themeColors.darkText,
  },
  cancelBtn: {
    height: vh * 3.5,
    width: vw * 30,
    alignSelf: "flex-end",
    backgroundColor: themeColors.red,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    position: "absolute",
    right: vh * 1.5,
    top: vh * 1.5,
    zIndex: 120,
  },
  cardContainer: {
    backgroundColor: themeColors.cardShade,
    marginTop: 15,
    borderRadius: 10,
    padding: 10,
  },
  whiteDivider: {
    height: 10,
    width: 1,
    backgroundColor: "white",
    marginRight: 10,
  },
  divider: {
    height: 10,
    width: 1,
    backgroundColor: "gray",
    marginRight: 10,
    alignSelf: "center",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: vh * 1.5,
    // elevation: 1,
    borderWidth: 1,
    borderColor: "#0003",

    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    backgroundColor: themeColors.primary, // Use theme color here
    borderRadius: 8,
    marginRight: 10,
    width: vh * 12,
    height: vh * 12,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: "70%",
    height: "70%",
    tintColor: "#B6FF00", // Tennis color
  },
  detailsContainer: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: vh * 2.2,
    marginBottom: 2,
    color: "black",
  },
  detail: {
    fontSize: 14,
    color: "#555",
    marginBottom: 2,
  },
  bold: {
    fontSize: vh * 1.5,
    color: themeColors.primary,
  },

  section: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  sectionText: {
    fontSize: vh * 1.5,
    marginLeft: 5,
    color: "#555",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bottomText: {
    fontSize: vh * 1.4,
    color: "black",
  },
  bottomValue: {
    fontSize: vh * 1.4,
    color: "black",
    marginTop: -3,
    // marginLeft: 5,
  },
  borderSeperator: {
    height: 1,
    backgroundColor: "#0003",
    marginVertical: vh * 1.7,
  },
  miniHeading: {
    fontSize: vh * 1.7,
    color: "black",
  },
  fieldDetail: {
    fontSize: vh * 1.5,
    color: "#2A3029",
  },
  accordianHeader: {
    borderWidth: 1,
    borderColor: "#0003",
    paddingHorizontal: "3%",
    paddingVertical: "3%",
    marginTop: vh * 2,
    borderRadius: vh * 1,
  },
  accordianIcon: {
    height: vh * 2,
    width: vh * 2,
    resizeMode: "contain",
    marginRight: vw * 2,
  },
  dropdownArrow: {
    height: vh * 1.5,
    width: vh * 1.5,
    tintColor: "#0008",
    resizeMode: "contain",
  },
  accountCard: {
    borderWidth: 1,
    padding: 10,
    marginTop: 10,
    borderRadius: 15,
    borderColor: "#0004",
    backgroundColor: "white",
  },
  euro: {
    height: vh * 1.4,
    width: vh * 1.4,
    resizeMode: "contain",
    marginRight: 2,
  },
});
