import { StyleSheet, Text, View } from "react-native";
import React from "react";

const BannerBackground = () => {
  return (
    <View style={styles.container}>
      <View style={styles.shape} />
    </View>
  );
};

export default BannerBackground;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a", // Dark background
    justifyContent: "center",
    alignItems: "center",
  },
  shape: {
    width: 100,
    height: 100,
    backgroundColor: "#EAC84D", // Yellow color
    borderTopLeftRadius: 50, // Rounded top-left
    transform: [{ skewX: "-25deg" }], // Skew to match the design
  },
});
