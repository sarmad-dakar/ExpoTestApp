import { StyleSheet, Text, View } from "react-native";
import React from "react";
import TextWrapper from ".";
import { colors } from "../../utils/theme";
import { useFonts } from "expo-font";

const ArchivoMedium = (props) => {
  const [fontsLoaded] = useFonts({
    "Archivo-Medium": require("../../../assets/fonts/Archivo-Medium.ttf"),
  });
  return (
    <TextWrapper {...props} style={[styles.font, props?.style]}>
      {props.children}
    </TextWrapper>
  );
};

export default ArchivoMedium;

const styles = StyleSheet.create({
  font: {
    fontFamily: "Archivo-Medium",
    color: colors.headingColor,
    fontSize: 20,
  },
});
