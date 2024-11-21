import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "@/app/utils/theme";
import { icons } from "@/app/MyAssets";
import moment from "moment";
import ArchivoRegular from "../TextWrapper/ArchivoRegular";
import ArchivoExtraLight from "../TextWrapper/ArchivoExtraLight";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { vh } from "@/app/utils/units";

const BookedSlots = ({
  booking,
  selectedSport,
  setSelectedBooking,
  onDetailViewPress,
}: any) => {
  const [enablePopup, setEnablePopup] = useState(false);
  const user = useSelector((state: RootState) => state.user.user);
  console.log(user, "user");

  const shouldCancelVisible = () => {
    const bookingDate = moment(
      `${booking.date} ${booking.time}`,
      "DD/MM/YYYY hh:mma"
    );
    const currentDate = moment();
    console.log(bookingDate.diff(currentDate, "hours"), "time diff");

    return bookingDate.diff(currentDate, "hours") >= 10;
  };
  return (
    <Pressable onPress={() => setEnablePopup(false)} style={styles.container}>
      <TouchableOpacity
        onPress={() => setEnablePopup(!enablePopup)}
        style={styles.iconContainer}
      >
        <Image style={styles.more} source={icons.more} />
      </TouchableOpacity>

      {enablePopup && (
        <View style={styles.listView}>
          <TouchableOpacity
            onPress={() => {
              setEnablePopup(false);
              onDetailViewPress(booking);
            }}
            style={styles.listBtn}
          >
            <Text style={styles.listText}>View Details</Text>
          </TouchableOpacity>
          {/* <View
            style={[
              styles.listBtn,
              {
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderColor: "#0008",
              },
            ]}
          >
            <Text style={styles.listText}>Edit Booking</Text>
          </View> */}
          {shouldCancelVisible() ? (
            <TouchableOpacity
              onPress={() => setSelectedBooking(booking)}
              style={styles.listBtn}
            >
              <Text style={styles.listText}>Cancel Booking</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      )}

      <ArchivoRegular style={styles.heading}>
        {selectedSport} Booking
      </ArchivoRegular>

      <View style={styles.rowDirection}>
        <ArchivoRegular style={styles.bold}> Booking Member: </ArchivoRegular>
        <ArchivoExtraLight style={{ fontSize: vh * 1.5 }}>
          {user?.title}
        </ArchivoExtraLight>
      </View>

      <View style={[styles.rowDirection, { marginTop: -vh * 0.7 }]}>
        <ArchivoRegular style={styles.bold}> Description: </ArchivoRegular>
        <ArchivoExtraLight style={{ fontSize: vh * 1.5 }}>
          {booking.description}
        </ArchivoExtraLight>
      </View>

      <Text style={styles.footerText}>
        {moment(booking.date, "DD/MM/YYYY").format("dddd, DD MMM YYYY")}
      </Text>
    </Pressable>
  );
};

export default BookedSlots;

const styles = StyleSheet.create({
  container: {
    // height: 120,
    borderWidth: 1,
    padding: 15,
    marginTop: 20,
    borderRadius: 15,
    borderColor: "#0004",
    backgroundColor: "white",
  },
  heading: {
    marginBottom: 10,
    fontSize: vh * 1.8,
    color: colors.primary,
  },
  footerText: {
    color: "#0008",
    fontSize: 10,
    marginTop: vh * 0.5,
  },
  bold: {
    fontSize: vh * 1.7,
    color: colors.primary,
  },
  more: {
    height: "100%",
    width: "100%",
    resizeMode: "contain",
  },
  iconContainer: {
    height: 25,
    width: 25,
    position: "absolute",
    right: 10,
    top: 10,
    zIndex: 1,
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
  rowDirection: {
    flexDirection: "row",
    alignItems: "center",
  },
});
