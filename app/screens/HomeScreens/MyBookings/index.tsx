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
import { AllSports } from "@/app/utils/dummyJson";

const monthsData = [
  { value: "01", label: "Jan" },
  { value: "02", label: "Feb" },
  { value: "03", label: "Mar" },
  { value: "04", label: "Apr" },
  { value: "05", label: "May" },
  { value: "06", label: "Jun" },
  { value: "07", label: "Jul" },
  { value: "08", label: "Aug" },
  { value: "09", label: "Sep" },
  { value: "10", label: "Oct" },
  { value: "11", label: "Nov" },
  { value: "12", label: "Dec" },
];

interface Booking {
  sessions: [
    {
      time: string;
      description: string;
      date: string;
      bookingKey: string;
    }
  ];
  bookingCount: string;
  bookingAmount: string;
  bookingPayByMe: string;
}

interface BookingsData {
  [sport: string]: {
    [year: string]: Booking;
  };
}

const MyBookingsScreen = () => {
  const tabs = ["Tennis", "Squash", "Padel", "Cricket"];
  const [selectedTab, setSelectedTab] = useState(AllSports[0]);
  const [tenyearsDD, setTenYearsDD] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedDate, setSelectedDate] = useState(
    moment(new Date()).format("YYYY")
  );
  const [selectedMonth, setSelectedMonth] = useState(
    moment(new Date()).format("MM")
  );
  const [bookingsData, setBookingsData] = useState<BookingsData>({});
  const yearDropdownRef = useRef<SelectDropdownRef>(null);
  const monthDropdownRef = useRef<SelectDropdownRef>(null);

  useEffect(() => {
    generateTenYearsArray();
    fetchData(selectedTab?.name, selectedDate);
  }, [selectedTab, selectedDate]);

  const generateTenYearsArray = () => {
    const currentYear = new Date().getFullYear();
    const tenYearsDD = [];

    for (let i = 0; i < 10; i++) {
      const year = currentYear - i;
      tenYearsDD.push({ value: year.toString(), label: year.toString() });
    }
    setTenYearsDD(tenYearsDD);
  };

  const fetchData = async (sport: string, year: string) => {
    // Check if data for this sport and year is already fetched
    if (bookingsData[sport]?.[year]) {
      return null;
    }

    let data = {
      sport: sport.toUpperCase(),
      year: year,
    };
    const response = await FetchMyBookings(data);

    if (response.data.msgCode == "200") {
      setBookingsData((prevData) => ({
        ...prevData,
        [sport]: {
          ...(prevData[sport] || {}),
          [year]: response.data.data,
        },
      }));
    }
  };

  const showSelectedYearData = () => {
    const sportData = bookingsData[selectedTab.name];
    if (sportData && sportData[selectedDate]) {
      const data = sportData[selectedDate];
      let filterWithMonth;
      if (data.sessions) {
        filterWithMonth = data.sessions.filter((item) => {
          const dateParts = item.date.split("/");
          if (dateParts[1] == selectedMonth) {
            return true;
          }
        });
      }

      return filterWithMonth;
    } else {
      return [];
    }
  };

  const bookingFilterPopup = useRef<BookingFilterPopupRef>(null);
  return (
    <View style={styles.screenContainer}>
      <GeneralHeader title={"My Bookings"} sport={selectedTab} />
      <BookingFilterPopup reference={bookingFilterPopup} />
      <SelectDropDown
        reference={yearDropdownRef}
        onChangeValue={(value) => {
          setSelectedDate(value.value);
          fetchData(selectedTab?.name, value.value);
        }}
        values={tenyearsDD}
      />
      <SelectDropDown
        reference={monthDropdownRef}
        onChangeValue={(value) => setSelectedMonth(value.value)}
        values={monthsData}
      />

      <ScreenWrapper>
        <View style={styles.tabContainer}>
          {AllSports.map((item) => (
            <TouchableOpacity
              key={item.name}
              activeOpacity={0.6}
              onPress={() => {
                setSelectedTab(item);
                fetchData(item.name, selectedDate); // Fetch data when switching tabs
              }}
            >
              <Text
                style={[
                  styles.heading,
                  selectedTab.name == item.name && {
                    color: colors.green,
                    textDecorationLine: "underline",
                  },
                ]}
              >
                {item.name}
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
            value={moment(selectedMonth, "MM").format("MMM")}
            dropdown={true}
            onPress={() => monthDropdownRef.current?.show()}
          />
        </View>
        <FlatList
          data={showSelectedYearData()}
          ListEmptyComponent={() => (
            <View style={styles.noBookingContainer}>
              <Image source={icons.noBooking} style={styles.noBookingIcon} />
              <Text style={styles.title}>Bookings</Text>
              <Text style={{ textAlign: "center" }}>
                Currently, there are no Bookings available for display. Please
                Check again later
              </Text>
            </View>
          )}
          renderItem={({ item }) => (
            <BookedSlots booking={item} selectedSport={selectedTab?.name} />
          )}
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
