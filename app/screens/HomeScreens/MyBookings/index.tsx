import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ScreenWrapper from "@/app/components/ScreenWrapper";
import GeneralHeader from "@/app/components/GeneralHeader";
import { colors } from "@/app/utils/theme";
import MainButton from "@/app/components/MainButton";
import { icons } from "@/app/MyAssets";
import BookedSlots from "@/app/components/BookedSlots";
import BookingFilterPopup, {
  BookingFilterPopupRef,
} from "@/app/components/BookingFilterPopup";
import InputField from "@/app/components/InputField";
import moment from "moment";
import { FetchMyBookings } from "@/app/api/Bookings";
import SelectDropDown, { SelectDropdownRef } from "@/app/components/Dropdown";

const monthsData = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];
interface Booking {
  // Define the structure of a booking, e.g., an object with properties
  sessions: [];
  bookingCount: string;
  bookingAmount: string;
  bookingPayByMe: string;
}

interface BookingsData {
  [key: string]: Booking;
}
const MyBookingsScreen = () => {
  const tabs = ["Tennis", "Squash", "Padel", "Cricket"];
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const [tenyearsDD, setTenYearsDD] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedDate, setSelectedDate] = useState(
    moment(new Date()).format("YYYY")
  );
  const [selectedMonth, setSelectedMonth] = useState(
    moment(new Date()).format("MMM")
  );
  const [bookingsData, setBookingsData] = useState<BookingsData>({});
  const yearDropdownRef = useRef<SelectDropdownRef>(null);
  const monthDropdownRef = useRef<SelectDropdownRef>(null);

  useEffect(() => {
    generateTenYearsArray();
    fetchData(selectedDate);
  }, []);

  const generateTenYearsArray = () => {
    const currentYear = new Date().getFullYear();
    const tenYearsDD = [];

    for (let i = 0; i < 10; i++) {
      const year = currentYear - i;
      tenYearsDD.push({ value: year.toString(), label: year.toString() });
    }
    setTenYearsDD(tenYearsDD);
  };

  const fetchData = async (year: string) => {
    if (bookingsData[year]) {
      return null;
    }
    let data = {
      sport: selectedTab.toUpperCase(),
      year: year,
    };
    const response = await FetchMyBookings(data);
    if (response.data.msgCode == "200") {
      setBookingsData({ ...bookingsData, [year]: response.data.data });
    }
  };
  console.log(JSON.stringify(bookingsData));

  const showSelectedYearData = () => {
    if (bookingsData[selectedDate]) {
      const data = bookingsData[selectedDate];
      return data.sessions;
    } else {
      return [];
    }
  };

  const bookingFilterPopup = useRef<BookingFilterPopupRef>(null);
  return (
    <View style={styles.screenContainer}>
      <GeneralHeader title={"My Bookings"} />
      <BookingFilterPopup reference={bookingFilterPopup} />
      <SelectDropDown
        reference={yearDropdownRef}
        onChangeValue={(value) => {
          setSelectedDate(value.value);
          fetchData(value.value);
        }}
        values={tenyearsDD}
      />
      <SelectDropDown
        reference={monthDropdownRef}
        onChangeValue={(value) => console.log(value)}
        values={monthsData}
      />

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
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <InputField
            icon={icons.calendar}
            rightIcon={icons.dropdown}
            value={selectedDate}
            dropdown={true}
            onPress={() => yearDropdownRef.current?.show()}
          />
          <InputField
            icon={icons.calendar}
            rightIcon={icons.dropdown}
            value={selectedMonth}
            dropdown={true}
            onPress={() => monthDropdownRef.current?.show()}
          />
        </View>
        <FlatList
          data={showSelectedYearData()}
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
          renderItem={({ item, index }) => {
            return <BookedSlots booking={item} />;
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
