import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { vh, vw } from "@/app/utils/units";
import { icons } from "@/app/MyAssets";
import ArchivoMedium from "../TextWrapper/ArchivoMedium";

const SwitchClubsDD = ({ clubs, handleClubPress }) => {
  const [isVisible, setVisible] = useState(false);

  // Shared value for dropdown height animation
  const dropdownHeight = useSharedValue(0);

  // Animation for dropdown style
  const animatedStyle = useAnimatedStyle(() => ({
    height: withTiming(dropdownHeight.value, { duration: 300 }),
    opacity: withTiming(isVisible ? 1 : 0, { duration: 300 }),
  }));

  const toggleDropdown = () => {
    setVisible(!isVisible);
    dropdownHeight.value = isVisible ? 0 : clubs?.length * (vh * 5 + 5); // Height calculation
  };

  return (
    <View style={{ marginBottom: vh * 1 }}>
      <TouchableOpacity onPress={toggleDropdown} style={styles.container}>
        <View style={styles.col1}>
          <Image source={icons?.exchange} style={styles.icon} />
          <ArchivoMedium style={styles.value}>Switch Club</ArchivoMedium>
        </View>
        <Image source={icons.verticalDropdown} style={styles.icon} />
      </TouchableOpacity>

      <Animated.View style={[styles.dropdown]}>
        {clubs?.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              setVisible(false);
              dropdownHeight.value = 0; // Collapse animation
              handleClubPress(item);
            }}
            style={styles.dropdownField}
          >
            <View style={styles.col1}>
              <Image
                source={
                  item?.title === "All Clubs"
                    ? item.smallLogo
                    : { uri: item?.smallLogo }
                }
                style={styles.icon}
              />
              <ArchivoMedium style={styles.value}>{item?.title}</ArchivoMedium>
            </View>
          </TouchableOpacity>
        ))}
      </Animated.View>
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
    overflow: "hidden", // Ensures content stays within the animated height

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
