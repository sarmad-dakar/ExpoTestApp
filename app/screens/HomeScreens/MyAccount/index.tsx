import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import GeneralHeader from "@/app/components/GeneralHeader";
import SearchField from "@/app/components/SearchField";
import ScreenWrapper from "@/app/components/ScreenWrapper";
import { themeColors } from "@/app/utils/theme";
import { FetchMyBookings, GetAccountData } from "@/app/api/Bookings";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyAccount } from "@/app/store/slices/accountSlice";
import { router } from "expo-router";
import { useAppDispatch } from "../LandingScreen";
import { RootState } from "@/app/store";
import { vh } from "@/app/utils/units";
import ArchivoRegular from "@/app/components/TextWrapper/ArchivoRegular";
import { useTheme } from "@react-navigation/native";

interface AccountData {
  date: string;
  transactionNumber: string;
  section: string;
  category: string;
  remarks: string;
  amount: string;
}

const MyAccountScreen = () => {
  // const [accountData, setAccountData] = useState<AccountData[]>([]);
  const accountData = useSelector((state: any) => state.account.accountData);
  const windowWidth = Dimensions.get("window").width;
  const dispatch = useAppDispatch();
  const loading = useSelector(
    (state: RootState) => state.general.generalLoader
  );
  const styles = MyStyles();
  useEffect(() => {
    dispatch(fetchMyAccount());
  }, []);

  const onDetailPress = (item: any) => {
    // router.navigate("navigationstack/accountdetails");
    let data = {
      id: item?.bookingKey,
      sport: item?.section.toUpperCase(),
    };
    router.push({
      //@ts-ignore
      pathname: "/navigationstack/accountdetails",
      params: {
        bookingData: JSON.stringify(data),
      }, // Use if you have any URL params to send (optional)
    });
  };

  const onRecieptPress = (item: any) => {
    router.push({
      //@ts-ignore
      pathname: "/navigationstack/accountreciept",
      params: {
        recieptData: JSON.stringify(item),
      }, // Use if you have any URL params to send (optional)
    });
  };

  return (
    <View style={styles.container}>
      <GeneralHeader back={true} title="My Account" />
      {/* Fixed Header */}
      <ScreenWrapper>
        {/* <SearchField /> */}

        {/* Scrollable Content */}
        <View style={{ flex: 0.95 }}>
          <ScrollView horizontal>
            {/* Data Rows - Vertical Scroll */}
            <ScrollView style={{ marginTop: 15 }}>
              <View style={[styles.headerRow]}>
                <Text style={[styles.headerText, { width: 150 }]}>Date</Text>
                <View style={styles.rowDirection}>
                  <View style={styles.whiteDivider} />
                  <Text style={[styles.headerText, { width: 100 }]}>
                    Transaction #
                  </Text>
                </View>
                <View style={styles.rowDirection}>
                  <View style={styles.whiteDivider} />
                  <Text style={[styles.headerText, { width: 100 }]}>
                    Section
                  </Text>
                </View>
                <View style={styles.rowDirection}>
                  <View style={styles.whiteDivider} />
                  <Text style={[styles.headerText, { width: 120 }]}>
                    Category
                  </Text>
                </View>
                <View style={styles.rowDirection}>
                  <View style={styles.whiteDivider} />
                  <Text style={[styles.headerText, { width: 220 }]}>
                    Remarks
                  </Text>
                </View>
                <View style={styles.rowDirection}>
                  <View style={styles.whiteDivider} />
                  <Text style={[styles.headerText, { width: 80 }]}>Amount</Text>
                </View>
                <View style={styles.rowDirection}>
                  <View style={styles.whiteDivider} />
                  <Text style={[styles.headerText, { width: 120 }]}>
                    Action
                  </Text>
                </View>
              </View>
              {loading ? (
                <View style={{ alignSelf: "center" }}>
                  <ActivityIndicator
                    size={"large"}
                    color={themeColors.secondary}
                  />
                </View>
              ) : (
                accountData.map((item, index) => (
                  <View
                    key={index}
                    style={[
                      styles.row,
                      {
                        backgroundColor:
                          index % 2 !== 0 ? "white" : themeColors.lightShade,
                      },
                    ]}
                  >
                    <ArchivoRegular style={[styles.cell, { width: 150 }]}>
                      {item.date}
                    </ArchivoRegular>
                    <View style={styles.rowDirection}>
                      <View style={styles.divider} />
                      <ArchivoRegular style={[styles.cell, { width: 100 }]}>
                        {item.transactionNumber}
                      </ArchivoRegular>
                    </View>
                    <View style={styles.rowDirection}>
                      <View style={styles.divider} />
                      <ArchivoRegular style={[styles.cell, { width: 100 }]}>
                        {item.section}
                      </ArchivoRegular>
                    </View>
                    <View style={styles.rowDirection}>
                      <View style={styles.divider} />
                      <ArchivoRegular style={[styles.cell, { width: 120 }]}>
                        {item.category}
                      </ArchivoRegular>
                    </View>
                    <View style={styles.rowDirection}>
                      <View style={styles.divider} />
                      <ArchivoRegular style={[styles.cell, { width: 220 }]}>
                        {item.remarks}
                      </ArchivoRegular>
                    </View>
                    <View style={styles.rowDirection}>
                      <View style={styles.divider} />
                      <ArchivoRegular style={[styles.cell, { width: 80 }]}>
                        {item.amount}
                      </ArchivoRegular>
                    </View>
                    <View style={styles.rowDirection}>
                      <View style={styles.divider} />
                      <TouchableOpacity
                        disabled={!item?.bookingKey}
                        onPress={() => onDetailPress(item)}
                      >
                        <ArchivoRegular
                          style={[
                            styles.cell,
                            {
                              width: 120,
                              textDecorationLine: "underline",
                              color: !item.bookingKey ? "gray" : "#0000EE",
                            },
                          ]}
                        >
                          View Details
                        </ArchivoRegular>
                      </TouchableOpacity>
                    </View>
                    {/* <TouchableOpacity onPress={() => onRecieptPress(item)}>
                  <Text
                    style={[
                      styles.cell,
                      {
                        width: 120,
                        textDecorationLine: "underline",
                        color: "#0000EE",
                      },
                    ]}
                  >
                    View Reciept
                  </Text>
                </TouchableOpacity> */}
                  </View>
                ))
              )}
            </ScrollView>
          </ScrollView>
        </View>
      </ScreenWrapper>
    </View>
  );
};

export default MyAccountScreen;

const MyStyles = () => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.white,
    },
    headerRow: {
      flexDirection: "row",
      backgroundColor: colors.primary,
    },
    headerText: {
      color: "#fff",
      fontWeight: "bold",
      textAlign: "left",
      paddingVertical: 10,
      paddingLeft: 10,
      // borderWidth: 0.5,
      // borderColor: "#fff",
      fontSize: vh * 1.5,
      backgroundColor: colors.primary,
    },
    row: {
      flexDirection: "row",
      height: 40,
      alignItems: "center",
      // borderBottomWidth: 1,
      // borderColor: "#ccc",
    },
    cell: {
      textAlign: "left",
      fontSize: vh * 1.4,
      paddingLeft: 10,
      color: themeColors.darkText,
    },
    rowDirection: {
      flexDirection: "row",
      alignItems: "center",
    },
    divider: {
      height: 10,
      width: 1,
      backgroundColor: "gray",
    },
    whiteDivider: {
      height: 10,
      width: 1,
      backgroundColor: "white",
    },
  });
  return styles;
};
