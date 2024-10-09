import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import GeneralHeader from "@/app/components/GeneralHeader";
import { colors } from "@/app/utils/theme";
import ScreenWrapper from "@/app/components/ScreenWrapper";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyNotifications } from "@/app/store/slices/bookingSlice";
import moment from "moment";

const NotificationScreen = () => {
  const dispatch = useDispatch();
  const notificationData = useSelector(
    (state) => state.booking.notificationsData
  );
  console.log(notificationData, "notifications data");
  useEffect(() => {
    dispatch(fetchMyNotifications());
  }, []);

  const renderNotifications = ({ item }) => {
    return (
      <View style={styles.card}>
        <Text style={styles.heading}>{item.heading}</Text>

        <Text>{item.description}</Text>
        <Text style={styles.footerText}>
          {moment(item.date).format("DD MMM YYYY , hh:mm A")}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <GeneralHeader title="Notifications" back={true} />
      <ScreenWrapper>
        <FlatList data={notificationData} renderItem={renderNotifications} />
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
