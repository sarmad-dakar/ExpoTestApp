import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import BerlingskeBold from "../TextWrapper/BerlingskeBold";
import { bookingData, newBookingData } from "@/app/utils/dummyJson";
import { colors } from "@/app/utils/theme";
import moment from "moment";

// Define interfaces for the item and data props
interface SessionItem {
  isAvailable: boolean;
  icon?: string;
  slot: string;
  rows: number;
}

interface CourtSession {
  title: string;
  courtType: string;
  session: SessionItem[];
  resources: string;
}

interface BookingData {
  timeSlots: string[];
  bookingSessions: CourtSession[];
}

interface BookingCalendarProps {
  data: BookingData;
  date: string | Date;
  onBookingPress: (image: string) => void;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({
  data,
  date,
  onBookingPress,
}) => {
  const getColor = (item: SessionItem, sessionIndex: Number, index: Number) => {
    if (!item.isAvailable && !item.icon) {
      return colors.unAvailable;
    }

    if (!item.isAvailable && item.icon) {
      return colors.booked;
    }

    // if (data.bookingSessions[sessionIndex].session[index - 1]) {
    //   if (data.bookingSessions[sessionIndex].session[index - 1].rows == 2) {
    //     return colors.booked;
    //   }
    // }

    const currentDay = moment(date).format("DD-MM-YYYY");

    const currentDate = moment(
      `${currentDay} ${item.slot}`,
      "DD-MM-YYYY hh:mma"
    );
    const selectedDate = moment(new Date());

    if (currentDate.isBefore(selectedDate) && item.isAvailable) {
      return colors.expiredSeesion;
    }

    if (item.isAvailable) {
      return colors.available;
    }
  };

  const getText = (item: SessionItem, sessionIndex: Number, index: Number) => {
    if (!item.isAvailable && !item.icon) {
      return "Unavailable";
    }

    if (!item.isAvailable && item.icon) {
      return "Booked";
    }

    const currentDay = moment(date).format("DD-MM-YYYY");
    const currentDate = moment(
      `${currentDay} ${item.slot}`,
      "DD-MM-YYYY hh:mma"
    );
    const selectedDate = moment(new Date());

    if (currentDate.isBefore(selectedDate) && item.isAvailable) {
      return "Expired";
    }

    if (item.isAvailable) {
      return "+";
    }
  };

  return (
    <View style={{ flex: 1, height: 500, width: "95%" }}>
      <BerlingskeBold>Book Your Slots</BerlingskeBold>

      <View style={styles.btnContainer}>
        <Text>Back</Text>
        <Text>Next</Text>
      </View>

      <View style={{ flexDirection: "row", backgroundColor: "#E0E0E0" }}>
        <View>
          <View style={{ width: 80, height: 38 }} />
          {data.timeSlots.map((timeSlot, index) => (
            <View key={index} style={styles.time}>
              <Text style={styles.timeFont}>{timeSlot || "N/A"}</Text>
            </View>
          ))}
        </View>
        <ScrollView
          horizontal
          contentContainerStyle={{ flexDirection: "row" }}
          style={{ flex: 1 }}
        >
          {data.bookingSessions.map((session, sessionIndex) => (
            <View key={sessionIndex}>
              <View style={styles.court}>
                {session.courtType === "Clay Court" ? (
                  <View
                    style={{
                      height: 4,
                      backgroundColor: "#8c390c",
                      width: "100%",
                      position: "absolute",
                      bottom: 0,
                      borderTopLeftRadius: 5,
                      borderTopRightRadius: 5,
                    }}
                  />
                ) : (
                  <View
                    style={{
                      height: 4,
                      backgroundColor: colors.green,
                      width: "100%",
                      position: "absolute",
                      bottom: 0,
                      borderTopLeftRadius: 5,
                      borderTopRightRadius: 5,
                    }}
                  />
                )}
                <Text>{session.title}</Text>
              </View>

              {session.session.map((item, itemIndex) =>
                session?.session[itemIndex - 1]?.rows == 2 ? (
                  <View />
                ) : (
                  <TouchableOpacity
                    onPress={() => onBookingPress(session, item)}
                    key={itemIndex}
                    style={[
                      styles.court,
                      {
                        backgroundColor: getColor(
                          item,
                          sessionIndex,
                          itemIndex
                        ),
                      },
                      item.rows == 2 && { height: 80 },
                    ]}
                  >
                    {item.icon && (
                      <Image source={{ uri: item.icon }} style={styles.icon} />
                    )}
                    <Text style={{ fontSize: 10 }}>
                      {getText(item, sessionIndex, itemIndex)}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default BookingCalendar;

const styles = StyleSheet.create({
  court: {
    height: 40,
    backgroundColor: colors.secondary,
    width: 90,
    marginRight: 3,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
    overflow: "hidden",
  },
  time: {
    width: 80,
    backgroundColor: "black",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
    marginRight: 5,
  },
  timeFont: {
    color: "white",
    fontWeight: "500",
  },
  icon: {
    height: 20,
    width: 20,
    resizeMode: "contain",
    position: "absolute",
    top: 3,
    right: 3,
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
});
