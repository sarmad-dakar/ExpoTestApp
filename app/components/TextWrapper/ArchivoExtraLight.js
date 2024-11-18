import { StyleSheet, Text, View } from "react-native";
import React from "react";
import TextWrapper from ".";
import { colors } from "../../utils/theme";
import { useFonts } from "expo-font";

const ArchivoExtraLight = (props) => {
  const [fontsLoaded] = useFonts({
    "Archivo-ExtraLight": require("../../../assets/fonts/Archivo-ExtraLight.ttf"),
  });
  return (
    <TextWrapper {...props} style={[styles.font, props?.style]}>
      {props.children}
    </TextWrapper>
  );
};

export default ArchivoExtraLight;

const styles = StyleSheet.create({
  font: {
    fontFamily: "Archivo-ExtraLight",
    fontSize: 15,
    lineHeight: 22,
  },
});
