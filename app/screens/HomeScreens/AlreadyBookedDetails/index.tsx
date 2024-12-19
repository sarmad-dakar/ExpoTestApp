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
  const bookingConfirmationRef = useRef<ConfirmationPopupRef>(null);
  const dispatch = useAppDispatch();

  const [isExpanded1, setIsExpanded1] = useState(false);
  const [isExpanded2, setIsExpanded2] = useState(false);
  const arrowAnimation1 = useRef(new Animated.Value(0)).current;
  const arrowAnimation2 = useRef(new Animated.Value(0)).current;

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

  const rotateArrow = (isExpanded, animation) => {
    Animated.timing(animation, {
      toValue: isExpanded ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const arrowStyle1 = {
    transform: [
      {
        rotate: arrowAnimation1.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "90deg"], // Rotates the arrow downward
        }),
      },
    ],
  };

  const arrowStyle2 = {
    transform: [
      {
        rotate: arrowAnimation2.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "90deg"], // Rotates the arrow downward
        }),
      },
    ],
  };

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.white }}>
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
        <LoaderComponent />
      ) : (
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 20,
          }}
        >
          {/* Booking Info */}

          {bookingDetails ? (
            <View style={styles.card}>
              <View style={styles.row}>
                {/* Icon */}
                <View style={styles.iconContainer}>
                  <Image
                    source={icons.tennis} // Replace with actual image path
                    style={styles.icon}
                  />
                </View>

                {/* Session Details */}
                <View style={styles.detailsContainer}>
                  <BerlingskeMedium style={styles.sessionTitle}>
                    Session
                  </BerlingskeMedium>

                  <View style={styles.rowDirection}>
                    <ArchivoRegular style={styles.miniHeading}>
                      Booking:{" "}
                    </ArchivoRegular>
                    <ArchivoExtraLight style={styles.fieldDetail}>
                      {bookingDetails.bookingTitle}
                    </ArchivoExtraLight>
                  </View>
                  <View style={[styles.rowDirection, { marginTop: -3 }]}>
                    <ArchivoRegular style={styles.miniHeading}>
                      Booking Type:{" "}
                    </ArchivoRegular>
                    <ArchivoExtraLight style={styles.fieldDetail}>
                      {bookingDetails.bookingType}
                    </ArchivoExtraLight>
                  </View>
                  <View style={[styles.rowDirection, { marginTop: -3 }]}>
                    <ArchivoRegular style={styles.miniHeading}>
                      Court Number:{" "}
                    </ArchivoRegular>
                    <ArchivoExtraLight style={styles.fieldDetail}>
                      {bookingDetails.bookingCourt}
                    </ArchivoExtraLight>
                  </View>
                </View>
              </View>

              {/* Booking Member */}
              <View style={[styles.section, { marginTop: vh * 2 }]}>
                <Image source={icons.defaultUser} style={styles.logo} />

                <ArchivoRegular style={[styles.miniHeading]}>
                  Booking Member
                </ArchivoRegular>
              </View>
              <Text style={styles.sectionText}>
                {`${bookingDetails.bookingMember.bookingMemberName} (${bookingDetails.bookingMember.bookingMemberCode}) ${bookingDetails.bookingMember.bookingMemberStatus}`}
              </Text>
              <View style={styles.borderSeperator} />

              {/* Date and Time */}
              <View style={styles.bottomRow}>
                <View>
                  <View style={styles.section}>
                    <Image source={icons.calendar} style={styles.logo} />
                    <ArchivoRegular style={styles.bottomText}>
                      Court Date
                    </ArchivoRegular>
                  </View>
                  <ArchivoExtraLight style={styles.bottomValue}>
                    {bookingDetails.bookingSessionDate}
                  </ArchivoExtraLight>
                </View>
                <View>
                  <View style={styles.section}>
                    <Image source={icons.clock} style={styles.logo} />
                    <ArchivoRegular style={styles.bottomText}>
                      Court Time
                    </ArchivoRegular>
                  </View>
                  <ArchivoExtraLight style={styles.bottomValue}>
                    {bookingDetails.bookingSessionTimeFrom}
                  </ArchivoExtraLight>
                </View>
              </View>
            </View>
          ) : null}

          {/* Players Info */}

          {bookingDetails ? (
            <View style={styles.accordianHeader}>
              <Collapse
                isExpanded={isExpanded1}
                onToggle={(expanded) => {
                  setIsExpanded1(expanded);
                  rotateArrow(expanded, arrowAnimation1);
                }}
              >
                <CollapseHeader>
                  <View
                    style={[
                      styles.rowDirection,
                      {
                        justifyContent: "space-between",
                      },
                    ]}
                  >
                    <View style={styles.rowDirection}>
                      <Image
                        source={icons.group}
                        style={styles.accordianIcon}
                      />
                      <BerlingskeMedium style={{ fontSize: vh * 1.8 }}>
                        Player Info
                      </BerlingskeMedium>
                    </View>
                    <Animated.Image
                      source={icons.nextArrow}
                      style={[styles.dropdownArrow, arrowStyle1]}
                    />
                  </View>
                </CollapseHeader>
                <CollapseBody>
                  <View style={{ marginTop: vh * 2 }}>
                    {bookingDetails.players.map(
                      (player: any, index: number) => (
                        <View style={[styles.rowDirection, styles.container]}>
                          <Image
                            source={icons.defaultUser}
                            style={{
                              width: vh * 1.5,
                              height: vh * 1.5,
                              resizeMode: "contain",
                            }}
                          />
                          <ArchivoRegular
                            style={{
                              fontSize: vh * 1.4,
                              width: "80%",
                              textAlign: "right",
                              color: themeColors.darkText,
                            }}
                            key={index}
                          >
                            {player.bookingMemberName}
                          </ArchivoRegular>
                        </View>
                      )
                    )}
                  </View>
                </CollapseBody>
              </Collapse>
              <View style={styles.borderSeperator} />
              <Collapse
                isExpanded={isExpanded2}
                onToggle={(expanded) => {
                  setIsExpanded2(expanded);
                  rotateArrow(expanded, arrowAnimation2);
                }}
              >
                <CollapseHeader>
                  <View
                    style={[
                      styles.rowDirection,
                      {
                        justifyContent: "space-between",
                      },
                    ]}
                  >
                    <View style={styles.rowDirection}>
                      <Image
                        source={icons.bankTransfer}
                        style={styles.accordianIcon}
                      />
                      <BerlingskeMedium style={{ fontSize: vh * 1.8 }}>
                        Booking & Payments
                      </BerlingskeMedium>
                    </View>
                    <Animated.Image
                      source={icons.nextArrow}
                      style={[styles.dropdownArrow, arrowStyle2]}
                    />
                  </View>
                </CollapseHeader>
                <CollapseBody>
                  <View style={{ marginTop: vh * 1.5 }}>
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
                </CollapseBody>
              </Collapse>
            </View>
          ) : null}

          {bookingDetails ? (
            <View
              style={{ borderWidth: 1, marginTop: 20, borderColor: "#0003" }}
            >
              <ScrollView
                contentContainerStyle={{ marginTop: 0 }}
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
            </View>
          ) : null}
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
    height: vh * 4.5,
    width: 120,
    backgroundColor: themeColors.red,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
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
    fontWeight: "bold",
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
});
