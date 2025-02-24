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
import React, { useRef } from "react";
import { icons } from "@/app/MyAssets";
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

type headerProps = {
  title: string;
  back?: boolean;
  sport?: {
    name: string;
    icon: ImageProps;
  };
  color?: string;
  disable?: boolean;
};

const GeneralHeader = ({ title, back, sport, color, disable }: headerProps) => {
  const balance = useSelector((state: any) => state.account.balance);
  const topupConfirmationRef = useRef<ConfirmationPopupRef>(null);
  const styles = MyStyles();
  const { colors } = useTheme();

  const handlePress = () => {
    topupConfirmationRef.current?.show();
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
    <View style={[styles.container, color ? { backgroundColor: color } : null]}>
      {back ? (
        <TouchableOpacity
          style={{ alignItems: "flex-start", width: "25%" }}
          onPress={() => router.back()}
        >
          <Image source={icons.back} style={styles.backIcon} />
        </TouchableOpacity>
      ) : (
        <View
          style={{
            alignItems: "flex-start",
            width: "25%",
          }}
        >
          {sport?.icon ? (
            <Image
              source={sport?.icon}
              style={[styles.logo, { tintColor: colors.secondary }]}
            />
          ) : null}
          {sport?.icon ? (
            <ArchivoMedium
              style={[
                styles.selectedSport,
                { color: colors.secondary, fontSize: vh * 1.5 },
              ]}
            >
              {sport?.name || "Tennis"}
            </ArchivoMedium>
          ) : null}
        </View>
      )}
      <BerlingskeMedium style={styles.selectedSport}>{title}</BerlingskeMedium>
      {showBalance() ? (
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
          {/* <View style={{ backgroundColor: "red", marginRight: 10 }}>
            <Image source={icons.wallet} style={styles.backIcon} />
          </View> */}

          <WalletContainer />
        </Pressable>
      ) : (
        <View style={{ width: "25%" }} />
      )}
      <TopupConfirmationPopup reference={topupConfirmationRef} />
    </View>
  );
};

export default GeneralHeader;

const MyStyles = () => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.primary,
      height: vh * 15,
      borderBottomRightRadius: 30,
      borderBottomLeftRadius: 30,
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
