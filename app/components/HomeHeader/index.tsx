import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { colors } from "@/app/utils/theme";
import { vh } from "@/app/utils/units";

const HomeHeader = () => {
  return <View style={styles.container}></View>;
};

export default HomeHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    height: vh * 20,
    marginBottom: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
});
