import { StyleSheet, Text, View } from "react-native";
import React from "react";
import ScreenWrapper from "@/app/components/ScreenWrapper";
import Banner from "@/app/components/Banner";
import SportsCard from "@/app/components/SportsCard";
import { images } from "@/app/MyAssets";
import HomeHeader from "@/app/components/HomeHeader";

const allSports = [
  {
    name: "Tennis",
    image: images.tennis,
  },
  {
    name: "Squash",
    image: images.squash,
  },
  {
    name: "Padel",
    image: images.padel,
  },
  {
    name: "Cricket",
    image: images.cricket,
  },
];

const LandingScreen = () => {
  return (
    <ScreenWrapper noPadding={true}>
      <HomeHeader />
      <Banner />
      <View
        style={{
          flexWrap: "wrap",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        {allSports.map((item) => {
          return <SportsCard item={item} />;
        })}
      </View>
    </ScreenWrapper>
  );
};

export default LandingScreen;

const styles = StyleSheet.create({});
