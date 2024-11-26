import { StyleSheet, Text, View } from "react-native";
import React from "react";
import TextWrapper from ".";
import { themeColors } from "../../utils/theme";
import { useFonts } from "expo-font";

const ArchivoThin = (props) => {
  const [fontsLoaded] = useFonts({
    "Archivo-Thin": require("../../../assets/fonts/Archivo-Thin.ttf"),
  });
  return (
    <TextWrapper {...props} style={[styles.font, props?.style]}>
      {props.children}
    </TextWrapper>
  );
};

export default ArchivoThin;

const styles = StyleSheet.create({
  font: {
    fontFamily: "Archivo-Thin",
    color: themeColors.headingColor,
    fontSize: 20,
  },
});
