import {
  ActivityIndicator,
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
import { colors } from "@/app/utils/theme";
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
import { vh } from "@/app/utils/units";

const DetailComponent = ({ label, value, hideBorder }: any) => {
  return (
    <View style={[styles.container, hideBorder && { borderBottomWidth: 0 }]}>
      <ArchivoMedium style={styles.label}>
        {label} {value ? ":" : ","}{" "}
      </ArchivoMedium>
      <View style={{ width: "40%", alignItems: "flex-end" }}>
        <ArchivoRegular style={{ fontSize: vh * 1.5, color: colors.darkText }}>
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
  const bookingConfirmationRef = useRef<ConfirmationPopupRef>(null);
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

  const shouldCancelVisible = () => {
    if (bookingDetails) {
      const bookingDate = moment(
        `${bookingDetails.bookingSessionDate} ${bookingDetails.bookingSessionTimeFrom}`,
        "DD/MM/YYYY hh:mma"
      );
      const currentDate = moment();
      console.log(bookingDate.diff(currentDate, "hours"), "time diff");

      return bookingDate.diff(currentDate, "hours") >= 10;
    }
  };

  const capitalizeFirstLetter = (word) => {
    if (!word) return ""; // Handle empty or undefined input
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  };

  const onConfirmedCancel = async (pin: string) => {
    const data = {
      key: bookingData.id,
      pin: pin,
      section: capitalizeFirstLetter(bookingData?.sport),
    };
    const response = await CancelBooking(data);
    setTimeout(() => {
      dispatch(fetchRemainingBalance());
    }, 1000);
    console.log(response.data, "Response of cancel");
    if (response.data.msgCode == "200") {
      console.log("fetch again");
      router.back();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <BookingConfirmationPopup
        reference={bookingConfirmationRef}
        onAccept={onConfirmedCancel}
      />
      <GeneralHeader
        sport={{
          name: bookingData.sport,
          icon: sportsIcon[bookingData.sport],
        }}
        title="Booking Details"
        back={true}
      />
      {loading ? (
        <View style={{ alignSelf: "center", marginTop: 100 }}>
          <ActivityIndicator size={"large"} color={colors.secondary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 20,
          }}
        >
          {/* Booking Info */}

          {bookingDetails ? (
            <View style={styles.cardContainer}>
              <View
                style={[
                  styles.rowDirection,
                  { justifyContent: "space-between", marginBottom: 10 },
                ]}
              >
                <View style={styles.rowDirection}>
                  <Image source={icons.clock} style={styles.logo} />
                  <BerlingskeBold
                    style={{ color: colors.darkText, fontSize: vh * 2 }}
                  >
                    Session
                  </BerlingskeBold>
                </View>
                {shouldCancelVisible() ? (
                  <TouchableOpacity
                    onPress={() => bookingConfirmationRef.current?.show()}
                    style={styles.cancelBtn}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        color: "white",
                        fontSize: vh * 1.5,
                      }}
                    >
                      Cancel Booking
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>

              <DetailComponent
                label="Booking"
                value={bookingDetails.bookingTitle}
              />
              <DetailComponent
                label="Booking Member"
                value={`${bookingDetails.bookingMember.bookingMemberName} (${bookingDetails.bookingMember.bookingMemberCode}) ${bookingDetails.bookingMember.bookingMemberStatus}`}
              />
              <DetailComponent
                label="Booking Type"
                value={bookingDetails.bookingType}
              />
              <DetailComponent
                label="Court Number"
                value={bookingDetails.bookingCourt}
              />
              <DetailComponent
                label="Court Date"
                value={bookingDetails.bookingSessionDate}
              />
              <DetailComponent
                label="Court Time"
                value={bookingDetails.bookingSessionTimeFrom}
                hideBorder
              />
            </View>
          ) : null}

          {/* Players Info */}
          {bookingDetails ? (
            <View style={styles.cardContainer}>
              <View
                style={[
                  styles.rowDirection,
                  {
                    marginBottom: 10,
                  },
                ]}
              >
                <Image source={icons.group} style={styles.logo} />
                <BerlingskeBold
                  style={{ color: colors.darkText, fontSize: vh * 2 }}
                >
                  Players Info
                </BerlingskeBold>
              </View>
              {bookingDetails.players.map((player: any, index: number) => (
                <View
                  style={[
                    styles.rowDirection,
                    {
                      marginBottom: 5,
                      paddingBottom: 5,
                      justifyContent: "space-between",
                    },
                    index !== bookingDetails.players.length - 1 && {
                      borderBottomWidth: 1,
                      borderColor: "#BDBDBD",
                    },
                  ]}
                >
                  <Image
                    source={icons.defaultUser}
                    style={{
                      width: 15,
                      height: 15,
                      resizeMode: "contain",
                      marginRight: 10,
                    }}
                  />
                  <ArchivoRegular
                    style={{
                      fontSize: vh * 1.5,
                      width: "80%",
                      textAlign: "right",
                    }}
                    key={index}
                  >
                    {player.bookingMemberName}
                  </ArchivoRegular>
                </View>
              ))}
            </View>
          ) : null}

          {/* Payment Info */}
          {bookingDetails ? (
            <View style={styles.cardContainer}>
              <View style={[styles.rowDirection, { marginBottom: 10 }]}>
                <Image source={icons.bankTransfer} style={styles.logo} />
                <BerlingskeBold
                  style={{ color: colors.darkText, fontSize: vh * 2 }}
                >
                  Booking & Payments
                </BerlingskeBold>
              </View>

              <DetailComponent
                label="Booked By"
                value={`${bookingDetails.bookingMember.bookingMemberName}`}
              />
              <DetailComponent
                label="Booked Date"
                value={bookingDetails.bookingDate}
              />
              <DetailComponent
                label="Booked Time"
                value={bookingDetails.bookingTime}
                hideBorder
              />
            </View>
          ) : null}

          {bookingDetails ? (
            // <View style={styles.tableContainer}>
            //   <View style={styles.tableHeader}>
            //     <Text style={styles.tableHeaderText}>Name</Text>
            //     <Text style={styles.tableHeaderText}>Booking Rate</Text>
            //     <Text style={styles.tableHeaderText}>Receipt</Text>
            //     <Text style={styles.tableHeaderText}>Payment Method</Text>
            //   </View>
            //   {bookingDetails.paymentPlayers.map(
            //     (payment: any, index: number) => (
            //       <View key={index} style={styles.tableRow}>
            //         <Text style={styles.tableCell}>{payment.payerName}</Text>
            //         <Text style={styles.tableCell}>${payment.bookingRate}</Text>
            //         <Text style={styles.tableCell}>
            //           {payment.bookingReceipt}
            //         </Text>
            //         <Text style={styles.tableCell}>
            //           {payment.paymentMethod}
            //         </Text>
            //       </View>
            //     )
            //   )}
            // </View>
            <ScrollView
              contentContainerStyle={{ marginTop: 20 }}
              indicatorStyle="white"
              horizontal
            >
              <View>
                <View style={styles.tableHeader}>
                  <ArchivoRegular
                    style={[styles.tableHeaderText, { width: 120 }]}
                  >
                    Name
                  </ArchivoRegular>
                  <View style={styles.whiteDivider} />
                  <ArchivoRegular style={styles.tableHeaderText}>
                    Booking Rate
                  </ArchivoRegular>
                  <View style={styles.whiteDivider} />

                  <ArchivoRegular style={styles.tableHeaderText}>
                    Receipt
                  </ArchivoRegular>
                  <View style={styles.whiteDivider} />

                  <ArchivoRegular style={styles.tableHeaderText}>
                    Payment Method
                  </ArchivoRegular>
                </View>

                {bookingDetails.paymentPlayers.map(
                  (payment: any, index: number) => (
                    <View key={index} style={styles.tableRow}>
                      <ArchivoRegular
                        style={[styles.tableCell, { width: 120 }]}
                      >
                        {payment.payerName}
                      </ArchivoRegular>
                      <View style={styles.divider} />

                      <ArchivoRegular style={styles.tableCell}>
                        ${payment.bookingRate}
                      </ArchivoRegular>
                      <View style={styles.divider} />

                      <ArchivoRegular style={styles.tableCell}>
                        {payment.bookingReceipt}
                      </ArchivoRegular>
                      <View style={styles.divider} />

                      <ArchivoRegular style={styles.tableCell}>
                        {payment.paymentMethod}
                      </ArchivoRegular>
                    </View>
                  )
                )}
              </View>
            </ScrollView>
          ) : null}
        </ScrollView>
      )}
    </View>
  );
};

export default AlreadyBookedDetails;

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderColor: "#BDBDBD",
    flexDirection: "row",
    alignItems: "center",
    // height: 30,
    paddingVertical: 4,
    justifyContent: "space-between",
  },
  label: {
    fontSize: vh * 1.6,
    color: "black",
  },
  rowDirection: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    height: 25,
    width: 25,
    resizeMode: "contain",
    marginRight: 15,
    tintColor: colors.primary,
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
    backgroundColor: colors.primary, // "#f0f0f0"
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
    color: colors.darkText,
  },
  cancelBtn: {
    height: vh * 4.5,
    width: 120,
    backgroundColor: colors.red,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  cardContainer: {
    backgroundColor: colors.cardShade,
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
});
