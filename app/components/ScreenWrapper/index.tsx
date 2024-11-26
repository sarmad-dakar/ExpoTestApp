import React, { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { vw } from "@/app/utils/units";

type ScreenWrapperProps = {
  children: ReactNode;
  noPadding?: Boolean;
  hideShadow?: Boolean;
};

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  noPadding,
  hideShadow,
}) => {
  return hideShadow ? (
    <View style={[styles.container, noPadding && { paddingHorizontal: 0 }]}>
      {children}
    </View>
  ) : (
    <View
      style={[
        styles.container,
        { flex: 1 },
        noPadding && { paddingHorizontal: 0 },
      ]}
    >
      {children}
      <LinearGradient
        colors={["white", "white", "#f4f4f4", "#e6e6e6"]}
        style={[styles.shadowContainer]}
      ></LinearGradient>
    </View>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 25,
  },
  shadowContainer: {
    height: "4%",
    width: vw * 100,
    position: "absolute",
    zIndex: 100,
    bottom: -1,
  },
});
