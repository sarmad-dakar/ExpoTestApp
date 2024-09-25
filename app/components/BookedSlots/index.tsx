import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { colors } from "@/app/utils/theme";
import { icons } from "@/app/MyAssets";
import moment from "moment";

const BookedSlots = ({ booking }: any) => {
  const [enablePopup, setEnablePopup] = useState(false);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setEnablePopup(!enablePopup)}
        style={styles.iconContainer}
      >
        <Image style={styles.more} source={icons.more} />
      </TouchableOpacity>

      {enablePopup && (
        <View style={styles.listView}>
          <View style={styles.listBtn}>
            <Text style={styles.listText}>View Details</Text>
          </View>
          <View
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
          </View>
          <View style={styles.listBtn}>
            <Text style={styles.listText}>Cancel Booking</Text>
          </View>
        </View>
      )}

      <Text style={styles.heading}>Tennis Booking</Text>
      <Text>
        <Text style={styles.bold}>Booking Member: </Text>Mr David Schranz
      </Text>
      <Text>
        <Text style={styles.bold}>Description: </Text>
        {booking.description}
      </Text>
      <Text style={styles.footerText}>
        {/* Monday, 29th July 2024, 05:30 PM-Court 5 */}
        {/* {moment(booking.date, "DD/MM/YYYY").day()} */}
        {moment(booking.date, "DD/MM/YYYY").format("dddd, DD MMM YYYY")}
      </Text>
    </View>
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
    height: 90,
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
    justifyContent: "center",
    alignItems: "center",
  },
});
