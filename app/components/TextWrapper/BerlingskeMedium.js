import { StyleSheet, Text, View } from "react-native";
import React from "react";
import TextWrapper from ".";

const BerlingskeMedium = (props) => {
  return (
    <TextWrapper {...props} style={[styles.font, props?.style]}>
      {props.children}
    </TextWrapper>
  );
};

export default BerlingskeMedium;

const styles = StyleSheet.create({
  font: {
    fontFamily: "BerlingskeSerifCn-Md",
  },
});
