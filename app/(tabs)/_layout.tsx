import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { vh, vw } from "../utils/units";
import { icons, images } from "../MyAssets";
import { themeColors } from "../utils/theme";
import NetInfo from "@react-native-community/netinfo";
import { useAppDispatch } from "../screens/HomeScreens/LandingScreen";
import { toggletInternet } from "../store/slices/generalSlice";
import { RootState } from "../store";
import { useSelector } from "react-redux";
import BerlingskeMedium from "../components/TextWrapper/BerlingskeMedium";
import ArchivoMedium from "../components/TextWrapper/ArchivoMedium";

const MyTabBar = ({ state, descriptors, navigation }) => {
  const store = useSelector((state: RootState) => state.general.clubConfig);

  return (
    <View style={styles.container}>
      <View style={styles.centralBar}>
        <View style={styles.circle}>
          <Image source={{ uri: store?.smallLogo }} style={styles.logo} />
        </View>
      </View>

      {state.routes.slice(0, 4).map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tab}
          >
            <Image
              style={[
                styles.icon,
                { tintColor: isFocused ? themeColors.primary : "black" },
              ]}
              source={options.tabBarIcon}
            />
            <Text
              style={{
                color: isFocused ? themeColors.primary : "black",
                fontSize: vh * 1.2,
              }}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const dispatch = useAppDispatch();
  const isInternetConnected = useSelector(
    (state: RootState) => state.general.internetConnectivity
  );
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      dispatch(toggletInternet(state?.isConnected));
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        tabBar={(props) => <MyTabBar {...props} />}
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "white",
            height: 60,
          },
        }}
      >
        <Tabs.Screen
          name="homestack"
          options={{ title: "Home", tabBarIcon: icons.home }}
        />
        <Tabs.Screen
          name="bookingstack"
          options={{ title: "My Bookings", tabBarIcon: icons.calendar }}
        />
        <Tabs.Screen
          name="notifications"
          options={{
            title: "Notifications",
            tabBarIcon: icons.notificationIcon,
          }}
        />
        <Tabs.Screen
          name="navigationstack"
          options={{ title: "Menu", tabBarIcon: icons.hamburger }}
        />
      </Tabs>
      {!isInternetConnected ? (
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
}

const styles = StyleSheet.create({
  container: {
    height: vh * 8,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    alignSelf: "center",

    // paddingHorizontal: 10,
  },
  tab: {
    // width: vw * 20,
    // marginHorizontal: Platform.OS == "android" ? 10 : 18,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: vh * 2.2,
    height: vh * 2.2,
    resizeMode: "contain",
    marginBottom: 5,
  },
  centralBar: {
    position: "absolute",
    height: "100%",
    width: "85%",
    alignSelf: "center",
  },
  circle: {
    width: vh * 6.5,
    height: vh * 6.5,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
    alignSelf: "center",
    top: "-48%",
    borderRadius: vh * 20,
    borderWidth: 0.7,
    borderColor: "#0003",
    // padding: "3%",
  },
  logo: {
    width: "70%",
    height: "70%",
    resizeMode: "contain",
    zIndex: 10,
  },
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
