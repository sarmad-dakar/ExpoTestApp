import { StyleSheet, Text, View } from "react-native";
import React from "react";
import TextWrapper from ".";

const BerlingskeDbd = (props) => {
  return (
    <TextWrapper {...props} style={[styles.font, props?.style]}>
      {props.children}
    </TextWrapper>
  );
};

export default BerlingskeDbd;

const styles = StyleSheet.create({
  font: {
    fontFamily: "BerlingskeSerifCn-DBd",
  },
});
