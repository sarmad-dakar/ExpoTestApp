import { Easing, ImageBackground, StyleSheet, Text, View } from "react-native";
import React from "react";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { themeColors } from "../../../utils/theme";
import { vh } from "../../../utils/units";
import { useDispatch, useSelector } from "react-redux";
import { toggleBtnLoader } from "../../../store/slices/generalSlice";
import { images } from "../../../MyAssets/index";
import { router } from "expo-router";
import { setBaseURL } from "@/app/api";
const SplashScreen = ({ navigation }) => {
  const offset = useSharedValue(1);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  const club = useSelector((state) => state.general.clubConfig);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ scale: offset.value }],
  }));
  React.useEffect(() => {
    let validatingTimeout;
    console.log(club, "selected Club");

    const checkTokenAndNavigate = async () => {
      offset.value = withRepeat(withTiming(0.5, { duration: 2000 }), -1, true);
      console.log(validatingTimeout, "timeout");
      if (validatingTimeout) {
        clearTimeout(validatingTimeout);
      }

      validatingTimeout = setTimeout(() => {
        if (token) {
          setBaseURL(club?.apiURL);
          router.push("/(tabs)");
        } else {
          if (!club?.appURL) {
            router.push("/clublisting");
          }
        }
      }, 2000);
    };

    checkTokenAndNavigate();

    // Cleanup function to clear the timeout if the component unmounts or if token changes
    return () => {
      if (validatingTimeout) {
        clearTimeout(validatingTimeout);
      }
    };
  }, [token, club]);

  return (
    <Animated.View entering={FadeIn} style={styles.container}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
        }}
      >
        <Animated.Image
          source={images.dakarLogo}
          style={[styles.logo, animatedStyles]}
        />
      </View>
    </Animated.View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.primary,
  },
  logo: {
    width: vh * 20,
    height: vh * 20,
    resizeMode: "contain",
  },
});
