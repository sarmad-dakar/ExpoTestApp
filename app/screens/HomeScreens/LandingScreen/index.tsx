import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useRef } from "react";
import ScreenWrapper from "@/app/components/ScreenWrapper";
import Banner from "@/app/components/Banner";
import SportsCard from "@/app/components/SportsCard";
import { images } from "@/app/MyAssets";
import HomeHeader from "@/app/components/HomeHeader";
import { AllSports } from "@/app/utils/dummyJson";
import HomeHeaderBeta from "@/app/components/HomeHeaderBeta";
import BookingCalendar from "@/app/components/BookingCalendar";
import AvailableSlots from "@/app/components/AvailableSlots";
import ConfirmationPopup, {
  ConfirmationPopupRef,
} from "@/app/components/ConfirmationPopup";
import { router } from "expo-router";

const LandingScreen = () => {
  const confirmationPopup = useRef<ConfirmationPopupRef>(null);

  const handleBooking = () => {
    // router.navigate("/homestack/bookingdetail")
    confirmationPopup.current?.show();
  };

  const onAcceptBooking = () => {
    confirmationPopup.current?.hide();
    router.navigate("/homestack/bookingdetail");
  };

  return (
    <ScreenWrapper noPadding={true}>
      <HomeHeader allSports={AllSports} />
      {/* <HomeHeaderBeta allSports={AllSports} label={"Tennis Booking"} /> */}

      <ScrollView
        style={{ flex: 1, marginTop: 30 }}
        contentContainerStyle={{
          paddingLeft: 20,
          paddingBottom: 200,
        }}
      >
        <BookingCalendar />
        {/* <AvailableSlots handleBooking={handleBooking} /> */}
      </ScrollView>
      <ConfirmationPopup
        reference={confirmationPopup}
        onAccept={onAcceptBooking}
      />
    </ScreenWrapper>
  );
};

export default LandingScreen;

const styles = StyleSheet.create({});
