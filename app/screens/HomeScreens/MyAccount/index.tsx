import {
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
import { colors } from "@/app/utils/theme";
import { FetchMyBookings, GetAccountData } from "@/app/api/Bookings";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyAccount } from "@/app/store/slices/accountSlice";
import { router } from "expo-router";
import { useAppDispatch } from "../LandingScreen";

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
      pathname: "/bookingstack/alreadybookeddetail",
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
        <ScrollView horizontal>
          {/* Data Rows - Vertical Scroll */}
          <ScrollView style={{ marginTop: 13 }}>
            <View style={[styles.headerRow, { width: windowWidth }]}>
              <Text style={[styles.headerText, { width: 150 }]}>Date</Text>
              <Text style={[styles.headerText, { width: 100 }]}>
                Transaction #
              </Text>
              <Text style={[styles.headerText, { width: 100 }]}>Section</Text>
              <Text style={[styles.headerText, { width: 120 }]}>Category</Text>
              <Text style={[styles.headerText, { width: 220 }]}>Remarks</Text>
              <Text style={[styles.headerText, { width: 80 }]}>Amount</Text>
            </View>
            {accountData.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.row,
                  {
                    backgroundColor:
                      index % 2 !== 0 ? "white" : colors.lightShade,
                  },
                ]}
              >
                <Text style={[styles.cell, { width: 150 }]}>{item.date}</Text>
                <Text style={[styles.cell, { width: 100 }]}>
                  {item.transactionNumber}
                </Text>
                <Text style={[styles.cell, { width: 100 }]}>
                  {item.section}
                </Text>
                <Text style={[styles.cell, { width: 120 }]}>
                  {item.category}
                </Text>
                <Text style={[styles.cell, { width: 220 }]}>
                  {item.remarks}
                </Text>
                <Text style={[styles.cell, { width: 80 }]}>{item.amount}</Text>
                <TouchableOpacity
                  disabled={!item?.bookingKey}
                  onPress={() => onDetailPress(item)}
                >
                  <Text
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
                  </Text>
                </TouchableOpacity>
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
            ))}
          </ScrollView>
        </ScrollView>
      </ScreenWrapper>
    </View>
  );
};

export default MyAccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: colors.primary,
  },
  headerText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#fff",
    fontSize: 12,
    backgroundColor: colors.primary,
  },
  row: {
    flexDirection: "row",
    height: 40,
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  cell: {
    textAlign: "center",
    fontSize: 12,
  },
});
