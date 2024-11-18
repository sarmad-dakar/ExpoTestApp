import { StyleSheet, Text, View } from "react-native";
import React from "react";
import TextWrapper from ".";
import { colors } from "../../utils/theme";
import { useFonts } from "expo-font";

const ArchivoLight = (props) => {
  const [fontsLoaded] = useFonts({
    "Archivo-Light": require("../../../assets/fonts/Archivo-Light.ttf"),
  });
  return (
    <TextWrapper {...props} style={[styles.font, props?.style]}>
      {props.children}
    </TextWrapper>
  );
};

export default ArchivoLight;

const styles = StyleSheet.create({
  font: {
    fontFamily: "Archivo-Light",
    fontSize: 15,
  },
});
