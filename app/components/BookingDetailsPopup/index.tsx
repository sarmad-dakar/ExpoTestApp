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
  ScrollView,
  ActivityIndicator,
} from "react-native";
import BerlingskeBold from "../TextWrapper/BerlingskeBold";
import { icons, images } from "@/app/MyAssets";
import moment from "moment";
import { useSelector } from "react-redux";
import { GetAlreadyBookedDetails } from "@/app/api/Bookings";
import { themeColors } from "@/app/utils/theme";
import ArchivoRegular from "../TextWrapper/ArchivoRegular";
import { vh } from "@/app/utils/units";
import ArchivoMedium from "../TextWrapper/ArchivoMedium";

// Get screen dimensions
const { height } = Dimensions.get("window");

const DetailComponent = ({ label, value, hideBorder }: any) => {
  return (
    <View style={[styles.container, hideBorder && { borderBottomWidth: 0 }]}>
      <ArchivoMedium style={styles.label}>
        {label} {value ? ":" : ","}{" "}
      </ArchivoMedium>
      <View style={{ width: "40%", alignItems: "flex-end" }}>
        <ArchivoRegular
          style={{ fontSize: vh * 1.5, color: themeColors.darkText }}
        >
          {" "}
          {value}
        </ArchivoRegular>
      </View>
    </View>
  );
};

export type BookingDetailsPopupRef = {
  show: (bookingId: String, sport: String) => void;
  hide: () => void;
};

type BookingDetailsPopupProps = {
  reference?: RefObject<BookingDetailsPopupRef>; // Optional if passing forwardRef
  onCancelBookingPress: () => void;
};

const BookingDetailsPopup = forwardRef<
  BookingDetailsPopupRef,
  BookingDetailsPopupProps
>((props, ref) => {
  const translateY = useRef(new Animated.Value(height)).current; // Initial position (off-screen)
  const [visible, setVisible] = useState(false);

  const [bookingDetails, setBookingDetails] = useState();
  const loading = useSelector(
    (state: RootState) => state.general.generalLoader
  );

  const fetchData = async (key, sport) => {
    let data = {
      id: key,
      sport: sport,
    };
    const response = await GetAlreadyBookedDetails(data);
    setBookingDetails(response.data.data);
  };

  useImperativeHandle(ref || props.reference, () => ({
    hide: hide,
    show: show,
  }));

  const hide = () => {
    setVisible(false);
  };

  const show = (bookingId, sport) => {
    fetchData(bookingId, sport);
    setVisible(true);
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
          <View style={{ flex: 1 }}>
            {loading ? (
              <View style={{ alignSelf: "center", marginTop: 100 }}>
                <ActivityIndicator
                  size={"large"}
                  color={themeColors.secondary}
                />
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
                          style={{
                            color: themeColors.darkText,
                            fontSize: vh * 2,
                          }}
                        >
                          Session
                        </BerlingskeBold>
                      </View>
                      {shouldCancelVisible() ? (
                        <TouchableOpacity
                          onPress={() => props.onCancelBookingPress()}
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
                        style={{
                          color: themeColors.darkText,
                          fontSize: vh * 2,
                        }}
                      >
                        Players Info
                      </BerlingskeBold>
                    </View>
                    {bookingDetails.players.map(
                      (player: any, index: number) => (
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
                      )
                    )}
                  </View>
                ) : null}

                {/* Payment Info */}
                {bookingDetails ? (
                  <View style={styles.cardContainer}>
                    <View style={[styles.rowDirection, { marginBottom: 10 }]}>
                      <Image source={icons.bankTransfer} style={styles.logo} />
                      <BerlingskeBold
                        style={{
                          color: themeColors.darkText,
                          fontSize: vh * 2,
                        }}
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
    // padding: 16,
    height: height * 0.9, // Adjust height as needed
  },
  content: {
    flex: 1,
    // paddingTop: 10,
  },
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
    height: vh * 4.2,
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
});

export default BookingDetailsPopup;
