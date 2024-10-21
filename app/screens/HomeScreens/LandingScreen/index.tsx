import {
  ActivityIndicator,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ScreenWrapper from "@/app/components/ScreenWrapper";
import Banner from "@/app/components/Banner";
import SportsCard from "@/app/components/SportsCard";
import { images } from "@/app/MyAssets";
import HomeHeader from "@/app/components/HomeHeader";
import { AllSports } from "@/app/utils/dummyJson";
import HomeHeaderBeta from "@/app/components/HomeHeaderBeta";
import SelectDropDown from "@/app/components/Dropdown";
import AvailableSlots from "@/app/components/AvailableSlots";
import ConfirmationPopup, {
  ConfirmationPopupRef,
} from "@/app/components/ConfirmationPopup";
import { router } from "expo-router";
import BookingCalendar from "@/app/components/BookingCalendar";
import { getMyProfile } from "@/app/api/Auth";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyProfile } from "@/app/store/slices/userSlice";
import { AnyAction, ThunkAction, ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "@/app/store";
import type { AppDispatch } from "@/app/store/index"; // Path to your store.ts
import { FetchCalendarData } from "@/app/api/Bookings";
import moment from "moment";
import { vh, vw } from "@/app/utils/units";
import { colors } from "@/app/utils/theme";
import BookingCalendarVersion2 from "@/app/components/BookingCalendar/BookingCalendarVersion2";
import { fetchCurrentSports } from "@/app/store/slices/bookingSlice";
import { useFocusEffect } from "expo-router";

// Define types for calendar data and booking sessions
interface CalendarData {
  bookingSessions: Array<any>; // You may want to replace `any` with the correct session structure
  timeSlots: Array<string>;
}

interface Sport {
  sportServiceSetting: {
    title: string;
    hasACSetting: boolean;
    hasHalfTimeSetting: boolean;
  };
  bookingSetting: {
    maximumPlayers: number;
    minimumPlayers: number;
  };
  // add other fields as needed
}

export const useAppDispatch: () => AppDispatch = useDispatch;

const LandingScreen = () => {
  const confirmationPopup = useRef<ConfirmationPopupRef>(null);
  const dispatch = useAppDispatch();

  const sports = useSelector((state) => state?.account?.sportsData);
  // Define state with appropriate types
  const [calendarData, setCalendarData] = useState<CalendarData | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [SelectedSport, setSelectedSport] = useState();

  const loader = useSelector((state) => state.general?.generalLoader);
  useEffect(() => {
    // handleNavigation();
    getProfile();
    getSports();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (selectedDate && SelectedSport) {
        getCalendarData(selectedDate, SelectedSport);
      }

      return () => {
        console.log("This route is now unfocused.");
      };
    }, [selectedDate, SelectedSport])
  );

  const getSports = async (): Promise<void> => {
    dispatch(fetchCurrentSports());
  };
  useEffect(() => {
    if (sports?.length) {
      setSelectedSport(sports[0]);
    }
  }, []);

  // useEffect(() => {
  //   if (selectedDate && SelectedSport) {
  //    getCalendarData(selectedDate, SelectedSport);
  //   }
  // }, [selectedDate, SelectedSport]);

  useEffect(() => {
    if (sports?.length) {
      setSelectedSport(sports[0]);
    }
  }, [sports]);

  // Define return type for async function
  const getProfile = async (): Promise<void> => {
    dispatch(fetchMyProfile());
  };

  // Define the type of 'date' as Date and return type as Promise<void>
  const getCalendarData = async (date: Date, sport: Sport): Promise<void> => {
    const formattedDate = moment(date).format("DD-MM-YYYY");
    let data = {
      date: formattedDate,
      sport: sport.sportServiceSetting.title.toLowerCase(),
    };
    console.log(data);
    const response = await FetchCalendarData(data);
    console.log(response.data, "response of calendar");
    if (response && response.data && response.data.data) {
      setCalendarData(response.data.data);
    }
  };

  const onSearchPress = () => {
    getCalendarData(selectedDate, SelectedSport);
  };

  const onAcceptBooking = (data) => {
    confirmationPopup.current?.hide();
    router.push({
      pathname: "/homestack/bookingdetail",
      params: {
        bookingData: JSON.stringify({ ...data, selectedSport: SelectedSport }),
      }, // Use if you have any URL params to send (optional)
      state: {}, // Pass the large object here
    });
    // router.navigate("/homestack/bookingdetail" );
  };

  const onNotificationPress = () => {
    router.navigate("/homestack/notifications");
  };

  const onBookingPress = (court, session) => {
    confirmationPopup.current?.show(court, session, selectedDate);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {sports?.length ? (
        <HomeHeader
          onNotificationPress={onNotificationPress}
          allSports={sports}
          setSelectedDate={setSelectedDate}
          selectedDate={selectedDate}
          onSearchPress={onSearchPress}
          getCalendarData={getCalendarData}
          setSelectedSport={setSelectedSport}
          selectedSport={SelectedSport}
        />
      ) : null}
      {/* <HomeHeaderBeta allSports={AllSports} label={"Tennis Booking"} /> */}
      {/* <ScrollView
        style={{ flex: 1, marginTop: 10 }}
        contentContainerStyle={{
          paddingLeft: 20,
          paddingBottom: calendarData?.timeSlots?.length * 30 || 100,
        }}
      > */}
      <View style={{ flex: 1, padding: 10 }}>
        {calendarData ? (
          <BookingCalendarVersion2
            onBookingPress={onBookingPress}
            data={calendarData}
            date={selectedDate}
          />
        ) : null}
      </View>
      {/* <AvailableSlots handleBooking={handleBooking} /> */}
      {/* </ScrollView> */}
      <ConfirmationPopup
        reference={confirmationPopup}
        onAccept={onAcceptBooking}
      />
      {loader ? (
        <View style={styles.loader}>
          <ActivityIndicator size={"large"} color={colors.secondary} />
        </View>
      ) : null}
    </View>
  );
};

export default LandingScreen;

const styles = StyleSheet.create({
  loader: {
    height: vh * 100,
    width: vw * 100,
    backgroundColor: "#0000004a",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
});
