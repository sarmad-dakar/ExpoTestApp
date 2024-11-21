import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
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

import SelectDropDown, { SelectDropdownRef } from "@/app/components/Dropdown";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import moment from "moment";
import { router, useRouter, useLocalSearchParams } from "expo-router";
import {
  AddToFavorite,
  CreateBooking,
  FetchAmountDue,
  FetchMembers,
} from "@/app/api/Bookings";
import { useDispatch, useSelector } from "react-redux";
import BookingConfirmationPopup from "@/app/components/BookingConfirmationPopup";
import { ConfirmationPopupRef } from "@/app/components/ConfirmationPopup";
import { fetchRemainingBalance } from "@/app/store/slices/accountSlice";
import { useAppDispatch } from "../LandingScreen";
import { showErrorToast } from "@/app/utils/toastmsg";
import { RootState } from "@/app/store";
import { toggleBtnLoader } from "@/app/store/slices/generalSlice";
import { vh, vw } from "@/app/utils/units";
import ArchivoRegular from "@/app/components/TextWrapper/ArchivoRegular";
interface Player {
  gender: string;
  name: string;
  memberCode: string;
  isFavourite: boolean;
  isChecked: boolean;
}

interface dropdownTypes {
  label?: string;
  value?: string;
  title?: string;
  key?: string;
}

const sportsIcon = {
  tennis: icons.tennis,
  squash: icons.squash,
  padel: icons.padel,
  snooker: icons.snooker,
  cricket: icons.cricket,
};

