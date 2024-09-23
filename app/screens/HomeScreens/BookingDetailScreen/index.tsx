import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
import { ConfirmationPopupRef } from "@/app/components/ConfirmationPopup";
import SelectDropDown from "@/app/components/Dropdown";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import moment from "moment";

interface Player {
  id: number;
  name: string;
  score: number;
  isFav: boolean;
}

const bookingTypeDD = [
  { value: "single", label: "Single" },
  { value: "double", label: "Doubles" },
];

const courtsDD = [
  { value: "court 1", label: "Court 1" },
  { value: "court 2", label: "Court 2" },
  { value: "court 3", label: "Court 3" },
];

const BookingDetailScreen = () => {
  const addPlayerPopup = useRef<addplayerPopupRef>(null);
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [checkedPlayers, setCheckedPlayers] = useState<Player[]>([]);
  const [bookingType, setBookingType] = useState(bookingTypeDD[0]);
  const [courts, setCourts] = useState(courtsDD[0]);

  const dropdownRef = useRef<ConfirmationPopupRef>(null);
  const courtsDropdownRef = useRef<ConfirmationPopupRef>(null);

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("10:00 AM");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false); // Close the picker
    setDate(currentDate);
  };

  const onChangeTime = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setTime(moment(selectedDate).format("hh:mm A"));
    setShowTimePicker(false);
  };

  const handleCheckPlayers = (player: Player) => {
    const isExist = checkedPlayers.find((item) => item.id == player.id);
    if (isExist) {
      return true;
    } else {
      return false;
    }
  };

  const handleAddPlayer = (player: Player) => {
    const isAlreadyAdded = checkedPlayers.find((item) => item.id == player.id);
    if (isAlreadyAdded) {
      const removePlayers = checkedPlayers.filter(
        (item) => item.id !== player.id
      );
      setCheckedPlayers(removePlayers);
    } else {
      setCheckedPlayers([...checkedPlayers, player]);
    }
  };

  const handleRemovePlayers = (player: Player) => {
    const removedPlayers = selectedPlayers.filter(
      (item) => item.id !== player.id
    );
    setSelectedPlayers(removedPlayers);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <GeneralHeader title="Booking Detail" />
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={date}
          mode="time"
          display="default"
          onChange={onChangeTime}
        />
      )}

      <ScrollView
        contentContainerStyle={{ paddingBottom: 50 }}
        style={{ flex: 1, paddingHorizontal: 20 }}
      >
        <BerlingskeBold style={styles.heading}>
          Booking Payment & Add Players
        </BerlingskeBold>
        <BerlingskeMedium>Session Information</BerlingskeMedium>
        <InputField
          icon={icons.calendar}
          rightIcon={icons.dropdown}
          value={moment(date).format("MM/DD/YY")}
          dropdown={true}
          onPress={() => setShowDatePicker(true)}
        />
        <InputField
          icon={icons.court}
          rightIcon={icons.dropdown}
          value={courts.value}
          dropdown={true}
          onPress={() => courtsDropdownRef.current?.show()}
        />
        <InputField
          icon={icons.clock}
          rightIcon={icons.dropdown}
          value={time}
          dropdown={true}
          onPress={() => setShowTimePicker(true)}
        />
        <MainButton
          onPress={() => addPlayerPopup.current?.show()}
          title="Change"
        />
        <BerlingskeMedium>Booking Types</BerlingskeMedium>
        <InputField
          icon={icons.court}
          rightIcon={icons.dropdown}
          value={bookingType.value}
          // editable={false}
          dropdown={true}
          onPress={() => dropdownRef.current?.show()}
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
              <TouchableOpacity
                onPress={() => handleAddPlayer(item)}
                style={styles.checkbox}
              >
                {handleCheckPlayers(item) && (
                  <Image
                    source={icons.tick}
                    style={{
                      width: "60%",
                      height: "60%",
                      resizeMode: "contain",
                    }}
                  />
                )}
              </TouchableOpacity>
              <Text style={styles.playerName}>
                {item.name} ({item.score})
              </Text>
            </View>
            {handleCheckPlayers(item) && (
              <InputField icon={icons.euro} value="Ready To Pay" />
            )}
          </View>
        ))}
        <MainButton title="BOOK" />
        <BerlingskeMedium style={styles.heading}>
          Remove Players
        </BerlingskeMedium>
        {selectedPlayers.map((item) => {
          return (
            <View style={styles.removePlayerContainer}>
              <Text>
                {item.name} ({item.score})
              </Text>
              <TouchableOpacity onPress={() => handleRemovePlayers(item)}>
                <Image source={icons.cross} style={styles.icon} />
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
      <AddPlayerModal
        reference={addPlayerPopup}
        selectedPlayers={selectedPlayers}
        setSelectedPlayers={setSelectedPlayers}
      />
      <SelectDropDown
        reference={dropdownRef}
        onChangeValue={setBookingType}
        values={bookingTypeDD}
      />
      <SelectDropDown
        reference={courtsDropdownRef}
        onChangeValue={setCourts}
        values={courtsDD}
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
  removePlayerContainer: {
    height: 40,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
    backgroundColor: colors.lightGray,
    borderRadius: 10,
    marginBottom: 5,
  },
  icon: {
    height: 20,
    width: 20,
    resizeMode: "contain",
  },
});
