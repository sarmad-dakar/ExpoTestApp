import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { vh } from "@/app/utils/units";
import { icons } from "@/app/MyAssets";
import ArchivoRegular from "../TextWrapper/ArchivoRegular";

const DropdownField = ({ value, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={onPress}
      style={styles.container}
    >
      <ArchivoRegular style={styles.inputText}>{value}</ArchivoRegular>
      <Image source={icons.dropdown2} style={styles.icon} />
    </TouchableOpacity>
  );
};

export default DropdownField;

const styles = StyleSheet.create({
  container: {
    height: vh * 4.8,
    backgroundColor: "#F0F0F0",
    borderRadius: 5,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: "4%",
    marginVertical: vh * 0.5,
  },
  icon: {
    height: vh * 1.8,
    width: vh * 1.8,
    resizeMode: "contain",
    tintColor: "#5F645D",
  },
  inputText: {
    fontSize: vh * 1.6,
  },
});
