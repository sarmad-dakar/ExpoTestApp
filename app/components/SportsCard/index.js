import { ImageBackground, StyleSheet, Text, View } from "react-native";
import React from "react";
import { vh } from "../../utils/units";
import BerlingskeBold from "../TextWrapper/BerlingskeBold";
import { colors } from "@/app/utils/theme";

const SportsCard = ({ item }) => {
  return (
    <ImageBackground
      source={item.image}
      imageStyle={{ height: "100%", width: "100%", resizeMode: "cover" }}
      style={styles.container}
    >
      <View style={styles.heading}>
        <BerlingskeBold style={{ color: "white" }}>{item.name}</BerlingskeBold>
      </View>
    </ImageBackground>
  );
};

export default SportsCard;

const styles = StyleSheet.create({
  container: {
    height: 160,
    width: "47%",
    backgroundColor: "red",
    borderRadius: 16,
    marginTop: 10,
    justifyContent: "flex-end",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  heading: {
    height: 50,
    backgroundColor: "#2a2f28ba",
    justifyContent: "center",
    alignItems: "center",
  },
});
