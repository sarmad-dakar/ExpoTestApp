import { StyleSheet, Text, View } from "react-native";
import React from "react";
import TextWrapper from ".";
import { themeColors } from "../../utils/theme";
import { useFonts } from "expo-font";
import { vh } from "@/app/utils/units";

const BerlingskeRegular = (props) => {
  const [fontsLoaded] = useFonts({
    "BerlingskeSerifCn-Regular": require("../../../assets/fonts/BerlingskeSerifCn-Regular.ttf"),
  });
  return (
    <TextWrapper {...props} style={[styles.font, props?.style]}>
      {props.children}
    </TextWrapper>
  );
};

export default BerlingskeRegular;

const styles = StyleSheet.create({
  font: {
    fontFamily: "BerlingskeSerifCn-Regular",
    color: themeColors.headingColor,
    letterSpacing: -0.2,
    fontSize: vh * 2.4,
  },
});
