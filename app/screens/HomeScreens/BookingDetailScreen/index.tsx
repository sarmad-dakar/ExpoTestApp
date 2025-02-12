import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
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
import { themeColors } from "@/app/utils/theme";

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
import ArchivoExtraLight from "@/app/components/TextWrapper/ArchivoExtraLight";
import ScreenWrapper from "@/app/components/ScreenWrapper";
import ArchivoLight from "@/app/components/TextWrapper/ArchivoLight";
import Animated, {
  FadeIn,
  RotateInDownLeft,
  SlideInDown,
  SlideInLeft,
  SlideInRight,
  SlideInUp,
  ZoomIn,
} from "react-native-reanimated";
import Toast from "react-native-toast-message";
import ArchivoMedium from "@/app/components/TextWrapper/ArchivoMedium";
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
  const [servicesOption, setServicesOptions] = useState([]);
  const [enableAddPlayers, setEnableAddPlayers] = useState(true);
  const dispatch = useAppDispatch();
  const user = useSelector((state: any) => state.user.profile);
  const profile = useSelector((state: any) => state.user.user);
  const [newFavList, setNewFavList] = useState([]);
  const btnLoader = useSelector((state: RootState) => state.general.btnLoader);
  console.log(
    bookingData?.selectedSport?.sportServiceOptions,
    "bookingData?.selectedSport?.sportServiceSetting"
  );
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
      getAmountDue(selectedPlayers);
      // sortTheSelectedPlayers();
    }
  }, [bookingType]);

  useEffect(() => {
    if (bookingType?.key) {
      getAmountDue(selectedPlayers);
      // sortTheSelectedPlayers();
    }
  }, [servicesOption]);

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

  const onChangeServicesOption = (item) => {
    const isAlreadyExist = servicesOption.find((obj) => obj == item);
    if (isAlreadyExist) {
      const removeService = servicesOption.filter((obj) => obj !== item);
      setServicesOptions([...removeService]);
    } else {
      setServicesOptions([...servicesOption, item]);
    }
  };

  const getMembers = async () => {
    let data = {
      sport:
        bookingData?.selectedSport?.sportServiceSetting?.title?.toLowerCase(),
    };

    const response = await FetchMembers(data);
    setAllPlayers(response.data?.data);
    const favMembers = response.data?.data.filter((item) => item.isFavourite);
    setNewFavList(favMembers);
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
        if (servicesOption.length) {
          let currentFacilities = servicesOption.join(",");
          data["sportServiceOptions"] = currentFacilities;
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
  const reduceString = (str, count) => {
    return str.length > count ? str.slice(0, count) + "..." : str;
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
    getAmountDue(removedPlayers);
    // setNewFavList([player, ...newFavList]);
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

  const checkTickMark = (item) => {
    const isExist = servicesOption.find((obj) => obj == item);
    if (isExist) {
      return true;
    } else {
      return false;
    }
  };

  const onQuickFavPress = (item) => {
    if (maximumPlayers == selectedPlayers.length) {
      Toast.show({ type: "info", text1: "Maximum players limit reached" });
      return true;
    }
    const totalSelected = [...selectedPlayers, item];
    // const remainingFav = newFavList.filter(
    //   (obj) => obj?.memberCode !== item?.memberCode
    // );
    console.log(item, " item");
    // setNewFavList(remainingFav);
    setSelectedPlayers(totalSelected);
    getAmountDue(totalSelected);
  };

  const isAddedInList = (item) => {
    const isAdded = selectedPlayers.find(
      (player) => player?.memberCode == item.memberCode
    );
    if (isAdded) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.white }}>
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

      <ScreenWrapper>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50 }}
          style={{ flex: 1 }}
        >
          <BerlingskeBold style={styles.heading}>
            Booking Payment & Add Players
          </BerlingskeBold>
          {/* <View>
          <BerlingskeBold style={styles.heading}>
            Booking Payment & Add Players
          </BerlingskeBold>
          <BerlingskeMedium
            style={{ color: themeColors.primary, fontSize: 17 }}
          >
            Session Information
          </BerlingskeMedium>

          <View style={{ pointerEvents: "none" }}>
            <InputField
              icon={icons.calendar}
              value={bookingData?.selectedDate}
            />
            <InputField
              icon={icons.clock}
              value={bookingData.sessionDetail.slot}
            />
            <InputField
              icon={icons.court2}
              value={bookingData.courtDetail.title}
            />
          </View>
          <MainButton onPress={() => router.back()} title="Change" />
        </View> */}

          <Animated.View entering={FadeIn.duration(500)}>
            <BerlingskeMedium
              style={{
                color: themeColors.primary,
                fontSize: 17,
                marginBottom: vh * 1,
              }}
            >
              Session Information
            </BerlingskeMedium>

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image source={icons.calendar} style={styles.icon} />
                  <ArchivoRegular style={{ fontSize: vh * 1.6 }}>
                    {moment(bookingData?.selectedDate, "DD/MM/YYYY").format(
                      "ddd DD MMM YYYY"
                    )}{" "}
                    , {bookingData.sessionDetail.slot}
                  </ArchivoRegular>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: vh * 0.5,
                  }}
                >
                  <Image source={icons.court2} style={styles.icon} />
                  <ArchivoRegular style={{ fontSize: vh * 1.6 }}>
                    {bookingData.courtDetail.title} (
                    {bookingData.courtDetail.courtType})
                  </ArchivoRegular>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => router.back()}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Animated.View
                  entering={RotateInDownLeft.duration(1200).delay(1500)}
                >
                  <Image
                    source={icons.exchange2}
                    style={[styles.icon, { tintColor: "black" }]}
                  />
                </Animated.View>
                <ArchivoRegular style={{ fontSize: vh * 1.5, color: "black" }}>
                  Change
                </ArchivoRegular>
              </TouchableOpacity>
            </View>
            {/* <MainButton onPress={() => router.back()} title="Change" /> */}
          </Animated.View>

          <Animated.View entering={FadeIn.duration(500).delay(500)}>
            <BerlingskeMedium
              style={{
                color: themeColors.primary,
                fontSize: 17,
                marginTop: vh * 3,
              }}
            >
              Booking Types
            </BerlingskeMedium>
            <InputField
              icon={icons.court2}
              rightIcon={icons.dropdown}
              value={bookingType?.title}
              dropdown={true}
              onPress={() => dropdownRef.current?.show()}
            />

            {bookingData?.selectedSport?.sportServiceOptions
              ? bookingData?.selectedSport?.sportServiceOptions.map((item) => {
                  return (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 10,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => onChangeServicesOption(item.id)}
                        style={styles.checkbox}
                      >
                        {checkTickMark(item.id) ? (
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
                      <Text style={styles.playerName}>{item?.title}</Text>
                    </View>
                  );
                })
              : null}

            {/* {bookingData?.selectedSport?.sportServiceSetting?.hasHalfTimeSetting ? (
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
        ) : null} */}
            <View style={styles.rowDirection}>
              <BerlingskeMedium
                style={{ color: themeColors.primary, fontSize: 17 }}
              >
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
                        {
                          color: themeColors.darkText,
                          fontSize: 10,
                          marginTop: -5,
                        },
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
                  error={
                    validateAmount(
                      playersAmountData?.p1AmountDue,
                      playersAmountData?.p1BalanceAmount
                    )
                      ? "Balance is less. Kindly topup"
                      : null
                  }
                />
              </View>
            </View>

            {selectedPlayers.length ? (
              <Animated.View
                entering={ZoomIn.duration(1000)}
                style={{ alignSelf: "center" }}
              >
                <ArchivoMedium style={{ fontSize: vh * 1.8 }}>
                  Split the Cost with Ease!
                </ArchivoMedium>
                <Image
                  source={icons.split}
                  style={[styles.icon, { alignSelf: "center" }]}
                />
              </Animated.View>
            ) : null}
            {selectedPlayers.map((item, index) => (
              <Animated.View
                entering={SlideInRight.duration(500)}
                style={{ marginTop: 10 }}
              >
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
                  <View style={{ width: "90%" }}>
                    <ArchivoRegular style={styles.playerName}>
                      {item.name} ({item.memberCode})
                    </ArchivoRegular>
                    <View style={styles.chip}>
                      <ArchivoRegular
                        style={[
                          {
                            color: themeColors.darkText,
                            fontSize: 12,
                            marginTop: -5,
                          },
                        ]}
                      >
                        ( {playersAmountData[`p${index + 2}Label`]} )
                      </ArchivoRegular>
                    </View>
                    <TouchableOpacity
                      style={{
                        position: "absolute",
                        right: 0,
                      }}
                      onPress={() => handleRemovePlayers(item)}
                    >
                      <Image
                        source={icons.cross}
                        style={{
                          width: vh * 3,
                          height: vh * 3,
                          resizeMode: "contain",
                        }}
                      />
                    </TouchableOpacity>
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
                    error={
                      validateAmount(
                        playersAmountData[`p${index + 2}AmountDue`],
                        playersAmountData[`p${index + 2}BalanceAmount`]
                      )
                        ? "Balance is less. Kindly topup"
                        : null
                    }
                  />
                )}
              </Animated.View>
            ))}

            {newFavList?.length ? (
              <Animated.View>
                <BerlingskeMedium
                  style={{ color: themeColors.primary, fontSize: 17 }}
                >
                  Favourite Members
                </BerlingskeMedium>
              </Animated.View>
            ) : null}
            {newFavList?.length ? (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  marginVertical: vh * 1,
                }}
              >
                {newFavList.slice(0, 4).map((item, index) => {
                  return (
                    <Animated.View
                      entering={SlideInRight.duration((index + 1) * 150).delay(
                        (index + 1) * 20
                      )}
                      style={{
                        width: vw * 15,
                        marginRight: vw * 1,
                        alignItems: "center",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => onQuickFavPress(item)}
                        disabled={isAddedInList(item)}
                        style={[
                          styles.circle,
                          isAddedInList(item) && {
                            borderWidth: 2,
                            borderColor: themeColors.secondary,
                          },
                        ]}
                      >
                        <Text style={{ color: "white" }}>
                          {item.name?.split(" ")[0][0]}
                          {item.name?.split(" ")[1][0]}
                        </Text>
                      </TouchableOpacity>
                      <ArchivoLight
                        numberOfLines={2}
                        style={{
                          fontSize: vh * 1.4,
                        }}
                      >
                        {item.name}
                      </ArchivoLight>
                    </Animated.View>
                  );
                })}
                <Animated.View
                  entering={SlideInRight.duration(750).delay(300)}
                  style={{
                    alignItems: "center",
                    width: vw * 15,

                    
                  }}
                >
                  <TouchableOpacity
                    onPress={() => addPlayerPopup.current?.show()}
                    style={[styles.circle, { backgroundColor: "#0002" }]}
                  >
                    <Image
                      style={{
                        width: "40%",
                        height: "40%",
                        resizeMode: "contain",
                        tintColor: "black",
                      }}
                      source={icons.add}
                    />
                  </TouchableOpacity>
                  <ArchivoLight
                    numberOfLines={2}
                    style={{ fontSize: vh * 1.4,  }}
                  >
                    Add More
                  </ArchivoLight>
                </Animated.View>
              </View>
            ) : null}

            <MainButton
              onPress={() => bookingConfirmationRef.current?.show()}
              disabled={disableBooking}
              title="BOOK"
            />
            {/* {selectedPlayers.length ? (
              <BerlingskeMedium style={styles.heading}>
                Remove Players
              </BerlingskeMedium>
            ) : (
              <View />
            )} */}
            {/* {selectedPlayers.map((item) => {
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
            })} */}
          </Animated.View>
        </ScrollView>
      </ScreenWrapper>
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
    color: themeColors.darkText,
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
    borderColor: themeColors.gray,
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
    backgroundColor: themeColors.lightGray,
    borderRadius: 10,
    marginBottom: 5,
  },
  icon: {
    height: vh * 2.3,
    width: vh * 2.3,
    marginRight: vw * 2,
    resizeMode: "contain",
    tintColor: "#0009",
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
    borderRadius: vh * 10,
    paddingVertical: 4,
    // width: 80,
    // position : "absolute",
    // alignItems: "center",
  },
  circle: {
    height: vh * 4.5,
    width: vh * 4.5,
    borderRadius: vh * 100,
    backgroundColor: themeColors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});
