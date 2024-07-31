import { Platform, StyleSheet, Text, View } from "react-native";
import React from "react";
import MainButton from "../../../components/MainButton";
import InputField from "../../../components/InputField";
import { icons } from "../../../MyAssets";
import ScreenWrapper from "../../../components/ScreenWrapper";
import LogoHeader from "../../../components/LogoHeader";
import SpectralBold from "../../../components/TextWrapper/SpectralBold";
import { useNavigation } from "expo-router";

const OnBoardingScreen = () => {
  const navigation = useNavigation();
  return (
    <ScreenWrapper>
      <LogoHeader />
      <SpectralBold>"Congratulations" Password Send</SpectralBold>
      <InputField icon={icons.idCard} placeholder="username" />
      <InputField
        icon={icons.lock}
        placeholder="password"
        secureTextEntry={true}
      />
      {Platform.OS == "web" ? (
        <MainButton
          title="Web App Button"
          // onPress={() => navigation.navigate('BottomTabNavigator')}
        />
      ) : (
        <MainButton
          title="App  Button"
          // onPress={() => navigation.navigate('BottomTabNavigator')}
        />
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
