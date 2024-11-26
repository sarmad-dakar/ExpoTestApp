import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import BerlingskeBold from "../TextWrapper/BerlingskeBold";
import { themeColors } from "@/app/utils/theme";
import { icons } from "@/app/MyAssets";
import MainButton from "../MainButton";
import { router } from "expo-router";

type availableSlotsProp = {
  handleBooking: () => void;
};

const AvailableSlots = ({ handleBooking }: availableSlotsProp) => {
  return (
    <View>
      <BerlingskeBold>Available Slots</BerlingskeBold>

      {[1, 2, 3].map((item) => {
        return (
          <View style={styles.slotContainer}>
            <Image source={icons.court} style={styles.icon} />
            <View>
              <Text>
                Book <Text style={{ fontWeight: "600" }}>Court 2</Text> for
              </Text>
              <Text style={{ fontWeight: "600" }}>7 July 2024 - 06:30 AM</Text>
            </View>
            <MainButton
              onPress={handleBooking}
              title={"Book Now"}
              style={{ width: 120, height: 30 }}
            />
          </View>
        );
      })}
    </View>
  );
};

export default AvailableSlots;

const styles = StyleSheet.create({
  slotContainer: {
    backgroundColor: themeColors.slotBackground,
    borderRadius: 10,
    height: 100,
    width: "95%",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: "2%",
    marginTop: 10,
  },
  icon: {
    height: 40,
    width: 40,
  },
});
