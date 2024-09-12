import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { icons } from "@/app/MyAssets";
import { colors } from "@/app/utils/theme";
import { vh } from "@/app/utils/units";
import BerlingskeMedium from "../TextWrapper/BerlingskeMedium";

type headerProps = {
  title?: string;
};

const GeneralHeader = ({ title }: headerProps) => {
  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center", width: 60 }}>
        <Image
          source={icons.tennis}
          style={[styles.logo, { tintColor: colors.secondary }]}
        />
        <Text style={[styles.selectedSport, { color: colors.secondary }]}>
          {"Tennis"}
        </Text>
      </View>
      <BerlingskeMedium style={styles.selectedSport}>{title}</BerlingskeMedium>
      <View style={{ width: 60 }}></View>
    </View>
  );
};

export default GeneralHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    height: vh * 13,
    borderBottomRightRadius: 40,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: {
    height: 30,
    width: 30,
    resizeMode: "contain",
    tintColor: colors.white,
  },
  selectedSport: {
    color: "white",
  },
});
