import { Tabs } from "expo-router";
import React from "react";
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

const MyTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.centralBar}>
        <View style={styles.circle}>
          <Image source={images.AppLogov3} style={styles.logo} />
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
                { tintColor: isFocused ? themeColors.green : "black" },
              ]}
              source={options.tabBarIcon}
            />
            <Text
              style={{
                color: isFocused ? themeColors.green : "black",
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

  return (
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
        options={{ title: "Notifications", tabBarIcon: icons.notificationIcon }}
      />
      <Tabs.Screen
        name="navigationstack"
        options={{ title: "Menu", tabBarIcon: icons.hamburger }}
      />
    </Tabs>
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
});
