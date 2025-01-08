import { StyleSheet, Text, View } from "react-native";
import React from "react";
import TextWrapper from ".";
import { themeColors } from "../../utils/theme";
import { useFonts } from "expo-font";

const ArchivoRegular = (props) => {
  const [fontsLoaded] = useFonts({
    "FiraSans-Regular": require("../../../assets/fonts/FiraSans-Regular.ttf"),
  });
  return (
    <TextWrapper {...props} style={[styles.font, props?.style]}>
      {props.children}
    </TextWrapper>
  );
};

export default ArchivoRegular;

const styles = StyleSheet.create({
  font: {
    fontFamily: "FiraSans-Regular",
    color: themeColors.headingColor,
    fontSize: 20,
  },
});
