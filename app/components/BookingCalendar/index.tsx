import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import BerlingskeBold from "../TextWrapper/BerlingskeBold";
import { bookingData, newBookingData } from "@/app/utils/dummyJson";
import { colors } from "@/app/utils/theme";

const BookingCalendar = () => {
  const getColor = (item: String) => {
    switch (item) {
      case "Available":
        return "white";
      case "N/A":
        return "#F6CECE";
      case "Booked":
        return "#EBFFCF";
      case "Expired":
        return "#E8E8E8";
      default:
        break;
    }
  };
  return (
    <View style={{ flex: 1, height: 500, width: "95%" }}>
      <BerlingskeBold>Book Your Slots</BerlingskeBold>

      <View style={{ flexDirection: "row" }}>
        <View>
          <View style={{ width: 80, height: 38 }}></View>
          {newBookingData.timings.map((item) => (
            <View style={styles.time}>
              <Text style={styles.timeFont}>{item}</Text>
            </View>
          ))}
        </View>
        <ScrollView
          horizontal
          contentContainerStyle={{ flexDirection: "row" }}
          style={{ flex: 1 }}
        >
          {newBookingData.courts.map((item) => (
            <View>
              <View style={styles.court}>
                <Text>{item.name}</Text>
              </View>

              {item.times.map((item) => (
                <View
                  style={[styles.court, { backgroundColor: getColor(item) }]}
                >
                  {item == "Available" ? (
                    <Text style={{ fontSize: 10 }}>{"+"}</Text>
                  ) : (
                    <Text style={{ fontSize: 10 }}>{item}</Text>
                  )}
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      </View>

      {/* {bookingData.timings.map((item) => {
        return (
          <View style={{ flexDirection: "row", marginTop: 2 }}>
            <View style={styles.time}>
              <Text style={styles.timeFont}>{item.time}</Text>
            </View>

            {item.availability.map((item) => {
              return (
                <View
                  style={[styles.court, { backgroundColor: getColor(item) }]}
                >
                  {item == "Available" ? (
                    <Text style={{ fontSize: 10 }}>{"+"}</Text>
                  ) : (
                    <Text style={{ fontSize: 10 }}>{item}</Text>
                  )}
                </View>
              );
            })}
          </View>
        );
      })} */}
    </View>
  );
};

export default BookingCalendar;

const styles = StyleSheet.create({
  court: {
    height: 35,
    backgroundColor: colors.secondary,
    width: 60,
    marginRight: 3,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  time: {
    width: 80,
    backgroundColor: "black",
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
    marginRight: 5,
  },
  timeFont: {
    color: "white",
    fontWeight: "500",
  },
});
