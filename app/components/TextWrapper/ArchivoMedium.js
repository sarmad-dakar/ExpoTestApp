import { StyleSheet, Text, View } from "react-native";
import React from "react";
import TextWrapper from ".";
import { themeColors } from "../../utils/theme";
import { useFonts } from "expo-font";

const ArchivoMedium = (props) => {
  const [fontsLoaded] = useFonts({
    "FiraSans-Medium": require("../../../assets/fonts/FiraSans-Medium.ttf"),
  });
  return (
    <TextWrapper
      key={fontsLoaded ? "loaded" : "loading"}
      {...props}
      style={[styles.font, props?.style]}
    >
      {props.children}
    </TextWrapper>
  );
};

export default ArchivoMedium;

const styles = StyleSheet.create({
  font: {
    fontFamily: "FiraSans-Medium",
    color: themeColors.headingColor,
    fontSize: 20,
  },
});
