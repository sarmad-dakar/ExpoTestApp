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
import ArchivoRegular from "@/app/components/TextWrapper/ArchivoRegular";
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
  AccordionList,
} from "accordion-collapse-react-native";
import { vh, vw } from "@/app/utils/units";
import ArchivoExtraLight from "@/app/components/TextWrapper/ArchivoExtraLight";
import BerlingskeMedium from "@/app/components/TextWrapper/BerlingskeMedium";
import ArchivoMedium from "@/app/components/TextWrapper/ArchivoMedium";
import { ConfirmationPopupRef } from "../ConfirmationPopup";
import BookingConfirmationPopup from "../BookingConfirmationPopup";
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
  const [isExpanded1, setIsExpanded1] = useState(false);
  const [isExpanded2, setIsExpanded2] = useState(false);
  const [isExpanded3, setIsExpanded3] = useState(false);
  const bookingConfirmationRef = useRef<ConfirmationPopupRef>(null);

  const arrowAnimation1 = useRef(new Animated.Value(0)).current;
  const arrowAnimation2 = useRef(new Animated.Value(0)).current;
  const arrowAnimation3 = useRef(new Animated.Value(0)).current;

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

  const arrowStyle3 = {
    transform: [
      {
        rotate: arrowAnimation3.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "90deg"], // Rotates the arrow downward
        }),
      },
    ],
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

  const AccountCard = ({ item, index }) => {
    const [enablePopup, setEnablePopup] = useState(false);

    return (
      <View style={styles.accountCard}>
        <View
          style={[styles.rowDirection, { justifyContent: "space-between" }]}
        >
          <ArchivoRegular style={styles.bold}>
            <ArchivoMedium style={styles.bold}>Receipt# :</ArchivoMedium>
            {item?.bookingReceipt}
          </ArchivoRegular>
          <View style={[styles.rowDirection]}>
            <Image source={icons.euro} style={styles.euro} />
            <ArchivoMedium style={{ fontSize: vh * 1.5 }}>
              {item?.bookingRate}
            </ArchivoMedium>
          </View>
        </View>

        <View
          style={[styles.rowDirection, { justifyContent: "space-between" }]}
        >
          <View>
            <ArchivoMedium style={styles.bold}>Name</ArchivoMedium>
            <ArchivoExtraLight style={{ fontSize: vh * 1.4, marginTop: "-8%" }}>
              {item?.payerName}
            </ArchivoExtraLight>
          </View>
          <View style={{}}>
            <ArchivoMedium style={styles.bold}>Payment Method</ArchivoMedium>
            <ArchivoExtraLight style={{ fontSize: vh * 1.4, marginTop: "-8%" }}>
              {item.paymentMethod}
            </ArchivoExtraLight>
          </View>
        </View>
      </View>
    );
  };

  const rotateArrow = (isExpanded, animation) => {
    Animated.timing(animation, {
      toValue: isExpanded ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
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
        <BookingConfirmationPopup
          reference={bookingConfirmationRef}
          onAccept={onConfirmedCancel}
        />
        {/* Bottom sheet content */}
        <View style={styles.content}>
          <View style={{ flex: 1 }}>
            {loading ? (
              <View style={{ alignSelf: "center", marginTop: 100 }}>
                <ActivityIndicator size={"large"} color={themeColors.primary} />
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
                  <View style={styles.card}>
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
                              <View
                                style={[styles.rowDirection, styles.container]}
                              >
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
                              source={icons.calendar}
                              style={styles.accordianIcon}
                            />
                            <BerlingskeMedium style={{ fontSize: vh * 1.8 }}>
                              Booking Info
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
                    <View style={styles.borderSeperator} />
                    <Collapse
                      isExpanded={isExpanded3}
                      onToggle={(expanded) => {
                        setIsExpanded3(expanded);
                        rotateArrow(expanded, arrowAnimation3);
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
                              Payment Info
                            </BerlingskeMedium>
                          </View>
                          <Animated.Image
                            source={icons.nextArrow}
                            style={[styles.dropdownArrow, arrowStyle3]}
                          />
                        </View>
                      </CollapseHeader>
                      <CollapseBody>
                        <View style={{ marginTop: 0 }}>
                          {bookingDetails?.paymentPlayers?.map((item) => {
                            return <AccountCard item={item} />;
                          })}
                        </View>
                      </CollapseBody>
                    </Collapse>
                  </View>
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
export default BookingDetailsPopup;
