import { StyleSheet, Text, View } from "react-native";
import React from "react";
import TextWrapper from ".";

import { useFonts } from "expo-font";

const ArchivoExtraLight = (props) => {
  const [fontsLoaded] = useFonts({
    "FiraSans-ExtraLight": require("../../../assets/fonts/FiraSans-ExtraLight.ttf"),
  });
  return (
    <TextWrapper
      key={fontsLoaded ? "loaded" : "loading"}
      {...props}
      style={[styles.font, props?.style]}
    >
      {props.children}
    </TextWrapper>
  );
};

export default ArchivoExtraLight;

const styles = StyleSheet.create({
  font: {
    fontFamily: "FiraSans-ExtraLight",
    fontSize: 15,
    lineHeight: 22,
  },
});
