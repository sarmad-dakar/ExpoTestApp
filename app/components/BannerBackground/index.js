import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Svg, { Path } from "react-native-svg";
import { vh, vw } from "@/app/utils/units";
import { icons, sportsIcon } from "@/app/MyAssets";
import { themeColors } from "@/app/utils/theme";
import ArchivoMedium from "../TextWrapper/ArchivoMedium";
import ArchivoRegular from "../TextWrapper/ArchivoRegular";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  SlideInDown,
  SlideInUp,
  ZoomIn,
} from "react-native-reanimated";

const BannerBackground = ({ date, court, name, handleSwitch }) => {
  const myicons = {
    cricket: sportsIcon.cricket,
    general: sportsIcon.general,
    padle: sportsIcon.paddle,
    paddle: sportsIcon.paddle,
    padel: sportsIcon.paddle,
    pickleBall: sportsIcon.pickleBall,
    squash: sportsIcon.squash,
    tennis: sportsIcon.tennis,
  };

  const extractIcon = (title) => {
    if (myicons[title]) {
      return myicons[title];
    } else {
      return myicons.general;
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View
        entering={SlideInDown.duration(1000)}
        style={styles.square}
      >
        <Image source={icons.upSplash} style={styles.upSplash} />
        <Image source={icons.downSplash} style={styles.downSplash} />
        <View style={styles.imageContainer}>
          <Image
            source={extractIcon(name?.toLowerCase())}
            style={styles.squareImage}
          />
        </View>
        <View style={styles.dotContainer}>
          <Image
            source={icons.dots}
            style={{ width: "100%", height: "100%", resizeMode: "cover" }}
          />
        </View>
        <Svg
          width={136}
          height={94}
          viewBox="0 0 136 94"
          fill="none"
          // xmlns="http://www.w3.org/2000/svg"
        >
          <Path
            d="M0 54C0 24.1766 24.1766 0 54 0H136L85 94H0V54Z"
            fill="#EACE57"
          />
        </Svg>
      </Animated.View>
      <Animated.View
        entering={SlideInUp.duration(1000)}
        style={styles.rectangleContainer}
      >
        <View style={styles.rectangle}>
          <View
            style={{
              flexDirection: "row",
              // justifyContent: "space-between",
              // paddingRight: vw * 3,
            }}
          >
            <ArchivoMedium style={styles.title}>
              Session Information
            </ArchivoMedium>
            <TouchableOpacity
              onPress={handleSwitch}
              style={styles.whiteContainer}
            >
              <Image source={icons.switchChange} style={styles.switchIcon} />
            </TouchableOpacity>
          </View>
          <View style={styles.rowDirection}>
            <Image source={icons.calendar} style={styles.icon} />
            <ArchivoRegular style={styles.date}>{date}</ArchivoRegular>
          </View>
          <View style={styles.rowDirection}>
            <Image source={icons.court3} style={styles.icon} />
            <ArchivoRegular style={styles.date}>{court}</ArchivoRegular>
          </View>
        </View>
        <Svg
          width={279}
          height={94}
          viewBox="0 0 279 94"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <Path d="M49 0.5H279V94.5H0L49 0.5Z" fill="#E2AD50" />
        </Svg>
      </Animated.View>
    </View>
  );
};

export default BannerBackground;

const styles = StyleSheet.create({
  container: {
    width: "90%",
    alignSelf: "center",
    alignItems: "center",
    flexDirection: "row",
    // marginTop: 10,
    height: vh * 14,
    marginVertical: vh * 1,
    // paddingHorizontal: "5%",
    overflow: "hidden",
    // alignItems: "center",
  },
  shape: {
    width: 100,
    height: 100,
    backgroundColor: "#EAC84D", // Yellow color
    borderTopLeftRadius: 50, // Rounded top-left
    transform: [{ skewX: "-15deg" }], // Skew to match the design
  },
  square: {
    height: 94,
    width: 136,
    zIndex: 100,
    borderTopLeftRadius: 55,
    overflow: "hidden",
    top: -6,

    // transform: [{ rotate: "15deg" }], // Skew to match the design
  },
  dotContainer: {
    height: 120,
    width: 120,
    position: "absolute",
    zIndex: 50,
    transform: [{ rotate: "28deg" }], // Skew to match the design
    left: -20,
    top: -20,
  },

  imageContainer: {
    height: 90,
    width: 116,
    position: "absolute",
    zIndex: 100,
    // top: -35,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "red",
  },
  downSplash: {
    height: 30,
    width: 30,
    resizeMode: "contain",
    position: "absolute",
    bottom: 0,
    left: 5,
    zIndex: 100,
    tintColor: "#0000003d",
  },
  upSplash: {
    height: 30,
    width: 30,
    resizeMode: "contain",
    position: "absolute",
    top: 5,
    right: 30,
    zIndex: 100,
    tintColor: "#0000003d",
  },
  squareImage: {
    height: "78%",
    width: "78%",
    resizeMode: "contain",
    zIndex: 120,
    // top: -30,
    // left: 10,
  },
  rectangleContainer: {
    // width: "50%",
    // flex: 1,
    width: "90%",
    height: 94,
    overflow: "hidden",
    left: -80,
    top: 5,
    flexDirection: "row",
    alignItems: "flex-end",
    // backgroundColor: "red",
  },
  rectangle: {
    zIndex: 50,
    // backgroundColor: "green",
    backgroundColor: "#E2AD50",

    height: "101%",
    width: "90%",
    position: "absolute",
    marginLeft: "5%",
    paddingLeft: 55,
    paddingTop: 10,
    // paddingVertical: "3%",
  },
  title: {
    fontSize: vh * 2,
    color: "white",
  },
  rowDirection: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    height: vh * 2,
    width: vh * 2,
    resizeMode: "contain",
    tintColor: "white",
    marginRight: vw * 1.2,
  },
  date: {
    color: "white",
    fontSize: vh * 1.5,
  },
  whiteContainer: {
    height: vh * 3,
    width: vh * 3,
    borderRadius: 100,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: vw * 7,
  },
  switchIcon: {
    width: "80%",
    height: "80%",
    resizeMode: "contain",
  },
});
