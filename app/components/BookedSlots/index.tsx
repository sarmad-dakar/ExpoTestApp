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

const BookedSlots = ({
  booking,
  selectedSport,
  setSelectedBooking,
  onDetailViewPress,
}: any) => {
  const [enablePopup, setEnablePopup] = useState(false);

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
              setEnablePopup(false)
              onDetailViewPress(booking)
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

      <Text style={styles.heading}>{selectedSport} Booking</Text>
      <Text>
        <Text style={styles.bold}>Booking Member: </Text>Mr David Schranz
      </Text>
      <Text>
        <Text style={styles.bold}>Description: </Text>
        {booking.description}
      </Text>
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
    marginBottom: 15,
    fontWeight: "600",
  },
  footerText: {
    color: "#0008",
  },
  bold: {
    fontWeight: "600",
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
});
