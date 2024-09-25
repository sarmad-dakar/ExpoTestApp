import {
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect } from "react";
import MainButton from "../../../components/MainButton";
import InputField from "../../../components/InputField";
import { icons, images } from "../../../MyAssets";
import ScreenWrapper from "../../../components/ScreenWrapper";
import LogoHeader from "../../../components/LogoHeader";
import { Link, router, useNavigation } from "expo-router";
import BerlingskeBold from "../../../components/TextWrapper/BerlingskeBold";
import Swiper from "react-native-swiper";
import { colors } from "@/app/utils/theme";
import BerlingskeMedium from "@/app/components/TextWrapper/BerlingskeMedium";
import { useSelector } from "react-redux";

const OnBoardingScreen = () => {
  const user = useSelector((state: any) => state.user.user);

  useEffect(() => {
    console.log(user, "user");
  }, []);

  const handleNavigation = () => {
    // if (user) {
    //   router.replace("/(tabs)");
    //   return;
    // }
    router.replace("/login");
  };
  return (
    <View style={styles.container}>
      <Swiper paginationStyle={{ position: "absolute", bottom: "26%" }}>
        <ImageBackground
          style={{ flex: 1 }}
          source={images.tennis_OB}
          imageStyle={{ width: "100%", height: "100%", resizeMode: "cover" }}
        >
          <View style={styles.bottomContainer}>
            <BerlingskeMedium style={styles.heading}>Tennis</BerlingskeMedium>
            <Text style={styles.subText}>
              The Marsa Sports Club is a multi-sport facility offering an array
              of exciting activities for sports enthusiasts. Whether you’re
              passionate about tennis, golf, cricket, squash, padel, or looking
              to try something new, our club has it all.
            </Text>
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
            <Text style={styles.subText}>
              The Marsa Sports Club is a multi-sport facility offering an array
              of exciting activities for sports enthusiasts. Whether you’re
              passionate about tennis, golf, cricket, squash, padel, or looking
              to try something new, our club has it all.
            </Text>
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
            <Text style={styles.subText}>
              The Marsa Sports Club is a multi-sport facility offering an array
              of exciting activities for sports enthusiasts. Whether you’re
              passionate about tennis, golf, cricket, squash, padel, or looking
              to try something new, our club has it all.
            </Text>
            <MainButton title="Book online" onPress={handleNavigation} />
          </View>
        </ImageBackground>

        <ImageBackground
          style={{ flex: 1 }}
          source={images.cricket_OB}
          imageStyle={{ width: "100%", height: "100%", resizeMode: "cover" }}
        >
          <View style={styles.bottomContainer}>
            <BerlingskeMedium style={styles.heading}>Padel</BerlingskeMedium>
            <Text style={styles.subText}>
              The Marsa Sports Club is a multi-sport facility offering an array
              of exciting activities for sports enthusiasts. Whether you’re
              passionate about tennis, golf, cricket, squash, padel, or looking
              to try something new, our club has it all.
            </Text>
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
    backgroundColor: colors.white,
  },
  bottomContainer: {
    height: 250,
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
});
