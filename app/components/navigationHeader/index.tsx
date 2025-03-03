import {
  Image,
  ImageProps,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import { icons, images } from "@/app/MyAssets";
import { themeColors } from "@/app/utils/theme";
import { vh } from "@/app/utils/units";
import BerlingskeMedium from "../TextWrapper/BerlingskeMedium";
import { router } from "expo-router";
import { useSelector } from "react-redux";
import TopupConfirmationPopup from "../TopupConfirmationPopup";
import { ConfirmationPopupRef } from "../ConfirmationPopup";
import { useTheme } from "@react-navigation/native";
import ArchivoRegular from "../TextWrapper/ArchivoRegular";
import ArchivoExtraLight from "../TextWrapper/ArchivoExtraLight";
import WalletContainer from "../WalletContainer";

type headerProps = {
  title: string;
  back?: boolean;
  sport?: {
    name: string;
    icon: ImageProps;
  };
  color?: string;
};

const NavigationHeader = ({ title, back, sport, color }: headerProps) => {
  const balance = useSelector((state: any) => state.account.balance);
  const topupConfirmationRef = useRef<ConfirmationPopupRef>(null);
  const profile = useSelector((state: any) => state.user?.user);
  const user = useSelector((state: any) => state.user.profile);
  const [imageLoaded, setImageLoaded] = useState(false);

  const styles = MyStyles();
  const { colors } = useTheme();
  console.log(profile?.profilePic);
  const handlePress = () => {
    topupConfirmationRef.current?.show();
  };
  console.log(balance, "here ...");
  return (
    <View style={[styles.container, color ? { backgroundColor: color } : null]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={{ alignItems: "flex-start", width: "25%" }}
          onPress={() => router.back()}
        >
          <Image source={icons.back} style={styles.backIcon} />
        </TouchableOpacity>

        {balance ? (
          <Pressable
            onPress={handlePress}
            style={{
              width: "25%",
              height: 50,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <WalletContainer />
          </Pressable>
        ) : (
          <View style={{ width: 60 }} />
        )}
      </View>
      <View style={styles.profileContainer}>
        <Pressable
          onPress={() => router.navigate("/navigationstack/myprofile")}
          style={styles.pictureContainer}
        >
          <View style={styles.circle}>
            {!imageLoaded && (
              <Image source={icons.dummyUser2} style={styles.profile} />
            )}

            <Image
              source={{ uri: profile?.profilePic }}
              style={[styles.profile, imageLoaded ? {} : { display: "none" }]} // Hide until loaded
              onLoad={() => setImageLoaded(true)}
            />
          </View>
        </Pressable>
        <View style={styles.detailContainer}>
          <View style={styles.nameContainer}>
            <View>
              <ArchivoRegular style={{ fontSize: vh * 1.8, color: "white" }}>
                {user?.name} {user?.surName}
              </ArchivoRegular>
              <ArchivoExtraLight
                style={{
                  fontSize: vh * 1.5,
                  color: "#C5C5C5",
                  marginTop: -vh * 0.5,
                }}
              >
                {user?.email}
              </ArchivoExtraLight>
            </View>
            <TouchableOpacity
              hitSlop={{
                top: 20,
                bottom: 20,
                left: 20,
                right: 20,
              }} // Adjust hitSlop as needed
              onPress={() => router.navigate("/navigationstack/myprofile")}
            >
              <Image source={icons.edit} style={styles.editIcon} />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row", marginTop: vh * 0.5 }}>
            <TouchableOpacity
              onPress={() => router.navigate("/navigationstack/changepassword")}
            >
              <ArchivoRegular style={styles.textBtns}>
                Change Password
              </ArchivoRegular>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.navigate("/navigationstack/changepin")}
            >
              <ArchivoRegular style={styles.textBtns}>
                Change Pin
              </ArchivoRegular>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <TopupConfirmationPopup reference={topupConfirmationRef} />
    </View>
  );
};

export default NavigationHeader;

const MyStyles = () => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.primary,
      // height: vh * 25,
      borderBottomRightRadius: 30,
      borderBottomLeftRadius: 30,
      //   alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: Platform.OS == "ios" ? 25 : 10,
      paddingBottom: 5,
    },
    logo: {
      height: vh * 4,
      width: vh * 4,
      resizeMode: "contain",
      tintColor: themeColors.white,
    },
    selectedSport: {
      color: "white",
      fontSize: vh * 2.5,
    },
    backIcon: {
      height: 22,
      width: 22,
      resizeMode: "contain",
      tintColor: "white",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: vh * 4,
    },
    profileContainer: {
      flexDirection: "row",
      //   justifyContent: "center",
      height: vh * 10,
    },
    pictureContainer: {
      width: "25%",
      justifyContent: "center",
      //   alignItems: "center",
    },
    detailContainer: {
      width: "75%",
    },
    circle: {
      width: vh * 8,
      height: vh * 8,
      borderRadius: vh * 20,
      overflow: "hidden",
    },
    nameContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: vh * 1,
    },
    editIcon: {
      height: vh * 2.5,
      width: vh * 2.5,
      resizeMode: "contain",
      tintColor: "white",
    },
    textBtns: {
      fontSize: vh * 1.5,
      marginRight: vh * 2,
      color: colors.secondary,
      textDecorationLine: "underline",
    },
    profile: {
      height: "100%",
      width: "100%",
      resizeMode: "cover",
    },
  });
  return styles;
};
