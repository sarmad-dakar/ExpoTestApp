import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { vh } from "../utils/units";
import { themeColors } from "../utils/theme";
import { icons } from "../MyAssets";
import BerlingskeMedium from "../components/TextWrapper/BerlingskeMedium";
import ArchivoMedium from "../components/TextWrapper/ArchivoMedium";

const MainNavigation = () => {
  const isInternetConnected = useSelector(
    (state: RootState) => state.general.internetConnectivity
  );
  console.log(isInternetConnected, "value of internet");
  return (
    <View style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="clublisting" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />

        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="forgotpassword" options={{ headerShown: false }} />
        <Stack.Screen name="privacypolicy" options={{ headerShown: false }} />
        <Stack.Screen name="termscondition" options={{ headerShown: false }} />
      </Stack>
      {!true ? (
        <View style={styles.netModal}>
          <Image source={icons.wifi} style={styles.wifiIcon} />
          <BerlingskeMedium style={styles.connectionError}>
            Connection Error
          </BerlingskeMedium>
          <ArchivoMedium style={styles.noConnection}>
            Please check your network connectivity and try again
          </ArchivoMedium>
        </View>
      ) : null}
    </View>
  );
};

export default MainNavigation;

const styles = StyleSheet.create({
  netModal: {
    height: vh * 105,
    backgroundColor: "white",
    width: "100%",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  wifiIcon: {
    height: vh * 15,
    width: vh * 15,
    resizeMode: "contain",
  },
  noConnection: {
    fontSize: vh * 2,
    textAlign: "center",
    paddingHorizontal: 50,
  },
  connectionError: {
    color: themeColors.red,
    fontSize: vh * 3,
  },
});
