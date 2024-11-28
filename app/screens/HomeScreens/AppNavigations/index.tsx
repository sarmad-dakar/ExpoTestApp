import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import GeneralHeader from "@/app/components/GeneralHeader";
import ScreenWrapper from "@/app/components/ScreenWrapper";
import { themeColors } from "@/app/utils/theme";
import BerlingskeMedium from "@/app/components/TextWrapper/BerlingskeMedium";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import { logout } from "@/app/store/slices/userSlice";
import ArchivoRegular from "@/app/components/TextWrapper/ArchivoRegular";
import BerlingskeBold from "@/app/components/TextWrapper/BerlingskeBold";
import { vh } from "@/app/utils/units";
import { switchUser } from "@/app/store/slices/generalSlice";

const AppNavigationScreen = () => {
  const activeOpacity = 0.5;
  const dispatch = useDispatch();
  const AppSettings = [
    {
      name: "Notification",
      onPress: () => router.navigate("/homestack/notifications"),
    },
    {
      name: "My Profile",
      onPress: () => router.navigate("/navigationstack/myprofile"),
    },
    {
      name: "My Accounts",
      onPress: () => router.navigate("/navigationstack/myaccount"),
    },
    {
      name: "My Subscriptions",
      onPress: () => router.navigate("/navigationstack/mysubscription"),
    },
  ];
  const HelpNavigation = [
    {
      name: "Change Password",
      onPress: () => router.navigate("/navigationstack/changepassword"),
    },
    {
      name: "Change Pin",
      onPress: () => router.navigate("/navigationstack/changepin"),
    },
    {
      name: "Help Centre",
      onPress: () => router.navigate("/navigationstack/contactscreen"),
    },
    {
      name: "Privacy Policy",
      onPress: () => router.navigate("/navigationstack/privacypolicy"),
    },
    {
      name: "Terms & Use",
      onPress: () => router.navigate("/navigationstack/termscondition"),
    },
  ];

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleSwitch = () => {
    dispatch(logout());
    dispatch(switchUser(null));
  };
  return (
    <View style={{ flex: 1 }}>
      <GeneralHeader title="App Navigations" back={true} />
      <ScrollView style={styles.container}>
        <View style={styles.heading}>
          <BerlingskeBold style={styles.headingText}>
            App Settings
          </BerlingskeBold>
        </View>
        {AppSettings.map((item) => (
          <TouchableOpacity
            onPress={item.onPress}
            activeOpacity={activeOpacity}
            style={styles.subHeading}
          >
            <ArchivoRegular style={{ fontSize: vh * 1.7, color: "#3B5049" }}>
              {item.name}
            </ArchivoRegular>
          </TouchableOpacity>
        ))}

        <View style={styles.heading}>
          <BerlingskeBold style={styles.headingText}>Help</BerlingskeBold>
        </View>
        {HelpNavigation.map((item) => (
          <TouchableOpacity
            onPress={item.onPress}
            activeOpacity={activeOpacity}
            style={styles.subHeading}
          >
            <ArchivoRegular style={{ fontSize: vh * 1.7, color: "#3B5049" }}>
              {item.name}
            </ArchivoRegular>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          onPress={handleLogout}
          activeOpacity={activeOpacity}
          style={styles.subHeading}
        >
          <ArchivoRegular style={{ fontSize: vh * 1.7, color: "#3B5049" }}>
            Logout
          </ArchivoRegular>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSwitch}
          activeOpacity={activeOpacity}
          style={styles.subHeading}
        >
          <ArchivoRegular
            style={{ fontSize: vh * 1.7, color: themeColors.red }}
          >
            Logout & Switch user
          </ArchivoRegular>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={activeOpacity}
          style={styles.subHeading}
        >
          {/* <Text style={{ color: colors.red }}>Delete Account</Text> */}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default AppNavigationScreen;

const styles = StyleSheet.create({
  heading: {
    height: 45,
    backgroundColor: themeColors.lightGray,
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  headingText: {
    fontSize: vh * 2.2,
    color: themeColors.darkText,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 20,
  },
  subHeading: {
    height: 45,
    backgroundColor: themeColors.white,
    justifyContent: "center",
    paddingHorizontal: 30,
    borderWidth: 0.3,
    borderColor: themeColors.lightGray,
  },
});
