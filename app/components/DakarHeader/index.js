import {
  Image,
  ImageBackground,
  ImageProps,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import React, { useRef } from "react";
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
import ArchivoMedium from "../TextWrapper/ArchivoMedium";
import WalletContainer from "../WalletContainer";
import { RootState } from "@/app/store";

type headerProps = {
  title: string,
  back?: boolean,
  sport?: {
    name: string,
    icon: ImageProps,
  },
  color?: string,
  disable?: boolean,
};

const DakarHeader = ({
  title,
  back,
  sport,
  color,
  disable,
  time,
}: headerProps) => {
  const balance = useSelector((state: any) => state.account.balance);
  const topupConfirmationRef = useRef < ConfirmationPopupRef > null;
  const club = useSelector((state: RootState) => state.general.clubConfig);
  const styles = MyStyles();
  const { colors } = useTheme();

  const handlePress = () => {
    if (club?.paymentSettings?.showPayment) {
      topupConfirmationRef.current?.show();
    } else {
      return null;
    }
  };

  const showBalance = () => {
    if (disable) {
      return false;
    }
    if (balance) {
      return true;
    }
    return false;
  };

  return (
    <ImageBackground source={images.backgroundDakar}
    style={[styles.container]}>
      <Image source={images.dakarLogo} style={styles.logo} />
    </ImageBackground>
  );
};

export default DakarHeader;

const MyStyles = () => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.primary,
      height: Platform.OS == "ios" ? vh * 20: vh * 15,
      borderBottomRightRadius: 30,
      borderBottomLeftRadius: 30,
      justifyContent: "center",
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: Platform.OS == "ios" ? 25 : 10,
      overflow: "hidden",
    },
    logo: {
      height: vh * 16,
      width: vh * 16,
      resizeMode: "contain",
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
  });
  return styles;
};
