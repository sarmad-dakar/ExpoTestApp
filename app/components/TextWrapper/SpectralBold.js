import { StyleSheet, Text, View } from "react-native";
import React from "react";
import TextWrapper from ".";
import { colors } from "../../utils/theme";
import { useFonts } from "expo-font";

const SpectralBold = (props) => {
  const [fontsLoaded] = useFonts({
    "SpectralSC-Bold": require("../../../assets/fonts/SpectralSC-Bold.ttf"),
  });
  return (
    <TextWrapper {...props} style={[styles.font, props?.style]}>
      {props.children}
    </TextWrapper>
  );
};

export default SpectralBold;

const styles = StyleSheet.create({
  font: {
    fontFamily: "SpectralSC-Bold",
    color: colors.headingColor,
    letterSpacing: -0.2,
    fontSize: 20,
  },
});
