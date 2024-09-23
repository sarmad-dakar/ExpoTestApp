import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import GeneralHeader from "@/app/components/GeneralHeader";
import { colors } from "@/app/utils/theme";
import ScreenWrapper from "@/app/components/ScreenWrapper";

const NotificationScreen = () => {
  const renderNotifications = () => {
    return (
      <View style={styles.card}>
        <Text style={styles.heading}>Continue Payment</Text>

        <Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore....
        </Text>
        <Text style={styles.footerText}>
          Monday, 29th July 2024, 05:30 PM-Court 5
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <GeneralHeader title="Notifications" back={true} />
      <ScreenWrapper>
        <FlatList data={[1, 2, 3, 4, 5, 6]} renderItem={renderNotifications} />
      </ScreenWrapper>
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  card: {
    borderWidth: 1,
    padding: 15,
    marginTop: 20,
    borderRadius: 15,
    borderColor: "#0004",
    backgroundColor: "white",
  },
  heading: {
    marginBottom: 15,
    fontWeight: "600",
  },
  footerText: {
    color: "#0008",
    marginTop: 10,
  },
  bold: {
    fontWeight: "600",
  },
});
