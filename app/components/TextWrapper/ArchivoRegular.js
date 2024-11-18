import { StyleSheet, Text, View } from "react-native";
import React from "react";
import TextWrapper from ".";
import { colors } from "../../utils/theme";
import { useFonts } from "expo-font";

const ArchivoRegular = (props) => {
  const [fontsLoaded] = useFonts({
    "Archivo-Regular": require("../../../assets/fonts/Archivo-Regular.ttf"),
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
    fontFamily: "Archivo-Regular",
    color: colors.headingColor,
    fontSize: 20,
  },
});
