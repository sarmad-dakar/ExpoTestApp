import {
  Image,
  StyleSheet,
  Text,
  View,
  ImageSourcePropType,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { themeColors } from "@/app/utils/theme";
import { vh } from "@/app/utils/units";
import { icons, images } from "@/app/MyAssets";
import BerlingskeMedium from "../TextWrapper/BerlingskeMedium";
import BerlingskeBold from "../TextWrapper/BerlingskeBold";
import InputField from "../InputField";
import MainButton from "../MainButton";
import BerlingskeRegular from "../TextWrapper/BerlingskeRegular";
import SlidingDrawer from "../SlidingDrawer";
import Svg, { Path } from "react-native-svg";

interface Sport {
  name: string;
  icon: ImageSourcePropType;
  // add other fields as needed
}

interface HomeHeaderProps {
  allSports: Sport[]; // Adjust the type according to your data structure
}

const HomeHeaderBeta: React.FC<HomeHeaderProps> = ({ allSports }) => {
  const [SelectedSport, setSelectedSport] = useState(allSports[0]);
  const [OtherSports, SetOtherSports] = useState(allSports.slice(1));
  const [drawerVisible, setDrawerVisible] = useState(false);

  const handleSelectedSport = (sport: Sport) => {
    setSelectedSport(sport);
    const otherSports = allSports.filter((item) => item.name !== sport.name);
    SetOtherSports(otherSports);
    setDrawerVisible(false);
  };

  return (
    <View>
      <SlidingDrawer
        isVisible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      >
        {OtherSports.map((item) => {
          return (
            <TouchableOpacity
              onPress={() => handleSelectedSport(item)}
              style={styles.iconContainer}
            >
              <Image source={item.icon} style={styles.sideBarIcons} />
              <Text>{item.name}</Text>
            </TouchableOpacity>
          );
        })}
      </SlidingDrawer>

      <View style={styles.container}>
        <View style={{ alignItems: "center", width: 60 }}>
          <Image
            source={SelectedSport.icon}
            style={[styles.logo, { tintColor: themeColors.secondary }]}
          />
          <Text
            style={[styles.selectedSport, { color: themeColors.secondary }]}
          >
            {SelectedSport.name}
          </Text>
        </View>
        <BerlingskeMedium style={styles.selectedSport}>
          Tennis Bookings
        </BerlingskeMedium>
        <TouchableOpacity
          onPress={() => setDrawerVisible(true)}
          style={{ width: 60 }}
        >
          <Image source={icons.hamburger} style={[styles.logo]} />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomHeaderContainer}>
        {/* <View style={styles.sideBar}>
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
        </View> */}
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
              onPress={() => setDrawerVisible(true)}
              style={{ height: 45 }}
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
          <View
            style={{
              //   backgroundColor: "red",
              //   height: 40,
              //   height: 50,
              overflow: "hidden",
              //   backgroundColor: "green",
              flexDirection: "row",
            }}
          >
            {/* <Svg
              height="20"
              width="100%"
              viewBox="0 0 100 10"
              style={{
                marginBottom: 10,
              }}
            >
              <Path
                d="M 0 20 Q 5 5 10 19 T 20 20 T 30 15 T 40 23 T 47 12 T 56 16 T 70 15 T 80 20 T 87 20 T 100 20 L 100 0 L 0 0 Z"
                fill="white"
                stroke="#dcdcdc"
                strokeWidth="1"
              />
            </Svg> */}
            <Image
              source={icons.reciept}
              style={{
                height: 25,
                width: "100%",
                resizeMode: "repeat",

                // right: 30,
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default HomeHeaderBeta;

const styles = StyleSheet.create({
  container: {
    backgroundColor: themeColors.primary,
    height: vh * 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: "space-between",
    flexDirection: "row",
    paddingBottom: 35,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: {
    height: 30,
    width: 30,
    resizeMode: "contain",
    tintColor: themeColors.white,
  },
  selectedSport: {
    color: "white",
  },
  bottomHeaderContainer: {
    height: vh * 32,
    width: "80%",
    alignSelf: "center",
    marginTop: -50,
  },
  sideBar: {
    backgroundColor: themeColors.primary,
    width: 90,
    borderBottomRightRadius: 40,
    paddingLeft: 18,
    justifyContent: "space-between",
    paddingBottom: 20,
    // alignItems: "center",
  },
  slotWrapper: {
    height: "100%",
    width: "100%",
  },
  slotContainer: {
    height: "100%",
    width: "100%",
    backgroundColor: themeColors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,

    paddingHorizontal: 30,
    paddingTop: 20,
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5,
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
  sideBarIcons: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    tintColor: "black",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
});
