import { StyleSheet, Text, View } from "react-native";
import React from "react";
import TextWrapper from ".";
import { useFonts } from "expo-font";
import { vh } from "@/app/utils/units";
import { colors } from "@/app/utils/theme";

const BerlingskeMedium = (props) => {
  const [fontsLoaded] = useFonts({
    "BerlingskeSerifCn-Md": require("../../../assets/fonts/BerlingskeSerifCn-Md.ttf"),
  });
  return (
    <TextWrapper {...props} style={[styles.font, props?.style]}>
      {props.children}
    </TextWrapper>
  );
};

export default BerlingskeMedium;

const styles = StyleSheet.create({
  font: {
    fontFamily: "BerlingskeSerifCn-Md",
    color: colors.headingColor,
    // letterSpacing: -0.2,
    fontSize: vh * 2.4,
  },
});
