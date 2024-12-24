import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import GeneralHeader from "@/app/components/GeneralHeader";
import ScreenWrapper from "@/app/components/ScreenWrapper";
import { themeColors } from "@/app/utils/theme";
import BerlingskeMedium from "@/app/components/TextWrapper/BerlingskeMedium";
import { router, useFocusEffect } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
  logout,
  removeLoginDetails,
  saveLoginDetails,
} from "@/app/store/slices/userSlice";
import ArchivoRegular from "@/app/components/TextWrapper/ArchivoRegular";
import BerlingskeBold from "@/app/components/TextWrapper/BerlingskeBold";
import { vh } from "@/app/utils/units";
import {
  setClubConfig,
  switchUser,
  toggleBtnLoader,
} from "@/app/store/slices/generalSlice";
import { generalApi, setBaseURL, testUrl } from "@/app/api";
import { clearSportsAndWallet } from "@/app/store/slices/accountSlice";
import PaymentWebviewPopup from "@/app/components/PaymentWebView";
import SwitchClubsDD from "@/app/components/SwitchClubsDD";
import { getGeneralAllClubs } from "@/app/api/Auth";
import axios from "axios";
import { icons } from "@/app/MyAssets";
import { RootState } from "@/app/store";

const AppNavigationScreen = () => {
  const activeOpacity = 0.5;
  const dispatch = useDispatch();
  const club = useSelector((state) => state.general.clubConfig);
  const webviewRef = useRef();
  const [clubs, setClubs] = useState([
    { title: "All Clubs", smallLogo: icons.types },
  ]);
  const multipleUsers = useSelector(
    (state: RootState) => state.user.multipleUsers
  );

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
  ];

  useEffect(() => {
    getAllClubs();
  }, [club]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearSportsAndWallet());
  };

  const getEachClubData = async (allClubs, index) => {
    if (index >= allClubs.length) {
      console.log("Finished processing all clubs.");
      return; // Base case: Stop recursion when all clubs are processed
    }

    const currentUrl = allClubs[index];

    try {
      // Fetch details for the current club
      const response = await axios.get(
        `${currentUrl}/api/v1/SportServices/sport/club/services`
      );
      const clubDetails = response.data;
      if (clubDetails?.title !== club?.title) {
        setClubs((prevClubs) => {
          const updatedClubs = [...prevClubs, clubDetails];
          return updatedClubs;
        });
      }
      // Update the `clubs` state with new details

      // Recursively process the next club
      await getEachClubData(allClubs, index + 1);
    } catch (error) {
      console.error(`Error fetching data for club at ${currentUrl}:`, error);
      // You may choose to keep the URL as is if an error occurs
      await getEachClubData(allClubs, index + 1);
    }
  };

  const handleSwitch = () => {
    setBaseURL(generalApi);
    // dispatch(switchUser(null));
    dispatch(toggleBtnLoader(true));
    setTimeout(() => {
      router.push("(navigations)/clublisting");
      dispatch(toggleBtnLoader(false));
    }, 100);
  };

  const getAllClubs = async () => {
    const response = await getGeneralAllClubs();
    const clubs = response.data;
    // setClubs(clubs);
    getEachClubData(clubs, 0);
  };

  const handleClubPress = (obj) => {
    setClubs([{ title: "All Clubs", smallLogo: icons.types }]);

    if (obj.title == "All Clubs") {
      return handleSwitch();
    }
    let isExist = multipleUsers.find((item) => item.club?.title == obj.title);
    if (isExist) {
      dispatch(saveLoginDetails(isExist?.user));
    } else {
      dispatch(removeLoginDetails());
    }
    setBaseURL(`${obj.apiURL}`);
    dispatch(setClubConfig(obj));
  };

  return (
    <View style={{ flex: 1 }}>
      <GeneralHeader title="App Navigations" back={true} />
      <ScrollView style={styles.container}>
        <SwitchClubsDD handleClubPress={handleClubPress} clubs={clubs} />
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
        {club?.privacyURL ? (
          <TouchableOpacity
            onPress={() => webviewRef?.current?.show(club?.privacyURL)}
            activeOpacity={activeOpacity}
            style={styles.subHeading}
          >
            <ArchivoRegular style={{ fontSize: vh * 1.7, color: "#3B5049" }}>
              Privacy Policy
            </ArchivoRegular>
          </TouchableOpacity>
        ) : null}
        {club?.termsURL ? (
          <TouchableOpacity
            onPress={() => webviewRef?.current?.show(club?.termsURL)}
            activeOpacity={activeOpacity}
            style={styles.subHeading}
          >
            <ArchivoRegular style={{ fontSize: vh * 1.7, color: "#3B5049" }}>
              Terms & Condition
            </ArchivoRegular>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          onPress={handleLogout}
          activeOpacity={activeOpacity}
          style={styles.subHeading}
        >
          <ArchivoRegular style={{ fontSize: vh * 1.7, color: "#3B5049" }}>
            Logout
          </ArchivoRegular>
        </TouchableOpacity>
        {/* <TouchableOpacity
          onPress={handleSwitch}
          activeOpacity={activeOpacity}
          style={styles.subHeading}
        >
          <ArchivoRegular
            style={{ fontSize: vh * 1.7, color: themeColors.red }}
          >
            Switch club
          </ArchivoRegular>
        </TouchableOpacity> */}
        <TouchableOpacity
          activeOpacity={activeOpacity}
          style={styles.subHeading}
        >
          {/* <Text style={{ color: colors.red }}>Delete Account</Text> */}
        </TouchableOpacity>
      </ScrollView>
      <PaymentWebviewPopup reference={webviewRef} />
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
