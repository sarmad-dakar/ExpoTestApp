import React, { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

type ScreenWrapperProps = {
  children: ReactNode;
};

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children }) => {
  return <View style={styles.container}>{children}</View>;
};

export default ScreenWrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
    paddingHorizontal: 25,
  },
});
