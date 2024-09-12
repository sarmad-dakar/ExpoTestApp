import React, { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type ScreenWrapperProps = {
  children: ReactNode;
  noPadding: Boolean;
};

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  noPadding,
}) => {
  return (
    <LinearGradient
      colors={["white", "white", "white", "white", "#f4f4f4"]}
      style={[styles.container, noPadding && { paddingHorizontal: 0 }]}
    >
      {children}
    </LinearGradient>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 25,
  },
});
