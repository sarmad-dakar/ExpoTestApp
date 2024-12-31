import {
  Image,
  StyleSheet,
  Text,
  View,
  ImageSourcePropType,
  TouchableOpacity,
  Platform,
  Pressable,
  ScrollView,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { themeColors } from "@/app/utils/theme";
import { vh } from "@/app/utils/units";
import { icons, images } from "@/app/MyAssets";
import BerlingskeMedium from "../TextWrapper/BerlingskeMedium";
import BerlingskeBold from "../TextWrapper/BerlingskeBold";
import InputField from "../InputField";
import MainButton from "../MainButton";
import BerlingskeRegular from "../TextWrapper/BerlingskeRegular";
import SlidingDrawer from "../SlidingDrawer";
import SelectDropDown, { SelectDropdownRef } from "../Dropdown";
import { ConfirmationPopupRef } from "../ConfirmationPopup";
// import DatePicker from 'react-native-date-picker'

import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import moment from "moment";
import { useSelector } from "react-redux";
import TopupConfirmationPopup from "../TopupConfirmationPopup";
import { useTheme } from "@react-navigation/native";
import { RootState } from "@/app/store";
import ArchivoRegular from "../TextWrapper/ArchivoRegular";
interface Sport {
  sportServiceSetting: {
    title: string;
    hasACSetting: boolean;
    hasHalfTimeSetting: boolean;
  };
  bookingSetting: {
    maximumPlayers: number;
    minimumPlayers: number;
  };
  // add other fields as needed
}

export const sportsIcon = {
  tennis: icons.tennis,
  squash: icons.squash,
  padel: icons.padel,
  paddle: icons.padel,
  snooker: icons.snooker,
  cricket: icons.cricket,
  golf: icons.cricket,
  bowling: icons.cricket,
  gym: icons.cricket,
  swimming: icons.cricket,
  basketball: icons.cricket,
  football: icons.cricket,
  "table tennis": icons.cricket,
  baseball: icons.cricket,
  rugby: icons.cricket,
  running: icons.cricket,
  karate: icons.cricket,
  boxing: icons.cricket,
};

interface HomeHeaderProps {
  allSports: Sport[]; // Adjust the type according to your data structure
  onNotificationPress: () => void;
  setSelectedDate: (date: any) => void;
  selectedDate: Date;
  onSearchPress: () => void;
  getCalendarData: (date: any, sport: Sport) => void;
  selectedSport: Sport | undefined;
  setSelectedSport: React.Dispatch<React.SetStateAction<Sport | undefined>>;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({
  allSports,
  onNotificationPress,
  setSelectedDate,
  selectedDate,
  onSearchPress,
  getCalendarData,
  setSelectedSport,
  selectedSport,
}) => {
  const [OtherSports, SetOtherSports] = useState([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const topupConfirmationRef = useRef<ConfirmationPopupRef>(null);
  const club = useSelector((state: RootState) => state.general.clubConfig);
  const balance = useSelector((state: any) => state.account.balance);
  const styles = MyStyles();
  const dropdown = useRef<SelectDropdownRef>(null);
  const { colors } = useTheme();
  console.log(OtherSports, "other sports");
  useEffect(() => {
    if (allSports?.length) {
      SetOtherSports(allSports.slice(1));
    }
  }, [allSports]);

  const handleSelectedSport = (sport: Sport) => {
    setSelectedSport(sport);
    const otherSports = allSports.filter(
      (item) =>
        item.sportServiceSetting?.title !== sport.sportServiceSetting?.title
    );
    SetOtherSports(otherSports);
  };

  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false); // Close the picker
    console.log(moment(selectedDate).format("hh:mm"));
    setSelectedDate(selectedDate);
    // getCalendarData(selectedDate, selectedSport);
    // setDate(currentDate);
  };

  const handlePress = () => {
    topupConfirmationRef.current?.show();
  };

  return (
    <View>
      <SlidingDrawer
        isVisible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      >
        <Text>Here is the drawer content!</Text>
      </SlidingDrawer>

      <View style={styles.container}>
        <View style={{ alignItems: "center", width: 60 }}>
          {selectedSport && (
            <Image
              source={
                sportsIcon[
                  `${selectedSport?.sportServiceSetting?.title?.toLowerCase()}`
                ]
              }
              style={[styles.logo, { tintColor: colors.secondary }]}
            />
          )}
          {selectedSport && (
            <Text style={[styles.selectedSport, { color: colors.secondary }]}>
              {selectedSport?.sportServiceSetting?.title}
            </Text>
          )}
        </View>
        <BerlingskeMedium
          style={[styles.selectedSport, { fontSize: vh * 2.5 }]}
        >
          {selectedSport?.sportServiceSetting?.title} Bookings
        </BerlingskeMedium>
        {/* <TouchableOpacity
          onPress={onNotificationPress}
          style={styles.iconContainer}
        >
          <Image source={icons.notificationIcon} style={styles.icon} />
        </TouchableOpacity> */}
        <Pressable
          onPress={handlePress}
          style={{
            // width: 60,
            height: 50,
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          {/* <View style={{ backgroundColor: "red", marginRight: 10 }}>
            <Image source={icons.wallet} style={styles.backIcon} />
          </View> */}

          <Image
            source={icons.euro}
            style={{
              width: vh * 1.5,
              height: vh * 1.5,
              resizeMode: "contain",
              marginRight: 5,
              tintColor: "white",
            }}
          />
          <ArchivoRegular style={{ color: "white", fontSize: vh * 1.5 }}>
            {balance}
          </ArchivoRegular>
          <Image
            source={icons.dropdown}
            style={{
              width: vh * 1.5,
              height: vh * 1.5,
              resizeMode: "contain",
              tintColor: "white",
              marginLeft: 4,
            }}
          />
        </Pressable>
      </View>

      <View
        style={[
          styles.bottomHeaderContainer,
          // { maxHeight: OtherSports.length * 22 },
        ]}
      >
        <View style={styles.sideBar}>
          <ScrollView>
            {[...OtherSports].map((item, index) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    handleSelectedSport(item);
                  }}
                  style={[
                    styles.sidebarTabs,
                    index == 0 ? { marginTop: vh * 0 } : null,
                  ]}
                >
                  <Image
                    source={
                      sportsIcon[
                        `${item?.sportServiceSetting?.title?.toLowerCase()}`
                      ]
                    }
                    style={styles.logo}
                  />
                  <Text style={styles.selectedSport}>
                    {item?.sportServiceSetting?.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
        <View style={styles.slotWrapper}>
          <View style={styles.slotContainer}>
            <BerlingskeMedium style={styles.slotTitle}>
              Find Your Slot
            </BerlingskeMedium>
            {Platform.OS == "android" ? (
              <InputField
                // style={{ width: 250 }}
                dropdown={true}
                onPress={() => setShowDatePicker(true)}
                icon={icons.calendar}
                rightIcon={icons.dropdown}
                value={moment(selectedDate).format("DD/MM/YYYY")}
              />
            ) : null}

            {/* For Ios Only */}

            {Platform.OS == "ios" ? (
              <View style={styles.datePickerField}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image source={icons.calendar} style={styles.inputIcon} />
                  <View style={{ transform: [{ scale: 0.8 }] }}>
                    <DateTimePicker
                      value={selectedDate}
                      mode="date"
                      key={moment(selectedDate).format("DD/MM/YYYY")}
                      display="calendar"
                      onChange={onChangeDate}
                      style={{ top: 0, left: 1 }}
                    />
                  </View>
                </View>
                <Image source={icons.dropdown} style={styles.inputIcon} />
              </View>
            ) : null}

            {showDatePicker && Platform.OS == "android" && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="calendar"
                onChange={onChangeDate}
              />
            )}
            {/* <MainButton
              onPress={onSearchPress}
              style={{ height: 40 }}
              title="Search Now"
            /> */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 5,
                // justifyContent: "space-between",
              }}
            >
              <Image source={icons.court} style={styles.courtIcon} />
              <Text style={{ color: "black", fontSize: 13 }}>
                {`${club?.title}\n${
                  selectedSport?.sportServiceSetting?.title
                } Booking\n ${moment(selectedDate).format("DD MMM YYYY")}`}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <SelectDropDown
        reference={dropdown}
        values={[{ value: "test", label: "test" }]}
      />
      <TopupConfirmationPopup reference={topupConfirmationRef} />
    </View>
  );
};

export default HomeHeader;

const MyStyles = () => {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.primary,
      height: vh * 15,
      borderBottomRightRadius: 40,
      justifyContent: "space-between",
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: Platform.OS == "ios" ? 25 : 10,
    },
    logo: {
      height: vh * 4,
      width: vh * 4,
      resizeMode: "contain",
      tintColor: themeColors.white,
    },
    selectedSport: {
      color: "white",
      fontSize: vh * 1.5,
      fontWeight: "300",
    },
    bottomHeaderContainer: {
      flexDirection: "row",
      minHeight: vh * 22,
      backgroundColor: "white",
      width: "100%",
    },
    sideBar: {
      backgroundColor: colors.primary,
      width: 90,
      borderBottomRightRadius: 40,
      paddingLeft: 18,
      justifyContent: "space-between",
      paddingBottom: 20,
      height: vh * 24,
      // alignItems: "center",
    },
    slotWrapper: {
      backgroundColor: colors.primary,
      height: vh * 25,
      width: "70%",
    },
    slotContainer: {
      height: "100%",
      width: "100%",
      backgroundColor: "white",
      borderTopLeftRadius: 30,
      paddingLeft: 30,
      paddingTop: 30,
    },
    sidebarTabs: {
      justifyContent: "center",
      alignItems: "center",
      width: 55,
      marginTop: vh * 2,
    },
    slotTitle: {
      fontSize: 24,
    },
    courtIcon: {
      width: 50,
      height: 50,
      resizeMode: "contain",
      tintColor: "black",
      marginRight: 10,
    },
    iconContainer: {
      height: 60,
      width: 60,
      justifyContent: "center",
      alignItems: "center",
    },
    icon: {
      width: "50%",
      height: "50%",
      resizeMode: "contain",
      tintColor: "white",
    },
    datePickerField: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottomWidth: 1,
      paddingBottom: 10,
      marginVertical: 10,
    },
    inputIcon: {
      height: 20,
      width: 20,
      resizeMode: "contain",
    },
  });
  return styles;
};