const BookingDetailScreen = () => {
  const addPlayerPopup = useRef<addplayerPopupRef>(null);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [checkedPlayers, setCheckedPlayers] = useState<Player[]>([]);
  const [bookingType, setBookingType] = useState<dropdownTypes>();
  const [playersAmountData, setPlayersAmountData] = useState();
  console.log(selectedPlayers, "selected Players");
  const LocalParams = useLocalSearchParams().bookingData;
  const bookingData = Array.isArray(LocalParams)
    ? JSON.parse(LocalParams[0])
    : JSON.parse(LocalParams);

  const bookingConfirmationRef = useRef<ConfirmationPopupRef>(null);
  const dropdownRef = useRef<SelectDropdownRef>(null);
  const courtsDropdownRef = useRef<SelectDropdownRef>(null);

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("10:00 AM");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [disableBooking, setDisableBooking] = useState(false);
  const [maximumPlayers, setMaximumPlayers] = useState(0);
  const [halfSession, setHalfSession] = useState(false);
  const [includeAc, setIncludeAc] = useState(false);
  const [enableAddPlayers, setEnableAddPlayers] = useState(true);
  const dispatch = useAppDispatch();
  const user = useSelector((state: any) => state.user.profile);
  const profile = useSelector((state: any) => state.user.user);
  const btnLoader = useSelector((state: RootState) => state.general.btnLoader);
  console.log(checkedPlayers, "checked players");
  useEffect(() => {
    getMembers();
    calculateMaxPlayers();
    if (bookingData) {
      const currentsport =
        bookingData?.selectedSport?.sportServiceSetting?.title?.toLowerCase();
      if (currentsport == "cricket") {
        setEnableAddPlayers(false);
      }
      setBookingType(bookingData.courtDetail.bookingTypes[0]);
    }
  }, []);

  useEffect(() => {
    if (bookingType?.key) {
      getAmountDue([]);
      // sortTheSelectedPlayers();
    }
  }, [bookingType]);

  useEffect(() => {
    if (playersAmountData) {
      validateBookingButton(playersAmountData);
    }
  }, [playersAmountData]);

  const sortTheSelectedPlayers = (givenPlayers: Player[]) => {
    // Sort the players by `isChecked`: true (1) first, then false (0 or undefined)
    const sortedPlayers = [...givenPlayers].sort((a, b) => {
      const aChecked = a.isChecked ? 1 : 0; // Default to 0 if `isChecked` is undefined
      const bChecked = b.isChecked ? 1 : 0; // Default to 0 if `isChecked` is undefined
      return bChecked - aChecked; // Sort true (1) before false (0)
    });

    // Update state with the sorted list
    setSelectedPlayers(sortedPlayers);
    getAmountDue(sortedPlayers);
  };

  const calculateMaxPlayers = () => {
    const maximumPlayers =
      bookingData?.selectedSport?.bookingSetting?.maximumPlayers;
    setMaximumPlayers(maximumPlayers - 1);
  };
  console.log(maximumPlayers, "max");

  const getMembers = async () => {
    let data = {
      sport:
        bookingData?.selectedSport?.sportServiceSetting?.title?.toLowerCase(),
    };

    const response = await FetchMembers(data);
    setAllPlayers(response.data?.data);
  };

  const onDonePress = () => {
    getAmountDue(selectedPlayers);
  };

  const getAmountDue = async (players: Player[]) => {
    let checkedPlayers = players.filter((item) => item.isChecked);
    if (bookingType?.key) {
      try {
        dispatch(toggleBtnLoader(true));
        let data = {
          BookingKey: bookingData?.sessionDetail?.key,
          BookingType: bookingType?.key,
          IsACOn: includeAc ? 1 : 0,
          IsHalfSession: halfSession ? 1 : 0,
          PayerCode: profile?.memberCode,
          PlayerCodes: profile?.memberCode,
          Service:
            bookingData?.selectedSport?.sportServiceSetting.title.toLowerCase(),
        };
        if (checkedPlayers.length) {
          let currentPayers = data.PayerCode;
          checkedPlayers.map((item) => {
            currentPayers += `,${item.memberCode}`;
          });
          data.PayerCode = currentPayers;
        }
        if (players.length) {
          let currentPlayers = data.PlayerCodes;
          players.map((item) => {
            currentPlayers += `,${item.memberCode}`;
          });
          data.PlayerCodes = currentPlayers;
        }
        console.log(data, "Amount API data...");
        const response = await FetchAmountDue(data);
        const amounts = response.data.data;
        dispatch(toggleBtnLoader(false));

        console.log(amounts, "amount data");
        setPlayersAmountData(amounts);
      } catch (error) {
        dispatch(toggleBtnLoader(false));
      }
    }
  };

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
    const isExist = checkedPlayers.find(
      (item) => item.memberCode == player.memberCode
    );
    if (isExist) {
      return true;
    } else {
      return false;
    }
  };

  const handleAddPlayer = (player: Player) => {
    // const isAlreadyAdded = checkedPlayers.find(
    //   (item) => item.memberCode == player.memberCode
    // );
    // if (isAlreadyAdded) {
    //   const removePlayers = checkedPlayers.filter(
    //     (item) => item.memberCode !== player.memberCode
    //   );
    //   setCheckedPlayers(removePlayers);
    // } else {
    //   setCheckedPlayers([...checkedPlayers, player]);
    // }

    const listOfPlayers = JSON.parse(JSON.stringify(selectedPlayers));
    const markedPlayer = listOfPlayers.find(
      (item) => item.memberCode == player.memberCode
    );
    if (markedPlayer?.isChecked) {
      markedPlayer.isChecked = false;
    } else {
      markedPlayer.isChecked = true;
    }
    sortTheSelectedPlayers(listOfPlayers);
    // setSelectedPlayers(listOfPlayers);
  };

  const handleRemovePlayers = (player: Player) => {
    const removedPlayers = selectedPlayers.filter(
      (item) => item.memberCode !== player.memberCode
    );
    const removeCheckPlayer = checkedPlayers.filter(
      (item) => item.memberCode !== player.memberCode
    );
    setSelectedPlayers(removedPlayers);
    setCheckedPlayers(removeCheckPlayer);
  };

  const validateAmount = (amount, balance) => {
    if (balance < amount) {
      return true;
    } else {
      return false;
    }
  };

  const onAddFavoritePress = async (member: Player, isFav: boolean) => {
    let data = {
      IsFavourite: isFav,
      MemberCodes: member.memberCode,
      Service: bookingData?.selectedSport?.sportServiceSetting.title,
    };
    const response = await AddToFavorite(data);
    console.log(response.data, "response of favorites");

    getMembers();
  };

  const handleMarkAllUnfav = async (members: Player[]) => {
    const memberCodes = members.map((member) => member.memberCode).join(",");

    // Prepare the data object
    let data = {
      IsFavourite: false, // Assuming `isFav` is `false` when marking as unfavorite
      MemberCodes: memberCodes,
      Service: bookingData?.selectedSport?.sportServiceSetting.title,
    };
    const response = await AddToFavorite(data);
    console.log(response.data, "response of favorites");

    getMembers();
    console.log(data);
  };

  const handleMarkAllfav = async (members: Player[]) => {
    const memberCodes = members.map((member) => member.memberCode).join(",");

    // Prepare the data object
    let data = {
      IsFavourite: true, // Assuming `isFav` is `false` when marking as unfavorite
      MemberCodes: memberCodes,
      Service: bookingData?.selectedSport?.sportServiceSetting.title,
    };
    const response = await AddToFavorite(data);
    console.log(response.data, "response of favorites");

    getMembers();
    console.log(data);
  };
  const validateBookingButton = (data) => {
    // Initialize the variable to store the result
    let result = false;
    setDisableBooking(false);
    // Loop through the keys in the data object
    for (let i = 1; i <= 4; i++) {
      const amountDueKey = `p${i}AmountDue`;
      const balanceAmountKey = `p${i}BalanceAmount`;

      // Check if both keys exist in the data
      if (
        data.hasOwnProperty(amountDueKey) &&
        data.hasOwnProperty(balanceAmountKey)
      ) {
        const amountDue = data[amountDueKey];
        const balanceAmount = data[balanceAmountKey];

        // Check if the amount due is less than the balance amount
        if (amountDue > balanceAmount) {
          result = true;
          setDisableBooking(true);
          break; // If true, stop the loop
        }
      }
    }
    console.log(result);
    return result;
  };

  const onBookingConfirmation = async (pinCode: string) => {
    let data = {
      BookingKey: bookingData?.sessionDetail?.key,
      BookingType: bookingType?.key,
      IsACOn: includeAc ? 1 : 0,
      IsHalfSession: halfSession ? 1 : 0,
      PayerCode: profile?.memberCode,
      PlayerCodes: profile?.memberCode,
      PinCode: pinCode,
      Service:
        bookingData?.selectedSport?.sportServiceSetting.title.toLowerCase(),
    };
    if (checkedPlayers.length) {
      let currentPayers = data.PayerCode;
      checkedPlayers.map((item) => {
        currentPayers += `,${item.memberCode}`;
      });
      data.PayerCode = currentPayers;
    }
    if (selectedPlayers.length) {
      let currentPlayers = data.PlayerCodes;
      selectedPlayers.map((item) => {
        currentPlayers += `,${item.memberCode}`;
      });
      data.PlayerCodes = currentPlayers;
    }
    const response = await CreateBooking(data);
    dispatch(fetchRemainingBalance());

    if (response.data.msgCode == "500") {
      showErrorToast(response.data.data);
    } else {
      router.back();
    }
    console.log(response.data, "Data of booking");
  };

  const showValuePrice = (item) => {
    console.log(item, "item");
    console.log(playersAmountData, "players amount data");
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <GeneralHeader
        sport={{
          name: bookingData?.selectedSport?.sportServiceSetting.title,
          icon: sportsIcon[
            bookingData?.selectedSport?.sportServiceSetting?.title
          ],
        }}
        back={true}
        title="Booking Detail"
      />
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
        <BerlingskeMedium style={{ color: colors.primary, fontSize: 17 }}>
          Session Information
        </BerlingskeMedium>
        <InputField icon={icons.calendar} value={bookingData?.selectedDate} />
        <InputField icon={icons.clock} value={bookingData.sessionDetail.slot} />
        <View style={{ pointerEvents: "none" }}>
          <InputField
            icon={icons.court2}
            value={bookingData.courtDetail.title}
          />
        </View>
        <MainButton onPress={() => router.back()} title="Change" />
        <BerlingskeMedium style={{ color: colors.primary, fontSize: 17 }}>
          Booking Types
        </BerlingskeMedium>
        <InputField
          icon={icons.court2}
          rightIcon={icons.dropdown}
          value={bookingType?.title}
          dropdown={true}
          onPress={() => dropdownRef.current?.show()}
        />
        {bookingData?.selectedSport?.sportServiceSetting?.hasHalfTimeSetting ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => setHalfSession(!halfSession)}
              style={styles.checkbox}
            >
              {halfSession ? (
                <Image
                  source={icons.tick}
                  style={{
                    width: "60%",
                    height: "60%",
                    resizeMode: "contain",
                  }}
                />
              ) : null}
            </TouchableOpacity>
            <Text style={styles.playerName}>Half Session</Text>
          </View>
        ) : null}
        {bookingData?.selectedSport?.sportServiceSetting?.hasACSetting ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => setIncludeAc(!includeAc)}
              style={styles.checkbox}
            >
              {includeAc ? (
                <Image
                  source={icons.tick}
                  style={{
                    width: "60%",
                    height: "60%",
                    resizeMode: "contain",
                  }}
                />
              ) : null}
            </TouchableOpacity>
            <Text style={styles.playerName}>Include A/C</Text>
          </View>
        ) : null}
        <View style={styles.rowDirection}>
          <BerlingskeMedium style={{ color: colors.primary, fontSize: 17 }}>
            Players
          </BerlingskeMedium>
          {enableAddPlayers ? (
            <MainButton
              title="Add Players"
              style={styles.addPlayer}
              onPress={() => addPlayerPopup.current?.show()}
            />
          ) : null}
        </View>

        {/* Fixed player */}

        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 2,
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
            <View>
              <ArchivoRegular style={styles.playerName}>
                {user?.name} {user?.surName}
              </ArchivoRegular>
              <View style={styles.chip}>
                <ArchivoRegular
                  style={[
                    { color: colors.darkText, fontSize: 10, marginTop: -5 },
                  ]}
                >
                  ( {playersAmountData?.p1Label} )
                </ArchivoRegular>
              </View>
            </View>
          </View>
          <View style={{ pointerEvents: "none" }}>
            <InputField
              icon={icons.euro}
              value={String(playersAmountData?.p1AmountDue || 0)}
              invalid={validateAmount(
                playersAmountData?.p1AmountDue,
                playersAmountData?.p1BalanceAmount
              )}
            />
          </View>
        </View>
        {selectedPlayers.map((item, index) => (
          <View style={{ marginTop: 10 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 2,
              }}
            >
              <TouchableOpacity
                onPress={() => handleAddPlayer(item)}
                style={styles.checkbox}
              >
                {item?.isChecked && (
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
              <View>
                <ArchivoRegular style={styles.playerName}>
                  {item.name} ({item.memberCode})
                </ArchivoRegular>
                <View style={styles.chip}>
                  <ArchivoRegular
                    style={[
                      {
                        color: colors.darkText,
                        fontSize: 12,
                        marginTop: -5,
                      },
                    ]}
                  >
                    ( {playersAmountData[`p${index + 2}Label`]} )
                  </ArchivoRegular>
                </View>
              </View>
            </View>
            {item?.isChecked && (
              <InputField
                icon={icons.euro}
                value={String(playersAmountData[`p${index + 2}AmountDue`])}
                invalid={validateAmount(
                  playersAmountData[`p${index + 2}AmountDue`],
                  playersAmountData[`p${index + 2}BalanceAmount`]
                )}
              />
            )}
          </View>
        ))}
        <MainButton
          onPress={() => bookingConfirmationRef.current?.show()}
          disabled={disableBooking}
          title="BOOK"
        />
        {selectedPlayers.length ? (
          <BerlingskeMedium style={styles.heading}>
            Remove Players
          </BerlingskeMedium>
        ) : (
          <View />
        )}
        {selectedPlayers.map((item) => {
          return (
            <View style={styles.removePlayerContainer}>
              <ArchivoRegular style={{ fontSize: 13 }}>
                {item.name} ({item.memberCode})
              </ArchivoRegular>
              <TouchableOpacity onPress={() => handleRemovePlayers(item)}>
                <Image source={icons.cross} style={styles.icon} />
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
      <AddPlayerModal
        allPlayers={allPlayers}
        reference={addPlayerPopup}
        selectedPlayers={selectedPlayers}
        setSelectedPlayers={setSelectedPlayers}
        maximumPlayers={maximumPlayers}
        onDonePress={onDonePress}
        onAddFavoritePress={onAddFavoritePress}
        handleMarkAllUnfav={handleMarkAllUnfav}
        handleMarkAllfav={handleMarkAllfav}
      />
      <BookingConfirmationPopup
        reference={bookingConfirmationRef}
        onAccept={onBookingConfirmation}
      />
      <SelectDropDown
        reference={dropdownRef}
        onChangeValue={setBookingType}
        values={bookingData.courtDetail?.bookingTypes}
      />
    </View>
  );
};

export default BookingDetailScreen;

const styles = StyleSheet.create({
  heading: {
    marginVertical: 10,
    color: colors.darkText,
    fontSize: 18,
  },
  rowDirection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addPlayer: {
    height: vh * 3.7,
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
    fontSize: 15,
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
  loader: {
    height: vh * 100,
    width: vw * 100,
    backgroundColor: "#0000004a",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  chip: {
    // backgroundColor: colors.primary,
    borderRadius: vh * 10,
    paddingVertical: 4,
    // width: 80,
    // position : "absolute",
    // alignItems: "center",
  },
});
