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
import { vh, vw } from "@/app/utils/units";
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
import WalletContainer from "@/app/components/WalletContainer";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import moment from "moment";
import { useSelector } from "react-redux";
import TopupConfirmationPopup from "../TopupConfirmationPopup";
import { useTheme } from "@react-navigation/native";
import { RootState } from "@/app/store";
import ArchivoRegular from "../TextWrapper/ArchivoRegular";
import { LinearGradient } from "expo-linear-gradient";
import ArchivoMedium from "../TextWrapper/ArchivoMedium";
import DatePickerCustomModal from "../../components/DatePickerCustomModal";
import DropdownField from "../DropDownField";
import ArchivoLight from "../TextWrapper/ArchivoLight";
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
  golf: icons.golf,
  bowling: icons.bowling,
  gym: icons.gym,
  swimming: icons.swimming,
  basketball: icons.basketball,
  football: icons.football,
  "table tennis": icons.table_tennis,
  baseball: icons.baseball,
  rugby: icons.rugby,
  running: icons.running,
  karate: icons.karate,
  boxing: icons.boxing,
  pickleball: icons.pickleBall,
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

  useEffect(() => {
    if (allSports?.length) {
      SetOtherSports(allSports.slice(1));
    } else {
      SetOtherSports([]);
    }
  }, [allSports]);

  const handleSelectedSport = (sport: Sport) => {
    setSelectedSport(sport);
    // const otherSports = allSports.filter(
    //   (item) =>
    //     item.sportServiceSetting?.title !== sport.sportServiceSetting?.title
    // );
    // SetOtherSports(otherSports);
  };
  console.log(vw , "vertical width")
  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false); // Close the picker
    console.log(moment(selectedDate).format("hh:mm"));
    setSelectedDate(selectedDate);
    // getCalendarData(selectedDate, selectedSport);
    // setDate(currentDate);
  };

  const onResetDate = ()=> { 
    setShowDatePicker(false)
    setSelectedDate(new Date())
  }

  const handlePress = () => {
    if (club?.paymentSettings?.showPayment) {
      topupConfirmationRef.current?.show();
    } else {
      return null;
    }
  };

  const isSportSelected = (item) => {
    if (
      item?.sportServiceSetting?.title ==
      selectedSport?.sportServiceSetting?.title
    ) {
      return colors.secondary;
    } else {
      return themeColors.white;
    }
  };

  const getFontFamilySport = (item) => {
    if (
      item?.sportServiceSetting?.title ==
      selectedSport?.sportServiceSetting?.title
    ) {
      return "FiraSans-Medium";
    } else {
      return "FiraSans-Light";
    }
  };

  return (
    <View>
      <SlidingDrawer
        isVisible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      >
        <ArchivoLight />
        <Text>Here is the drawer content!</Text>
      </SlidingDrawer>

      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => handleSelectedSport(allSports[0])}
          style={{
            alignItems: "center",
            width: 60,
            // Border Glow
            // borderWidth: 2,
            // borderColor: "rgba(255,255,255,0.5)", // Slight glow effect
            // padding: 5,
          }}
        >
          {selectedSport && (
            <Image
              source={
                sportsIcon[
                  `${allSports[0]?.sportServiceSetting?.title?.toLowerCase()}`
                ]
              }
              style={[
                styles.logo,
                {
                  tintColor: isSportSelected(allSports[0]),
                },
              ]}
            />
          )}
          {selectedSport && (
            <Text
              style={[
                styles.selectedSport,
                {
                  color: isSportSelected(allSports[0]),
                  fontSize: vh * 1.5,
                  fontFamily: getFontFamilySport(allSports[0]),
                },
              ]}
            >
              {allSports[0]?.sportServiceSetting?.title}
            </Text>
          )}
        </TouchableOpacity>

        <BerlingskeMedium
          style={[styles.selectedSport, { fontSize: vh * 2.5 }]}
        >
          {selectedSport?.sportServiceSetting?.title} Bookings
        </BerlingskeMedium>

        <Pressable
          onPress={handlePress}
          style={{
            // width: 60,
            height: 50,
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <WalletContainer />
        </Pressable>
      </View>

      <View style={[styles.bottomHeaderContainer]}>
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
                    style={[styles.logo, { tintColor: isSportSelected(item) }]}
                  />
                  <Text
                    style={[
                      styles.selectedSport,
                      {
                        color: isSportSelected(item),
                        fontFamily: getFontFamilySport(item),
                      },
                    ]}
                  >
                    {item?.sportServiceSetting?.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
        <LinearGradient
          start={{ x: 0.08, y: 0 }}
          end={{ x: 0.3, y: 0.4 }}
          colors={[colors.primary, "white", "white", "#ffffff00", "#ffffff00"]}
          style={styles.slotWrapper}
        >
          <LinearGradient
            colors={["white", "#ffffff00", "#ffffff00"]}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.4, y: 0.3 }}
            style={styles.slotContainer}
          >
            <BerlingskeMedium style={styles.slotTitle}>
              Find Your Slot
            </BerlingskeMedium>
            {/* <InputField
              // style={{ width: 250 }}
              dropdown={true}
              onPress={() => setShowDatePicker(true)}
              icon={icons.calendar}
              rightIcon={icons.dropdown}
              value={moment(selectedDate).format("DD/MM/YYYY")}
            /> */}
            {/* <DropdownField value={"sdsds"} /> */}

            {/* <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => setShowDatePicker(true)}
              style={{
                height: vh * 4.8,
                backgroundColor: "white",
                borderRadius: 5,
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
                paddingHorizontal: "4%",
                marginVertical: vh * 0.5,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.23,
                shadowRadius: 2.62,

                elevation: 4,
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <Image
                  source={icons.calendar}
                  style={{
                    height: vh * 1.8,
                    width: vh * 1.8,
                    resizeMode: "contain",
                    tintColor: "#5F645D",
                    marginRight: vw * 2,
                  }}
                />
                <ArchivoRegular style={{ fontSize: vh * 1.6 }}>
                  {moment(selectedDate).format("DD/MM/YYYY")}
                </ArchivoRegular>
              </View>
              <Image
                source={icons.dropdown2}
                style={{
                  height: vh * 1.8,
                  width: vh * 1.8,
                  resizeMode: "contain",
                  tintColor: "#5F645D",
                }}
              />
            </TouchableOpacity> */}

            <DatePickerCustomModal
              selectedDate={selectedDate}
              isVisible={showDatePicker}
              onRequestClose={() => setShowDatePicker(false)}
              onChangeDate={onChangeDate}
              handleResetDate = {onResetDate}
            />

            <Pressable
              onPress={() => setShowDatePicker(true)}
              style={{
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.23,
                shadowRadius: 2.62,

                elevation: 4,
              }}
            >
              <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 2 }}
                colors={["#E9FDF9", "#F2F1F4", "#FFE0EE"]}
                style={{
                  height: vh * 12,
                  marginTop: 5,
                  backgroundColor: "red",
                  borderRadius: 10,
                  justifyContent: "center",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.23,
                  shadowRadius: 2.62,

                  elevation: 4,
                }}
              >
                <View style={{ paddingLeft: "4%" }}>
                  <View style={styles.bar}></View>
                  <ArchivoRegular
                    style={{ fontSize: vh * 1.5, color: "#2A2F28" }}
                  >
                    {club?.title}
                  </ArchivoRegular>
                  <ArchivoRegular
                    style={{ fontSize: vh * 1.5, color: "#888888" }}
                  >
                    {selectedSport?.sportServiceSetting?.title} Booking
                  </ArchivoRegular>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginLeft: "4%",
                    marginTop: vh * 0.5,
                    borderBottomWidth: 1,
                    width: "70%",
                  }}
                >
                  <Image
                    source={icons.calendar}
                    style={{
                      width: vh * 2,
                      height: vh * 2,
                      resizeMode: "contain",
                      marginRight: vw * 1.5,
                    }}
                  />
                  <ArchivoMedium style={{ fontSize: vh * 1.6, color: "black" }}>
                    {moment(selectedDate).format("DD MMM YYYY , dddd")}
                  </ArchivoMedium>
                  <Image
                    source={icons.dropdown}
                    style={{
                      width: vh * 1.5,
                      height: vh * 1.5,
                      resizeMode: "contain",
                      marginLeft: vw * 2,
                    }}
                  />
                </View>
              </LinearGradient>
            </Pressable>
          </LinearGradient>
        </LinearGradient>
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
    html: {
      fontFamily: "",
    },
    container: {
      backgroundColor: colors.primary,
      height: vh * 15,
      borderBottomRightRadius: 40,
      justifyContent: "space-between",
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 15,
      paddingTop: Platform.OS == "ios" ? 25 : 10,
      zIndex: 30,
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
      height: vh * 28,
      // backgroundColor: "white",
      width: "100%",
      zIndex: 30,
    },
    sideBar: {
      backgroundColor: colors.primary,
      width: vw > 7 ?  120 : 90,
      borderBottomRightRadius: 40,
      paddingLeft: 18,
      justifyContent: "space-between",
      paddingBottom: 20,
      height: vh * 27,
      // alignItems: "center",
    },
    slotWrapper: {
      // height: vh * 25,

      width: "70%",
    },
    slotContainer: {
      height: "100%",
      width: "100%",
      // backgroundColor: "red",
      borderTopLeftRadius: 30,
      paddingLeft: "8%",
      paddingTop: "6%",
    },
    sidebarTabs: {
      justifyContent: "center",
      alignItems: "center",
      width: vw > 7 ?  75 : 55,
      marginTop: vh * 2,
    },
    slotTitle: {
      fontSize: vh * 3,
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
    bar: {
      height: "100%",
      width: vw * 0.7,
      backgroundColor: "black",
      position: "absolute",
      borderTopRightRadius: 5,
      borderBottomRightRadius: 5,
      // top: vh * 0.5,
    },
  });
  return styles;
};
