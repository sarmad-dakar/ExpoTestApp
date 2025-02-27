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
import DropdownField from "@/app/components/DropDownField";
import BannerBackground from "@/app/components/BannerBackground";
import { useTheme } from "@react-navigation/native";
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
  const [splitPayment, setSplitPayment] = useState(false);
  const dispatch = useAppDispatch();
  const user = useSelector((state: any) => state.user.profile);
  const profile = useSelector((state: any) => state.user.user);
  const [newFavList, setNewFavList] = useState([]);
  const btnLoader = useSelector((state: RootState) => state.general.btnLoader);
  const { colors } = useTheme();
  console.log(
    bookingData?.selectedSport,
    "bookingData?.selectedSport?.sportServiceSetting"
  );
  useEffect(() => {
    getMembers();
    calculateMaxPlayers();
    if (bookingData) {
      const currentsport = bookingData?.selectedSport;
      console.log(bookingData?.selectedSport?.sportServiceSetting, "sport");
      if (currentsport?.hideMembers) {
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
    // getAmountDue(listOfPlayers);
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
    const splitPlayers = selectedPlayers.filter((item) => item?.isChecked);

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
    if (splitPlayers.length) {
      let currentPayers = data.PayerCode;
      splitPlayers.map((item) => {
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

  const handleResetPayments = () => {
    console.log(selectedPlayers);
    const updatedMembers = selectedPlayers.map((member) => ({
      ...member,
      isChecked: false,
    }));
    setSelectedPlayers(updatedMembers);
    getAmountDue(updatedMembers);
    setSplitPayment(false);
  };

  function capitalizeFirstLetter(str) {
    if (!str) return ""; // Handle empty string
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F0F0F0" }}>
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
      <View style={styles.sessionContainer}>
        <BannerBackground
          date={moment(bookingData?.selectedDate, "DD/MM/YYYY").format(
            "ddd DD MMM YYYY"
          )}
          court={`${bookingData.courtDetail.title} (${bookingData.courtDetail.courtType})`}
          name={bookingData?.selectedSport?.sportServiceSetting?.title}
          handleSwitch={() => router.back()}
          time={bookingData?.sessionDetail?.slot}
        />
      </View>

      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          overflow: "hidden",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 12,
          },
          shadowOpacity: 0.58,
          shadowRadius: 16.0,

          elevation: 24,
        }}
      >
        <ScreenWrapper>
          <View style={{ height: vh * 2 }} />
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 50,
              // backgroundColor: "white",
              // justifyContent: "space-between",
              // flex: 1,
            }}
            style={{
              flex: 1,
            }}
          >
            {/* <BerlingskeBold style={styles.heading}>
          Booking Payment & Add Players
        </BerlingskeBold> */}

            {/* <Animated.View entering={FadeIn.duration(500)}>
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
          </Animated.View> */}
            <View
              style={{
                flex: 1,
                backgroundColor: "white",
              }}
            >
              <Animated.View entering={FadeIn.duration(500).delay(500)}>
                <BerlingskeMedium
                  style={{
                    color: themeColors.primary,
                    fontSize: 17,
                    // marginTop: vh * 1,
                    marginBottom: vh * 1,
                  }}
                >
                  Booking Types
                </BerlingskeMedium>
                {/* <InputField
              icon={icons.court2}
              rightIcon={icons.dropdown}
              value={bookingType?.title}
              dropdown={true}
              onPress={() => dropdownRef.current?.show()}
            /> */}
                <View
                  style={{
                    marginBottom: bookingData?.selectedSport
                      ?.sportServiceOptions
                      ? vh * 1
                      : 0,
                  }}
                >
                  <DropdownField
                    onPress={() => dropdownRef.current?.show()}
                    value={capitalizeFirstLetter(bookingType?.title)}
                  />
                </View>

                {bookingData?.selectedSport?.sportServiceOptions
                  ? bookingData?.selectedSport?.sportServiceOptions.map(
                      (item) => {
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
                              hitSlop={{
                                top: 10,
                                bottom: 10,
                                left: 10,
                                right: 10,
                              }} // Adjust hitSlop as needed
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
                            <ArchivoRegular style={styles.playerName}>
                              {item?.title}
                            </ArchivoRegular>
                          </View>
                        );
                      }
                    )
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
                <View style={[styles.rowDirection, { marginBottom: vh * 1 }]}>
                  <BerlingskeMedium
                    style={{ color: themeColors.primary, fontSize: 17 }}
                  >
                    Players
                  </BerlingskeMedium>
                  {enableAddPlayers ? (
                    <Animated.View
                      entering={SlideInRight.duration(750).delay(300)}
                      style={{
                        alignItems: "center",
                        width: vw * 15,
                        marginRight: vw * 1,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => addPlayerPopup.current?.show()}
                        style={[styles.circle, { backgroundColor: "#E6E6E6" }]}
                      >
                        <Image
                          style={{
                            width: "50%",
                            height: "50%",
                            resizeMode: "contain",
                            tintColor: "black",
                          }}
                          source={icons.add}
                        />
                      </TouchableOpacity>
                    </Animated.View>
                  ) : // <MainButton
                  //   title="Add Players"
                  //   style={styles.addPlayer}
                  //   icon={icons.add}
                  //   onPress={() => addPlayerPopup.current?.show()}
                  // />
                  null}
                </View>

                {newFavList?.length ? (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent:
                        newFavList.length > 3 ? "space-between" : "flex-start",
                      marginVertical: vh * 1,
                    }}
                  >
                    {newFavList.slice(0, 5).map((item, index) => {
                      return (
                        <Animated.View
                          entering={SlideInRight.duration(
                            (index + 1) * 150
                          ).delay((index + 1) * 20)}
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
                                borderColor: colors.secondary,
                              },
                            ]}
                          >
                            <ArchivoMedium
                              style={{ color: "white", fontSize: vh * 1.8 }}
                            >
                              {item.name?.split(" ")[0][0]}
                              {item.name?.split(" ")[1][0]}
                            </ArchivoMedium>
                          </TouchableOpacity>
                          <ArchivoRegular
                            numberOfLines={2}
                            style={{
                              fontSize: vh * 1.4,
                              textAlign: "center",
                            }}
                          >
                            {item.name}
                          </ArchivoRegular>
                        </Animated.View>
                      );
                    })}
                  </View>
                ) : null}

                {/* Fixed player */}
                <View
                  style={[styles.rowDirection, { marginVertical: vh * 0.5 }]}
                >
                  <BerlingskeMedium
                    style={{ color: themeColors.primary, fontSize: 15 }}
                  >
                    Selected Players
                  </BerlingskeMedium>
                  {selectedPlayers?.length ? (
                    <MainButton
                      title={splitPayment ? "RESET PAYMENT" : "SPLIT PAYMENT"}
                      style={styles.addPlayer}
                      onPress={() => {
                        if (splitPayment) {
                          handleResetPayments();
                        } else {
                          setSplitPayment(true);
                        }
                      }}
                      // onPress={() => addPlayerPopup.current?.show()}
                    />
                  ) : null}
                </View>

                <View>
                  <View style={styles.playerContainer}>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      {splitPayment ? (
                        <View
                          style={[styles.checkbox, { borderColor: "#8D8F8C" }]}
                        >
                          <Image
                            source={icons.tick}
                            style={{
                              width: "60%",
                              height: "60%",
                              resizeMode: "contain",
                              tintColor: "#8D8F8C",
                            }}
                          />
                        </View>
                      ) : null}
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          // backgroundColor: "red",
                        }}
                      >
                        <ArchivoRegular style={styles.playerName}>
                          {reduceString(`${user?.name} ${user?.surName}`, 20)}
                        </ArchivoRegular>
                        <ArchivoRegular
                          style={[
                            {
                              color: themeColors.darkText,
                              fontSize: 10,
                              marginLeft: 5,
                            },
                          ]}
                        >
                          {playersAmountData?.p1Label
                            ? `(${playersAmountData?.p1Label})`
                            : null}
                        </ArchivoRegular>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.greenContainer,
                        {
                          backgroundColor: validateAmount(
                            playersAmountData?.p1AmountDue,
                            playersAmountData?.p1BalanceAmount
                          )
                            ? "#D0373F"
                            : "#4FA052",
                        },
                      ]}
                    >
                      <Image source={icons.euro} style={styles.euro} />
                      <ArchivoMedium style={styles.euroText}>
                        {String(playersAmountData?.p1AmountDue || 0)}
                      </ArchivoMedium>
                    </View>
                  </View>
                </View>

                {selectedPlayers.map((item, index) => (
                  <Animated.View
                    entering={SlideInRight.duration(500)}
                    style={{ marginTop: 10 }}
                  >
                    <View style={styles.playerContainer}>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        {splitPayment ? (
                          <TouchableOpacity
                            onPress={() => handleAddPlayer(item)}
                            style={styles.checkbox}
                            hitSlop={{
                              top: 10,
                              bottom: 10,
                              left: 10,
                              right: 10,
                            }} // Adjust hitSlop as needed
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
                        ) : null}
                        <View style={{ width: "65%" }}>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <ArchivoRegular style={styles.playerName}>
                              {reduceString(item.name, 18)}
                            </ArchivoRegular>
                            <ArchivoRegular
                              style={[
                                {
                                  color: themeColors.darkText,
                                  fontSize: 10,
                                  marginLeft: 5,
                                },
                              ]}
                            >
                              {playersAmountData[`p${index + 2}Label`]
                                ? `(${playersAmountData[`p${index + 2}Label`]})`
                                : null}
                            </ArchivoRegular>
                          </View>

                          {/* <TouchableOpacity
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
                        </TouchableOpacity> */}
                        </View>
                      </View>

                      <View style={{ flexDirection: "row", height: "100%" }}>
                        {item?.isChecked ? (
                          <View
                            style={[
                              styles.greenContainer,
                              {
                                backgroundColor: validateAmount(
                                  playersAmountData[`p${index + 2}AmountDue`],
                                  playersAmountData[
                                    `p${index + 2}BalanceAmount`
                                  ]
                                )
                                  ? "#D0373F"
                                  : "#4FA052",
                              },
                            ]}
                          >
                            {validateAmount(
                              playersAmountData[`p${index + 2}AmountDue`],
                              playersAmountData[`p${index + 2}BalanceAmount`]
                            ) ? (
                              <Image
                                source={icons.ban}
                                style={[
                                  {
                                    position: "absolute",
                                    height: "85%",
                                    width: "85%",
                                    resizeMode: "contain",
                                    tintColor: "white",
                                    alignSelf: "center",
                                    opacity: 0.5,
                                    zIndex: 20,
                                  },
                                ]}
                              />
                            ) : null}

                            <Image source={icons.euro} style={styles.euro} />
                            <ArchivoMedium style={styles.euroText}>
                              {String(
                                playersAmountData[`p${index + 2}AmountDue`]
                              )}
                            </ArchivoMedium>
                          </View>
                        ) : null}
                        <TouchableOpacity
                          onPress={() => handleRemovePlayers(item)}
                          style={{
                            // paddingHorizontal: 5,
                            width: vw * 8,
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                            backgroundColor: "#D0373F",
                          }}
                        >
                          <Image
                            source={icons.trash}
                            style={styles.trashIcon}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Animated.View>
                ))}

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
            </View>
          </ScrollView>
        </ScreenWrapper>
      </View>
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
    width: 130,
  },
  checkbox: {
    height: vh * 2,
    width: vh * 2,
    borderColor: themeColors.darkText,
    borderWidth: 2,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  playerName: {
    fontSize: vh * 1.7,
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  sessionContainer: {
    // height: vh * 15,
  },
  playerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
    backgroundColor: "#F0F0F0",
    height: vh * 5,
    paddingLeft: 10,
    borderRadius: 5,
    overflow: "hidden",
  },
  greenContainer: {
    width: vw * 15,
    justifyContent: "center",
    // paddingHorizontal: 15,
    height: "100%",
    backgroundColor: "#4FA052",
    flexDirection: "row",
    alignItems: "center",
    borderRightWidth: 1,
    borderColor: "white",
  },
  euro: {
    width: vh * 1.5,
    height: vh * 1.5,
    resizeMode: "contain",
    tintColor: "white",
    marginRight: 3,
  },
  euroText: {
    fontSize: vh * 1.6,
    color: "white",
  },
  trashIcon: {
    height: vh * 2,
    width: vh * 2,
    resizeMode: "contain",
  },
});
