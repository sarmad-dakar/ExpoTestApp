import {
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import MainButton from "../../../components/MainButton";
import InputField from "../../../components/InputField";
import { icons, images } from "../../../MyAssets";
import ScreenWrapper from "../../../components/ScreenWrapper";
import LogoHeader from "../../../components/LogoHeader";
import { Link, router, useNavigation } from "expo-router";
import ArchivoLight from "../../../components/TextWrapper/ArchivoLight";
import ArchivoExtraLight from "../../../components/TextWrapper/ArchivoExtraLight";

import Swiper from "react-native-swiper";
import { themeColors } from "@/app/utils/theme";
import BerlingskeMedium from "@/app/components/TextWrapper/BerlingskeMedium";
import { useSelector } from "react-redux";
import { fetchCurrentSports } from "@/app/store/slices/bookingSlice";
import { useAppDispatch } from "../../HomeScreens/LandingScreen";
import { skipIntro } from "@/app/store/slices/generalSlice";
import { RootState } from "@/app/store";
import { useTheme } from "@react-navigation/native";

const OnBoardingScreen = () => {
  const user = useSelector((state: any) => state.user.user);
  const loading = useSelector(
    (state: RootState) => state.general.generalLoader
  );
  const dispatch = useAppDispatch();
    const {colors} = useTheme()
    console.log(colors,  "colors")

  const handleNavigation = () => {
    dispatch(skipIntro(null));
    router.push("/clublisting");
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipContainer} onPress={handleNavigation}>
        <BerlingskeMedium style={styles.skipBtn}>Skip</BerlingskeMedium>
      </TouchableOpacity>
      <Swiper
        activeDotColor="#D4CDC5"
        dotColor="#0B0C0F"
        activeDotStyle={{ height: 12, width: 12, borderRadius: 100 }}
        paginationStyle={{ position: "absolute", bottom: 220 }}
      >
        <ImageBackground
          style={{ flex: 1 }}
          source={images.tennis_OB}
          imageStyle={{ width: "100%", height: "100%", resizeMode: "cover" }}
        >
          <View style={styles.bottomContainer}>
            <BerlingskeMedium style={styles.heading}>Tennis</BerlingskeMedium>
            <ArchivoExtraLight style={styles.subText}>
              The Marsa Sports Club is a multi-sport facility offering an array
              of exciting activities for sports enthusiasts. Whether you’re
              passionate about tennis, golf, cricket, squash, padel, or looking
              to try something new, our club has it all.
            </ArchivoExtraLight>
            <MainButton title="Book online" onPress={handleNavigation} />
          </View>
        </ImageBackground>

        <ImageBackground
          style={{ flex: 1 }}
          source={images.squash_OB}
          imageStyle={{ width: "100%", height: "100%", resizeMode: "cover" }}
        >
          <View style={styles.bottomContainer}>
            <BerlingskeMedium style={styles.heading}>Squash</BerlingskeMedium>
            <ArchivoExtraLight style={styles.subText}>
              The Marsa Sports Club is a multi-sport facility offering an array
              of exciting activities for sports enthusiasts. Whether you’re
              passionate about tennis, golf, cricket, squash, padel, or looking
              to try something new, our club has it all.
            </ArchivoExtraLight>
            <MainButton title="Book online" onPress={handleNavigation} />
          </View>
        </ImageBackground>

        <ImageBackground
          style={{ flex: 1 }}
          source={images.padel_OB}
          imageStyle={{ width: "100%", height: "100%", resizeMode: "cover" }}
        >
          <View style={styles.bottomContainer}>
            <BerlingskeMedium style={styles.heading}>Padel</BerlingskeMedium>
            <ArchivoExtraLight style={styles.subText}>
              The Marsa Sports Club is a multi-sport facility offering an array
              of exciting activities for sports enthusiasts. Whether you’re
              passionate about tennis, golf, cricket, squash, padel, or looking
              to try something new, our club has it all.
            </ArchivoExtraLight>
            <MainButton title="Book online" onPress={handleNavigation} />
          </View>
        </ImageBackground>

        <ImageBackground
          style={{ flex: 1 }}
          source={images.cricket_OB}
          imageStyle={{ width: "100%", height: "100%", resizeMode: "cover" }}
        >
          <View style={styles.bottomContainer}>
            <BerlingskeMedium style={styles.heading}>Cricket</BerlingskeMedium>
            <ArchivoExtraLight style={styles.subText}>
              The Marsa Sports Club is a multi-sport facility offering an array
              of exciting activities for sports enthusiasts. Whether you’re
              passionate about tennis, golf, cricket, squash, padel, or looking
              to try something new, our club has it all.
            </ArchivoExtraLight>
            <MainButton title="Book online" onPress={handleNavigation} />
          </View>
        </ImageBackground>
      </Swiper>
    </View>
  );
};

export default OnBoardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.white,
  },
  bottomContainer: {
    height: 260,
    width: "100%",
    borderTopLeftRadius: 40,
    backgroundColor: "white",
    position: "absolute",
    bottom: 0,
    zIndex: 100,
    // justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  heading: {
    fontSize: 30,
  },
  subText: {
    textAlign: "center",
  },
  skipBtn: {
    color: "white",
  },
  skipContainer: {
    top: 50,
    right: 20,
    position: "absolute",
    zIndex: 100,
  },
});
