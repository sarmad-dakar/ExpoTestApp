import {
  Image,
  ImageProps,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
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

type headerProps = {
  title: string;
  back?: boolean;
  sport?: {
    name: string;
    icon: ImageProps;
  };
};

const GeneralHeader = ({ title, back, sport }: headerProps) => {
  const balance = useSelector((state: any) => state.account.balance);
  const topupConfirmationRef = useRef<ConfirmationPopupRef>(null);

  const handlePress = () => {
    topupConfirmationRef.current?.show();
  };

  return (
    <View style={styles.container}>
      {back ? (
        <TouchableOpacity style={{ width: 60 }} onPress={() => router.back()}>
          <Image source={icons.back} style={styles.backIcon} />
        </TouchableOpacity>
      ) : (
        <View style={{ alignItems: "center", width: 60 }}>
          {sport?.icon ? (
            <Image
              source={sport?.icon}
              style={[styles.logo, { tintColor: themeColors.secondary }]}
            />
          ) : null}
          {sport?.icon ? (
            <Text
              style={[styles.selectedSport, { color: themeColors.secondary }]}
            >
              {sport?.name || "Tennis"}
            </Text>
          ) : null}
        </View>
      )}
      <BerlingskeMedium style={styles.selectedSport}>{title}</BerlingskeMedium>
      {balance ? (
        <Pressable
          onPress={handlePress}
          style={{
            width: 60,
            height: 50,
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          {/* <View style={{ backgroundColor: "red", marginRight: 10 }}>
            <Image source={icons.wallet} style={styles.backIcon} />
          </View> */}
          <View>
            <BerlingskeMedium
              style={{ color: themeColors.secondary, fontSize: 15 }}
            >
              Wallet
            </BerlingskeMedium>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={icons.euro}
                style={{
                  width: 12,
                  height: 12,
                  resizeMode: "contain",
                  marginRight: 5,
                  tintColor: "white",
                }}
              />
              <Text style={{ color: "white", fontSize: 12 }}>{balance}</Text>
            </View>
          </View>
        </Pressable>
      ) : (
        <View style={{ width: 60 }} />
      )}
      <TopupConfirmationPopup reference={topupConfirmationRef} />
    </View>
  );
};

export default GeneralHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: themeColors.primary,
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
    height: 30,
    width: 30,
    resizeMode: "contain",
    tintColor: themeColors.white,
  },
  selectedSport: {
    color: "white",
  },
  backIcon: {
    height: 22,
    width: 22,
    resizeMode: "contain",
    tintColor: "white",
  },
});
