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
import { CancelBooking, FetchMyBookings } from "@/app/api/Bookings";
import SelectDropDown, { SelectDropdownRef } from "@/app/components/Dropdown";
import { AllSports } from "@/app/utils/dummyJson";
import BookingConfirmationPopup from "@/app/components/BookingConfirmationPopup";
import { ConfirmationPopupRef } from "@/app/components/ConfirmationPopup";
import { useSelector } from "react-redux";
import { router } from "expo-router";

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

const sportsIcon = {
  tennis: icons.tennis,
  squash: icons.squash,
  padel: icons.padel,
  snooker: icons.snooker,
  cricket: icons.cricket,
};

interface Session {
  time: string;
  description: string;
  date: string;
  bookingKey: string;
}

interface Booking {
  sessions: Session[];
  bookingCount: string;
  bookingAmount: string;
  bookingPayByMe: string;
}

interface BookingsData {
  [sport: string]: {
    [year: string]: Booking;
  };
}

interface SportItem {
  name: string;
  icon: any;
}

const MyBookingsScreen: React.FC = () => {
  const tabs = ["Tennis", "Squash", "Padel", "Cricket"];
  const [allSports, setAllSports] = useState<SportItem[]>([]);
  const [selectedTab, setSelectedTab] = useState<SportItem>(AllSports[0]);
  const sports = useSelector((state: any) => state?.account?.sportsData);

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
  const [selectedBooking, setSelectedBooking] = useState<Session | null>(null);
  const yearDropdownRef = useRef<SelectDropdownRef>(null);
  const monthDropdownRef = useRef<SelectDropdownRef>(null);
  const bookingConfirmationRef = useRef<ConfirmationPopupRef>(null);

  useEffect(() => {
    if (selectedTab) {
      fetchData(selectedTab?.name, selectedDate);
    }
  }, [selectedTab, selectedDate]);

  useEffect(() => {
    generateTenYearsArray();
  }, []);

  useEffect(() => {
    console.log(sports, "sports of data");
    if (sports) {
      const data = sports.map((item: { key: string }) => {
        const sportKey = item.key.toLowerCase() as keyof typeof sportsIcon; // Ensure it's a valid key
        return {
          name: item.key,
          icon: sportsIcon[sportKey], // Provide fallback in case key is invalid
        };
      });
      setAllSports(data);
    }
  }, [sports]);

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
    if (bookingsData[sport]?.[year]) {
      return null;
    }

    const data = {
      sport: sport.toUpperCase(),
      year: year,
    };
    const response = await FetchMyBookings(data);

    if (response.data.msgCode === "200") {
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
      return (
        data.sessions?.filter((item) => {
          const dateParts = item.date.split("/");
          return dateParts[1] === selectedMonth;
        }) || []
      );
    } else {
      return [];
    }
  };

  const onCancelBookingPress = (item: Session) => {
    setSelectedBooking(item);
    bookingConfirmationRef.current?.show();
  };

  const onConfirmedCancel = async (pin: string) => {
    const data = {
      key: selectedBooking?.bookingKey,
      pin: pin,
      section: selectedTab?.name,
    };
    const response = await CancelBooking(data);
    if (response.data.msgCode === "200") {
      fetchData(selectedTab.name, selectedDate);
    }
    console.log(response.data, "response of cancel");
  };

  const onDetailViewPress = (booking: any) => {
    console.log(booking?.bookingKey, "data");
    let data = {
      id: booking?.bookingKey,
      sport: selectedTab.name.toUpperCase(),
    };
    router.push({
      pathname: "/bookingstack/alreadybookeddetail",
      params: {
        bookingData: JSON.stringify(data),
      }, // Use if you have any URL params to send (optional)
    });
  };

  const bookingFilterPopup = useRef<BookingFilterPopupRef>(null);
  return (
    <View style={styles.screenContainer}>
      <GeneralHeader title={"My Bookings"} sport={selectedTab} />
      <BookingFilterPopup reference={bookingFilterPopup} />
      <SelectDropDown
        reference={yearDropdownRef}
        onChangeValue={(value: any) => {
          setSelectedDate(value.value);
          fetchData(selectedTab?.name, value.value);
        }}
        values={tenyearsDD}
      />
      <SelectDropDown
        reference={monthDropdownRef}
        onChangeValue={(value: any) => setSelectedMonth(value.value)}
        values={monthsData}
      />

      <ScreenWrapper>
        <View style={styles.tabContainer}>
          {allSports.map((item) => (
            <TouchableOpacity
              key={item.name}
              activeOpacity={0.6}
              onPress={() => {
                setSelectedTab(item);
                fetchData(item.name, selectedDate);
              }}
            >
              <Text
                style={[
                  styles.heading,
                  selectedTab.name === item.name && {
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
            <BookedSlots
              booking={item}
              selectedSport={selectedTab?.name}
              setSelectedBooking={onCancelBookingPress}
              onDetailViewPress={onDetailViewPress}
            />
          )}
        />
      </ScreenWrapper>

      <BookingConfirmationPopup
        reference={bookingConfirmationRef}
        onAccept={onConfirmedCancel}
      />
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
