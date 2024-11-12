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
import { colors } from "@/app/utils/theme";

// Get screen dimensions
const { height } = Dimensions.get("window");

const DetailComponent = ({ label, value }: any) => {
  return (
    <View style={styles.container}>
      <BerlingskeBold style={styles.label}>
        {label} {value ? ":" : ","}{" "}
      </BerlingskeBold>
      <Text>{value}</Text>
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
                <ActivityIndicator size={"large"} color={colors.secondary} />
              </View>
            ) : (
              <ScrollView contentContainerStyle={{ paddingHorizontal: 0 }}>
                {/* Booking Info */}
                <View
                  style={[
                    styles.rowDirection,
                    { justifyContent: "space-between" },
                  ]}
                >
                  <View style={styles.rowDirection}>
                    <Image source={icons.clock} style={styles.logo} />
                    <BerlingskeBold>Session</BerlingskeBold>
                  </View>
                  {shouldCancelVisible() ? (
                    <TouchableOpacity
                      onPress={props.onCancelBookingPress}
                      style={styles.cancelBtn}
                    >
                      <Text
                        style={{
                          fontWeight: "bold",
                          color: "white",
                          fontSize: 13,
                        }}
                      >
                        Cancel Booking
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                </View>

                {bookingDetails && (
                  <>
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
                    />

                    {/* Players Info */}
                    <View style={[styles.rowDirection, { marginTop: 20 }]}>
                      <Image source={icons.group} style={styles.logo} />
                      <BerlingskeBold>Players Info</BerlingskeBold>
                    </View>
                    <View style={[styles.rowDirection, { flexWrap: "wrap" }]}>
                      {bookingDetails.players.map(
                        (player: any, index: number) => (
                          <View style={[styles.rowDirection, { margin: 5 }]}>
                            <Image
                              source={icons.defaultUser}
                              style={{
                                width: 15,
                                height: 15,
                                resizeMode: "contain",
                                marginRight: 10,
                              }}
                            />
                            <Text style={{ fontSize: 13 }} key={index}>
                              {player.bookingMemberName}
                            </Text>
                          </View>
                        )
                      )}
                    </View>

                    {/* Payment Info */}
                    <View style={[styles.rowDirection, { marginTop: 20 }]}>
                      <Image source={icons.payments} style={styles.logo} />
                      <BerlingskeBold>Booking & Payments</BerlingskeBold>
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
                    />

                    <View style={styles.tableContainer}>
                      <View style={styles.tableHeader}>
                        <Text style={styles.tableHeaderText}>Name</Text>
                        <Text style={styles.tableHeaderText}>Booking Rate</Text>
                        <Text style={styles.tableHeaderText}>Receipt</Text>
                        <Text style={styles.tableHeaderText}>
                          Payment Method
                        </Text>
                      </View>
                      {bookingDetails.paymentPlayers.map(
                        (payment: any, index: number) => (
                          <View key={index} style={styles.tableRow}>
                            <Text style={styles.tableCell}>
                              {payment.payerName}
                            </Text>
                            <Text style={styles.tableCell}>
                              ${payment.bookingRate}
                            </Text>
                            <Text style={styles.tableCell}>
                              {payment.bookingReceipt}
                            </Text>
                            <Text style={styles.tableCell}>
                              {payment.paymentMethod}
                            </Text>
                          </View>
                        )
                      )}
                    </View>
                  </>
                )}
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
    padding: 16,
    height: height * 0.9, // Adjust height as needed
  },
  content: {
    flex: 1,
    paddingTop: 10,
  },
  container: {
    borderBottomWidth: 1,
    borderColor: "#0004",
    flexDirection: "row",
    alignItems: "center",
    height: 30,
  },
  label: {
    fontSize: 16,
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
    marginVertical: 10,
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
    textAlign: "center",
    fontSize: 14,
    color: "white",
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
    textAlign: "center",
    fontSize: 14,
  },
  cancelBtn: {
    height: 35,
    width: 120,
    backgroundColor: colors.red,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
});

export default BookingDetailsPopup;
