import {
  Image,
  ImageProps,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { icons } from "@/app/MyAssets";
import { colors } from "@/app/utils/theme";
import { vh } from "@/app/utils/units";
import BerlingskeMedium from "../TextWrapper/BerlingskeMedium";
import { router } from "expo-router";

type headerProps = {
  title: string;
  back?: boolean;
  sport?: {
    name: string;
    icon: ImageProps;
  };
};

const GeneralHeader = ({ title, back, sport }: headerProps) => {
  return (
    <View style={styles.container}>
      {back ? (
        <TouchableOpacity onPress={() => router.back()}>
          <Image source={icons.back} style={styles.backIcon} />
        </TouchableOpacity>
      ) : (
        <View style={{ alignItems: "center", width: 60 }}>
          <Image
            source={sport?.icon || icons.tennis}
            style={[styles.logo, { tintColor: colors.secondary }]}
          />
          <Text style={[styles.selectedSport, { color: colors.secondary }]}>
            {sport?.name || "Tennis"}
          </Text>
        </View>
      )}
      <BerlingskeMedium style={styles.selectedSport}>{title}</BerlingskeMedium>
      <View style={{ width: back ? 22 : 60 }}></View>
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
  backIcon: {
    height: 22,
    width: 22,
    resizeMode: "contain",
    tintColor: "white",
  },
});
