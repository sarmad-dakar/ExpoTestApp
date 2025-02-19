import { StyleSheet, Text, View } from "react-native";
import React from "react";
import TextWrapper from ".";
import { themeColors } from "../../utils/theme";
import { useFonts } from "expo-font";

const BerlingskeBold = (props) => {
  const [fontsLoaded] = useFonts({
    "FiraSans-Bold": require("../../../assets/fonts/FiraSans-Bold.ttf"),
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

export default BerlingskeBold;

const styles = StyleSheet.create({
  font: {
    fontFamily: "FiraSans-Bold",
    color: themeColors.headingColor,
    fontSize: 20,
  },
});
