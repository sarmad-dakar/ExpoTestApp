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
import { colors } from "@/app/utils/theme";
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
    if (!back) {
      topupConfirmationRef.current?.show();
    }
  };

  return (
    <View style={styles.container}>
      {back ? (
        <TouchableOpacity onPress={() => router.back()}>
          <Image source={icons.back} style={styles.backIcon} />
        </TouchableOpacity>
      ) : (
        <View style={{ alignItems: "center", width: 60 }}>
          {sport?.icon ? (
            <Image
              source={sport?.icon}
              style={[styles.logo, { tintColor: colors.secondary }]}
            />
          ) : null}
          {sport?.icon ? (
            <Text style={[styles.selectedSport, { color: colors.secondary }]}>
              {sport?.name || "Tennis"}
            </Text>
          ) : null}
        </View>
      )}
      <BerlingskeMedium style={styles.selectedSport}>{title}</BerlingskeMedium>
      <Pressable
        onPress={handlePress}
        style={{
          width: back ? 22 : 60,
          height: 50,
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        {!back ? (
          <Image
            source={icons.euro}
            style={{
              width: 17,
              height: 17,
              resizeMode: "contain",
              marginRight: 5,
              tintColor: "white",
            }}
          />
        ) : null}
        {!back ? (
          <Text style={{ color: "white", fontSize: 12 }}>{balance}</Text>
        ) : null}
      </Pressable>
      <TopupConfirmationPopup reference={topupConfirmationRef} />
    </View>
  );
};

export default GeneralHeader;

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
  backIcon: {
    height: 22,
    width: 22,
    resizeMode: "contain",
    tintColor: "white",
  },
});
