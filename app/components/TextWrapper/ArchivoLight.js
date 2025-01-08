import { StyleSheet, Text, View } from "react-native";
import React from "react";
import TextWrapper from ".";

import { useFonts } from "expo-font";

const ArchivoLight = (props) => {
  const [fontsLoaded] = useFonts({
    "FiraSans-Light": require("../../../assets/fonts/FiraSans-Light.ttf"),
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
    fontFamily: "FiraSans-Light",
    fontSize: 15,
  },
});
