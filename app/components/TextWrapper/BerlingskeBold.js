import { StyleSheet, Text, View } from "react-native";
import React from "react";
import TextWrapper from ".";
import { themeColors } from "../../utils/theme";
import { useFonts } from "expo-font";

const BerlingskeBold = (props) => {
  const [fontsLoaded] = useFonts({
    "BerlingskeSerifCn-Bold": require("../../../assets/fonts/BerlingskeSerifCn-Bold.ttf"),
  });
  return (
    <TextWrapper {...props} style={[styles.font, props?.style]}>
      {props.children}
    </TextWrapper>
  );
};

export default BerlingskeBold;

const styles = StyleSheet.create({
  font: {
    fontFamily: "BerlingskeSerifCn-Bold",
    color: themeColors.headingColor,
    fontSize: 20,
  },
});
