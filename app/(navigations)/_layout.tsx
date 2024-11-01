import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const MainNavigation = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="forgotpassword" options={{ headerShown: false }} />
      <Stack.Screen name="privacypolicy" options={{ headerShown: false }} />
      <Stack.Screen name="termscondition" options={{ headerShown: false }} />

    </Stack>
  );
};

export default MainNavigation;

const styles = StyleSheet.create({});
