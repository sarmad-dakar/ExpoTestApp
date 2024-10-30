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
import { colors } from "@/app/utils/theme";
import BerlingskeMedium from "@/app/components/TextWrapper/BerlingskeMedium";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import { logout } from "@/app/store/slices/userSlice";

const AppNavigationScreen = () => {
  const activeOpacity = 0.5;
  const dispatch = useDispatch();
  const AppSettings = [
    {
      name: "Notification",
      onPress: () => router.navigate("/homestack/notifications"),
    },
    { name: "My Bookings" },
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
  return (
    <View style={{ flex: 1 }}>
      <GeneralHeader title="App Navigations" back={true} />
      <ScrollView style={styles.container}>
        <View style={styles.heading}>
          <BerlingskeMedium>App Settings</BerlingskeMedium>
        </View>
        {AppSettings.map((item) => (
          <TouchableOpacity
            onPress={item.onPress}
            activeOpacity={activeOpacity}
            style={styles.subHeading}
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.heading}>
          <BerlingskeMedium>Help</BerlingskeMedium>
        </View>
        {HelpNavigation.map((item) => (
          <TouchableOpacity
            onPress={item.onPress}
            activeOpacity={activeOpacity}
            style={styles.subHeading}
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          onPress={handleLogout}
          activeOpacity={activeOpacity}
          style={styles.subHeading}
        >
          <Text>Logout</Text>
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
    backgroundColor: colors.lightGray,
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 20,
  },
  subHeading: {
    height: 45,
    backgroundColor: colors.white,
    justifyContent: "center",
    paddingHorizontal: 30,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
});
