import {
  Image,
  StyleSheet,
  Text,
  View,
  ImageSourcePropType,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { colors } from "@/app/utils/theme";
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

const sportsIcon = {
  tennis: icons.tennis,
  squash: icons.squash,
  padel: icons.padel,
  snooker: icons.snooker,
  cricket: icons.cricket,
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

  const dropdown = useRef<SelectDropdownRef>(null);

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
        <BerlingskeMedium style={styles.selectedSport}>
          {selectedSport?.sportServiceSetting?.title} Bookings
        </BerlingskeMedium>
        <TouchableOpacity
          onPress={onNotificationPress}
          style={styles.iconContainer}
        >
          <Image source={icons.notificationIcon} style={styles.icon} />
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.bottomHeaderContainer,
          { height: OtherSports.length * 65 },
        ]}
      >
        <View style={styles.sideBar}>
          {OtherSports.map((item) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  handleSelectedSport(item);
                }}
                style={styles.sidebarTabs}
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
        </View>
        <View style={styles.slotWrapper}>
          <View style={styles.slotContainer}>
            <BerlingskeBold style={styles.slotTitle}>
              Find Your Slot
            </BerlingskeBold>
          {
            Platform.OS == "android" ?  
            <InputField
            // style={{ width: 250 }}
            dropdown={true}
            onPress={() => setShowDatePicker(true)}
            icon={icons.calendar}
            rightIcon={icons.dropdown}
            value={moment(selectedDate).format("DD/MM/YYYY")}
          />
           : null
          }

            {/* For Ios Only */}

            {
              Platform.OS == "ios" ? 
              <View style={styles.datePickerField}>
                <View style={{flexDirection : "row" , alignItems : "center"}}>
                <Image
                source={icons.calendar}
                style={styles.inputIcon}  />
                <DateTimePicker
                value={selectedDate}
                mode="date"
                
                display="calendar"
                onChange={onChangeDate}
                style={{top : 0 , left : 5}}
              />
                  </View>
                  <Image 
                  source={icons.dropdown}
                  style={styles.inputIcon}
                  />
                </View>
               : 
               null 
            }

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
                // justifyContent: "space-between",
              }}
            >
              <Image source={icons.court} style={styles.courtIcon} />
              <Text style={{ color: "black", fontSize: 14 }}>
                {`Marsa Sport Club (MSC)\nTennis Booking\n ${moment(
                  selectedDate
                ).format("DD MMM YYYY")}`}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <SelectDropDown
        reference={dropdown}
        values={[{ value: "test", label: "test" }]}
      />
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    height: vh * 13,
    borderBottomRightRadius: 40,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS == "ios" ? 25 : 10,
  },
  logo: {
    height: 30,
    width: 30,
    resizeMode: "contain",
    tintColor: colors.white,
  },
  selectedSport: {
    color: "white",
  },
  bottomHeaderContainer: {
    flexDirection: "row",
    // height: vh * 25,
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
    // alignItems: "center",
  },
  slotWrapper: {
    backgroundColor: colors.primary,
    height: "100%",
    width: "70%",
  },
  slotContainer: {
    height: "100%",
    width: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: 40,
    paddingLeft: 30,
    paddingTop: 30,
  },
  sidebarTabs: {
    justifyContent: "center",
    alignItems: "center",
    width: 55,
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
  datePickerField : { 
     flexDirection : "row" , 
     justifyContent : "space-between", 
     alignItems : "center",
     borderBottomWidth : 1,
     paddingBottom : 10,
     marginVertical : 10
  },
  inputIcon : { 
    height : 20, 
    width : 20 ,
    resizeMode : "contain"
  }
});
