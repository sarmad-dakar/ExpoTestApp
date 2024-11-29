import { DarkTheme, Theme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import Toast from "react-native-toast-message";
import NetInfo from "@react-native-community/netinfo";

import { useColorScheme } from "@/hooks/useColorScheme";
import { Image, StatusBar, StyleSheet, Text, View } from "react-native";
import { Provider, useSelector } from "react-redux";
import { RootState, store } from "./store";
import { icons } from "./MyAssets";
import { vh } from "./utils/units";
import BerlingskeMedium from "./components/TextWrapper/BerlingskeMedium";
import ArchivoMedium from "./components/TextWrapper/ArchivoMedium";
import { themeColors } from "./utils/theme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [condition, setCondition] = useState(false);

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.allowFontScaling = false;
  Text.defaultProps.adjustsFontSizeToFit = false;

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <StatusBar
        translucent={true}
        barStyle={"light-content"}
        backgroundColor="transparent"
      />
      <MyApp />
    </Provider>
  );
}

const MyApp = () => {
  const colorScheme = useColorScheme();
  const club = useSelector((state: RootState) => state.general.clubConfig);
  const [defaultTheme, setDefaultTheme] = useState({
    dark: false,
    colors: {
      primary: themeColors.primary,
      background: "white",
      card: themeColors.secondary,
      text: "rgb(28, 28, 30)",
      border: "rgb(216, 216, 216)",
      notification: "rgb(255, 59, 48)",
      secondary: themeColors.secondary,
    },
  });

  useEffect(() => {
    if (club?.primaryColorCode) {
      
      let data = {
        dark: false,
        colors: {
          primary: club.primaryColorCode,
          background: "white",
          card: club.secondary,
          text: "rgb(28, 28, 30)",
          border: "rgb(216, 216, 216)",
          notification: "rgb(255, 59, 48)",
          secondary: club.secondaryColorCode,
        },
      };
      setDefaultTheme(data);
    }
  }, [club]);

  return (
    <ThemeProvider value={defaultTheme}>
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <Stack initialRouteName="(navigations)">
          <Stack.Screen name="(navigations)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        {/* {!isInternetConnected ? (
        <View style={styles.netModal}>
          <Image source={icons.wifi} style={styles.wifiIcon} />
          <BerlingskeMedium style={styles.connectionError}>
            Connection Error
          </BerlingskeMedium>
          <ArchivoMedium style={styles.noConnection}>
            Please check your network connectivity and try again
          </ArchivoMedium>
        </View>
      ) : null} */}
        <Toast />
      </View>
    </ThemeProvider>
  );
};

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
