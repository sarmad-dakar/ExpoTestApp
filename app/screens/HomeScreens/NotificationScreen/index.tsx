import {
  FlatList,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef } from "react";
import GeneralHeader from "@/app/components/GeneralHeader";
import { themeColors } from "@/app/utils/theme";
import ScreenWrapper from "@/app/components/ScreenWrapper";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyNotifications } from "@/app/store/slices/accountSlice";
import moment from "moment";
import { icons } from "@/app/MyAssets";
import { vh } from "@/app/utils/units";
import ArchivoRegular from "@/app/components/TextWrapper/ArchivoRegular";
import ArchivoExtraLight from "@/app/components/TextWrapper/ArchivoExtraLight";
import PaymentWebviewPopup from "@/app/components/PaymentWebView";
import { ConfirmationPopupRef } from "@/app/components/ConfirmationPopup";

const NotificationScreen = () => {
  const dispatch = useDispatch();
  const notificationData = useSelector(
    (state) => state.account.notificationsData
  );
  const webviewRef = useRef<ConfirmationPopupRef>(null);
  useEffect(() => {
    dispatch(fetchMyNotifications());
  }, []);

  const onNotificationPress = (item) => {
    // Linking.openURL(item.link);
    console.log(item.link);
    webviewRef.current?.show(item.link);
  };

  const renderNotifications = ({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={5}
        onPress={() => onNotificationPress(item)}
        style={styles.card}
      >
        <ArchivoRegular style={styles.heading}>{item.heading}</ArchivoRegular>
        <ArchivoRegular style={styles.subheading}>
          {item.section}
        </ArchivoRegular>

        <ArchivoExtraLight style={styles.description}>
          {item.description}
        </ArchivoExtraLight>
        <Text style={styles.footerText}>
          {moment(item.date).format("DD MMM YYYY , hh:mm A")}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderEmptyComponenet = () => {
    return (
      <View style={{ alignItems: "center", marginTop: "40%" }}>
        <Image source={icons.inbox} style={styles.icon} />
        <ArchivoRegular
          style={{ fontSize: 18, marginTop: 5, color: themeColors.darkText }}
        >
          INBOX EMPTY
        </ArchivoRegular>
        <ArchivoExtraLight>
          Message is not present to display.
        </ArchivoExtraLight>
        <ArchivoExtraLight>Please check back later.</ArchivoExtraLight>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <GeneralHeader title="Notifications" back={true} />
      <ScreenWrapper>
        <FlatList
          data={notificationData}
          renderItem={renderNotifications}
          ListEmptyComponent={renderEmptyComponenet}
        />
      </ScreenWrapper>
      <PaymentWebviewPopup reference={webviewRef} />
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.white,
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
    color: themeColors.primary,
    fontSize: vh * 1.8,
  },
  subheading: {
    fontSize: vh * 1.5,
    marginBottom: 5,
  },
  footerText: {
    color: "#0008",
    marginTop: 5,
    fontSize: vh * 1,
  },
  bold: {
    fontWeight: "600",
  },
  icon: {
    height: vh * 10,
    width: vh * 10,
    resizeMode: "contain",
  },
  description: {
    fontSize: vh * 1.2,
  },
});
