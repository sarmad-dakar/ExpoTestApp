import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { images } from "../../MyAssets/index";
import { vh, vw } from "../../utils/units";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

const LoaderComponent = () => {
  const offset = useSharedValue(1);
  const animatedStyles = useAnimatedStyle(() => ({
    // transform: [{ scale: offset.value }],
    opacity: offset.value,
  }));

  React.useEffect(() => {
    offset.value = withRepeat(withTiming(0.3, { duration: 1000 }), -1, true);
    // Cleanup function to clear the timeout if the component unmounts or if token changes
  }, []);

  return (
    <Animated.View exiting={FadeOut.duration(400)} style={styles.container}>
      <LinearGradient
        style={{
          height: vh * 100,
          width: vw * 100,
          justifyContent: "center",
          alignItems: "center",
        }}
        colors={["#00000069", "#ffffff73", "white", "#ffffff73", "#00000069"]}
      >
        <Animated.Image
          source={images.dakarLogo}
          style={[styles.logo, animatedStyles]}
        />
      </LinearGradient>
    </Animated.View>
  );
};

export default LoaderComponent;

const styles = StyleSheet.create({
  container: {
    height: vh * 100,
    width: vw * 100,
    position: "absolute",
    zIndex: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: vh * 20,
    height: vh * 20,
    resizeMode: "contain",
  },
});
