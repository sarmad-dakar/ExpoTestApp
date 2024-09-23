import {
  Image,
  StyleSheet,
  Text,
  View,
  ImageSourcePropType,
  TouchableOpacity,
} from "react-native";
import React, { useRef, useState } from "react";
import { colors } from "@/app/utils/theme";
import { vh } from "@/app/utils/units";
import { icons, images } from "@/app/MyAssets";
import BerlingskeMedium from "../TextWrapper/BerlingskeMedium";
import BerlingskeBold from "../TextWrapper/BerlingskeBold";
import InputField from "../InputField";
import MainButton from "../MainButton";
import BerlingskeRegular from "../TextWrapper/BerlingskeRegular";
import SlidingDrawer from "../SlidingDrawer";
import SelectDropDown from "../Dropdown";
import { ConfirmationPopupRef } from "../ConfirmationPopup";

interface Sport {
  name: string;
  icon: ImageSourcePropType;
  // add other fields as needed
}

interface HomeHeaderProps {
  allSports: Sport[]; // Adjust the type according to your data structure
  onNotificationPress: () => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({
  allSports,
  onNotificationPress,
}) => {
  const [SelectedSport, setSelectedSport] = useState(allSports[0]);
  const [OtherSports, SetOtherSports] = useState(allSports.slice(1));
  const [drawerVisible, setDrawerVisible] = useState(false);
  const dropdown = useRef<ConfirmationPopupRef>(null);

  const handleSelectedSport = (sport: Sport) => {
    setSelectedSport(sport);
    const otherSports = allSports.filter((item) => item.name !== sport.name);
    SetOtherSports(otherSports);
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
          <Image
            source={SelectedSport.icon}
            style={[styles.logo, { tintColor: colors.secondary }]}
          />
          <Text style={[styles.selectedSport, { color: colors.secondary }]}>
            {SelectedSport.name}
          </Text>
        </View>
        <BerlingskeMedium style={styles.selectedSport}>
          Tennis Bookings
        </BerlingskeMedium>
        <TouchableOpacity
          onPress={onNotificationPress}
          style={styles.iconContainer}
        >
          <Image source={icons.notificationIcon} style={styles.icon} />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomHeaderContainer}>
        <View style={styles.sideBar}>
          {OtherSports.map((item) => {
            return (
              <TouchableOpacity
                onPress={() => handleSelectedSport(item)}
                style={styles.sidebarTabs}
              >
                <Image source={item.icon} style={styles.logo} />
                <Text style={styles.selectedSport}>{item.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={styles.slotWrapper}>
          <View style={styles.slotContainer}>
            <BerlingskeBold style={styles.slotTitle}>
              Find Your Slot
            </BerlingskeBold>
            <InputField
              // style={{ width: 250 }}
              icon={icons.calendar}
              rightIcon={icons.dropdown}
              value="07/07/2024"
            />
            <MainButton
              onPress={() => dropdown.current?.show()}
              style={{ height: 40 }}
              title="Search Now"
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                // justifyContent: "space-between",
              }}
            >
              <Image source={icons.court} style={styles.courtIcon} />
              <Text style={{ color: "black", fontSize: 14 }}>
                {"Marsa Sport Club (MSC)\nTennis Booking\n 07 July 2024"}
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
    height: vh * 30,
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
});
