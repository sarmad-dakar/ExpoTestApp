import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { router, Stack } from "expo-router";
import { useSelector } from "react-redux";

const HomeLayout = () => {
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    console.log("ss");

    if (!user) {
      console.log("logged?");
      router.replace("/(navigations)");
    }
  }, [user]);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="bookingdetail" options={{ headerShown: false }} />
      <Stack.Screen name="notifications" options={{ headerShown: false }} />

      <Stack.Screen name="test" options={{ headerShown: false }} />
    </Stack>
  );
};

export default HomeLayout;

const styles = StyleSheet.create({});
