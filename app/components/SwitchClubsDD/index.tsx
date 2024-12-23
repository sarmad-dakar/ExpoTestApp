import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { vh, vw } from "@/app/utils/units";
import { icons } from "@/app/MyAssets";
import ArchivoMedium from "../TextWrapper/ArchivoMedium";

const SwitchClubsDD = () => {
  const [isVisible, setVisible] = useState(false);
  const [dropdownValues, setDropDownValues] = useState([
    { name: "all Clubs" },
    { name: "Marsa Sport Club" },
  ]);

  return (
    <View style={{ marginBottom: 20 }}>
      <TouchableOpacity
        onPress={() => setVisible(!isVisible)}
        style={styles.container}
      >
        <View style={styles.col1}>
          <Image source={icons?.exchange} style={styles.icon} />
          <ArchivoMedium style={styles.value}>Switch Club</ArchivoMedium>
        </View>
        <Image source={icons.verticalDropdown} style={styles.icon} />
      </TouchableOpacity>
      {isVisible ? (
        <View style={styles.dropdown}>
          {dropdownValues.map((item) => {
            return (
              <TouchableOpacity style={styles.dropdownField}>
                <View style={styles.col1}>
                  <Image source={icons?.back} style={styles.icon} />
                  <ArchivoMedium style={styles.value}>
                    {item?.name}
                  </ArchivoMedium>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : null}
    </View>
  );
};

export default SwitchClubsDD;

const styles = StyleSheet.create({
  container: {
    height: vh * 5,
    borderWidth: 1,
    borderColor: "#0003",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    alignSelf: "center",
    marginVertical: 1,
    borderRadius: 10,
    paddingHorizontal: "3%",
  },
  col1: {
    flexDirection: "row",
    width: "70%",
    alignItems: "center",
  },
  icon: {
    height: vh * 2,
    width: vh * 2,
    resizeMode: "contain",
    marginRight: vw * 2,
  },
  dropdown: {
    backgroundColor: "white",
    width: "90%",
    alignSelf: "center",
    borderRadius: 10,
    marginTop: 5,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  dropdownField: {
    height: vh * 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingHorizontal: "3%",
  },
  value: {
    fontSize: vh * 1.7,
  },
});
