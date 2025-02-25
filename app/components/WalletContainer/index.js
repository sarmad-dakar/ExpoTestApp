import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import { icons, images } from "../../MyAssets/index";
import ArchivoRegular from "../../components/TextWrapper/ArchivoRegular";
import { vh } from "@/app/utils/units";
import ArchivoMedium from "../TextWrapper/ArchivoMedium";

const WalletContainer = () => {
  const balance = useSelector((state) => state.account.balance);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#585F55",
        paddingHorizontal: 5,
        paddingVertical: 5,
        borderRadius: 5,
        borderBottomWidth: 1,
        borderColor: "#ffffff2e",
        shadowColor: "white",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 4,
      }}
    >
      <Image
        source={icons.euro3}
        style={{
          width: vh * 1.5,
          height: vh * 1.5,
          resizeMode: "contain",
          marginRight: 2,
          tintColor: "white",
        }}
      />
      <ArchivoMedium style={{ color: "white", fontSize: vh * 1.5 }}>
        {balance ? balance?.toFixed(2) : "0"}
      </ArchivoMedium>
      <Image
        source={icons.upArrow}
        style={{
          width: vh * 1.5,
          height: vh * 1.5,
          resizeMode: "contain",
          tintColor: "white",
          marginLeft: 4,
        }}
      />
    </View>
  );
};

export default WalletContainer;
