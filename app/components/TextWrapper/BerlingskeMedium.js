import { StyleSheet, Text, View } from "react-native";
import React from "react";
import TextWrapper from ".";
import { useFonts } from "expo-font";
import { vh } from "@/app/utils/units";
import { themeColors } from "@/app/utils/theme";

const BerlingskeMedium = (props) => {
  const [fontsLoaded] = useFonts({
    "FiraSans-Medium": require("../../../assets/fonts/FiraSans-Medium.ttf"),
  });
  return (
    <TextWrapper
      {...props}
      key={fontsLoaded ? "loaded" : "loading"}
      style={[styles.font, props?.style]}
    >
      {props.children}
    </TextWrapper>
  );
};

export default BerlingskeMedium;

const styles = StyleSheet.create({
  font: {
    fontFamily: "FiraSans-Medium",
    color: themeColors.headingColor,
    // letterSpacing: -0.2,
    fontSize: vh * 2.4,
  },
});
