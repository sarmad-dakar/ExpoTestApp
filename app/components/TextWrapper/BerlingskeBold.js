import { StyleSheet, Text, View } from "react-native";
import React from "react";
import TextWrapper from ".";
import { colors } from "../../utils/theme";
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
    color: colors.headingColor,
    fontSize: 20,
  },
});
