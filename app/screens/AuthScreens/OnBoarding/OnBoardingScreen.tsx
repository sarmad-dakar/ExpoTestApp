import { Platform, StyleSheet, Text, View } from "react-native";
import React from "react";
import MainButton from "../../../components/MainButton";
import InputField from "../../../components/InputField";
import { icons } from "../../../MyAssets";
import ScreenWrapper from "../../../components/ScreenWrapper";
import LogoHeader from "../../../components/LogoHeader";
import { Link, router, useNavigation } from "expo-router";
import BerlingskeBold from "../../../components/TextWrapper/BerlingskeBold";

const OnBoardingScreen = () => {
  const handleNavigation = () => {
    router.replace("/login");
  };
  return (
    <ScreenWrapper>
      <LogoHeader />
      <BerlingskeBold>"Congratulations" Password Send</BerlingskeBold>

      <InputField icon={icons.idCard} placeholder="username" />
      <InputField
        icon={icons.lock}
        placeholder="password"
        secureTextEntry={true}
      />
      {Platform.OS == "web" ? (
        <MainButton title="Web App Button" onPress={handleNavigation} />
      ) : (
        <MainButton title="App  Button" onPress={handleNavigation} />
      )}
    </ScreenWrapper>
  );
};

export default OnBoardingScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: "3%",
    backgroundColor: "white",
  },
});
