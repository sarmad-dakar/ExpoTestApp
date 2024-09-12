import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import LandingScreen from "../screens/HomeScreens/LandingScreen";
import { router } from "expo-router";

const index = () => {
  useEffect(() => {
    router.replace("/homestack");
  }, []);
  return <View />;
};

export default index;

const styles = StyleSheet.create({});
