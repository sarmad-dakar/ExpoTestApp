import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useRef, useState } from "react";
import GeneralHeader from "@/app/components/GeneralHeader";
import BerlingskeBold from "@/app/components/TextWrapper/BerlingskeBold";
import BerlingskeMedium from "@/app/components/TextWrapper/BerlingskeMedium";
import InputField from "@/app/components/InputField";
import { icons } from "@/app/MyAssets";
import MainButton from "@/app/components/MainButton";
import AddPlayerModal, {
  addplayerPopupRef,
} from "@/app/components/AddPlayerModal";
import { colors } from "@/app/utils/theme";
import ConfirmationPopup from "@/app/components/ConfirmationPopup";

interface Player {
  id: number;
  name: string;
  score: number;
  isFav: boolean;
}

const BookingDetailScreen = () => {
  const addPlayerPopup = useRef<addplayerPopupRef>(null);
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <GeneralHeader />
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 20, paddingBottom: 100 }}
      >
        <BerlingskeBold style={styles.heading}>
          Booking Payment & Add Players
        </BerlingskeBold>
        <BerlingskeMedium>Session Information</BerlingskeMedium>
        <InputField
          icon={icons.calendar}
          rightIcon={icons.dropdown}
          value="07/07/2024"
        />
        <InputField
          icon={icons.court}
          rightIcon={icons.dropdown}
          value="Court 2"
        />
        <InputField
          icon={icons.clock}
          rightIcon={icons.dropdown}
          value="07:00 AM"
        />
        <MainButton
          onPress={() => addPlayerPopup.current?.show()}
          title="Change"
        />
        <BerlingskeMedium>Booking Types</BerlingskeMedium>
        <InputField
          icon={icons.court}
          rightIcon={icons.dropdown}
          value="Doubles"
        />
        <View style={styles.rowDirection}>
          <BerlingskeMedium>Players</BerlingskeMedium>
          <MainButton
            title="Add Players"
            style={styles.addPlayer}
            onPress={() => addPlayerPopup.current?.show()}
          />
        </View>
        {selectedPlayers.map((item) => (
          <View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <View style={styles.checkbox}>
                <Image
                  source={icons.tick}
                  style={{
                    width: "60%",
                    height: "60%",
                    resizeMode: "contain",
                  }}
                />
              </View>
              <Text style={styles.playerName}>
                {item.name} ({item.score})
              </Text>
            </View>
            <InputField icon={icons.euro} value="Ready To Pay" />
          </View>
        ))}
      </ScrollView>
      <AddPlayerModal
        reference={addPlayerPopup}
        setSelectedPlayers={setSelectedPlayers}
      />
    </View>
  );
};

export default BookingDetailScreen;

const styles = StyleSheet.create({
  heading: {
    marginVertical: 10,
  },
  rowDirection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addPlayer: {
    height: 30,
    width: 100,
  },
  checkbox: {
    height: 17,
    width: 17,
    borderColor: colors.gray,
    borderWidth: 1,
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  playerName: {
    fontSize: 13,
    color: "#3B5049",
  },
});
