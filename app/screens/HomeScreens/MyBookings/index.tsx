import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import ScreenWrapper from "@/app/components/ScreenWrapper";
import GeneralHeader from "@/app/components/GeneralHeader";
import { colors } from "@/app/utils/theme";
import MainButton from "@/app/components/MainButton";
import { icons } from "@/app/MyAssets";
import BookedSlots from "@/app/components/BookedSlots";
import BookingFilterPopup, {
  BookingFilterPopupRef,
} from "@/app/components/BookingFilterPopup";

const MyBookingsScreen = () => {
  const tabs = ["All", "Tennis", "Squash", "Padel", "Cricket"];
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const bookingFilterPopup = useRef<BookingFilterPopupRef>(null);
  return (
    <View style={styles.screenContainer}>
      <GeneralHeader title={"My Bookings"} />
      <BookingFilterPopup reference={bookingFilterPopup} />
      <ScreenWrapper>
        <View style={styles.tabContainer}>
          {tabs.map((item) => (
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => setSelectedTab(item)}
            >
              <Text
                style={[
                  styles.heading,
                  selectedTab == item && {
                    color: colors.green,
                    textDecorationLine: "underline",
                  },
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <MainButton
          onPress={() => bookingFilterPopup.current?.show()}
          title="Filters"
          style={styles.btn}
          icon={icons.filter}
        />

        <FlatList
          data={[1, 2, 3]}
          ListEmptyComponent={() => {
            return (
              <View style={styles.noBookingContainer}>
                <Image source={icons.noBooking} style={styles.noBookingIcon} />
                <Text style={styles.title}>Bookings</Text>
                <Text style={{ textAlign: "center" }}>
                  Currently, there are no Bookings available for display. Please
                  Check again later
                </Text>
              </View>
            );
          }}
          renderItem={() => {
            return <BookedSlots />;
          }}
        />
      </ScreenWrapper>
    </View>
  );
};

export default MyBookingsScreen;
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  heading: {
    color: "#5F5F5F",
    marginRight: 10,
    fontSize: 16,
  },
  btn: {
    height: 30,
    width: 100,
    alignSelf: "flex-end",
  },
  noBookingIcon: {
    height: 100,
    width: 100,
    resizeMode: "contain",
  },
  title: {
    fontSize: 26,
  },
  noBookingContainer: {
    alignItems: "center",
    width: "70%",
    alignSelf: "center",
    marginTop: 25,
  },
});
