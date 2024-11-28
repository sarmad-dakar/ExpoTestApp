import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { icons, images } from "../../MyAssets";
import { vh } from "../../utils/units";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";

const LogoHeader = () => {
  const store = useSelector((state: RootState) => state.general.clubConfig);

  return (
    <View style={styles.container}>
      <Image source={{ uri: store?.logo }} style={styles.logo} />
    </View>
  );
};

export default LogoHeader;

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
  },
  logo: {
    width: vh * 20,
    height: vh * 20,
    resizeMode: "contain",
  },
});
