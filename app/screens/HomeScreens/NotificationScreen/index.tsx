import {
  FlatList,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import GeneralHeader from "@/app/components/GeneralHeader";
import { colors } from "@/app/utils/theme";
import ScreenWrapper from "@/app/components/ScreenWrapper";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyNotifications } from "@/app/store/slices/accountSlice";
import moment from "moment";

const NotificationScreen = () => {
  const dispatch = useDispatch();
  const notificationData = useSelector(
    (state) => state.account.notificationsData
  );
  console.log(notificationData, "notifications data");
  useEffect(() => {
    dispatch(fetchMyNotifications());
  }, []);

  const onNotificationPress = (item) => {
    Linking.openURL(item.link);
  };

  const renderNotifications = ({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={5}
        onPress={() => onNotificationPress(item)}
        style={styles.card}
      >
        <Text style={styles.heading}>{item.heading}</Text>
        <Text style={styles.subheading}>{item.section}</Text>

        <Text>{item.description}</Text>
        <Text style={styles.footerText}>
          {moment(item.date).format("DD MMM YYYY , hh:mm A")}
        </Text>
      </TouchableOpacity>
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
    fontWeight: "600",
  },
  subheading: {
    fontSize: 14,
    marginBottom: 5,
  },
  footerText: {
    color: "#0008",
    marginTop: 5,
  },
  bold: {
    fontWeight: "600",
  },
});
