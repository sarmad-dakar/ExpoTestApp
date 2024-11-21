import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import GeneralHeader from "@/app/components/GeneralHeader";
import SearchField from "@/app/components/SearchField";
import ScreenWrapper from "@/app/components/ScreenWrapper";
import { colors } from "@/app/utils/theme";
import { GetAccountData, GetSubscriptionData } from "@/app/api/Bookings";
import { useDispatch, useSelector } from "react-redux";
import { fetchMySubscription } from "@/app/store/slices/accountSlice";
import { vh } from "@/app/utils/units";

interface SubscriptionData {
  date: string;
  type: string;
  invoiceNo: string;
  details: string;
  dueAmount: string;
  paidAmount: string;
}

const MySubscriptionScreen = () => {
  const subscriptionData = useSelector(
    (state) => state.account.subscriptionData
  );

  console.log(subscriptionData, "subscription Datt");
  const dispatch = useDispatch();
  const windowWidth = Dimensions.get("window").width;

  useEffect(() => {
    dispatch(fetchMySubscription());
  }, []);

  return (
    <View style={styles.container}>
      <GeneralHeader title="My Subscription" back={true} />
      {/* Fixed Header */}
      <ScreenWrapper>
        {/* <SearchField /> */}

        {/* Scrollable Content */}
        <ScrollView horizontal>
          {/* Data Rows - Vertical Scroll */}
          <ScrollView style={{ marginTop: 15 }}>
            <View style={[styles.headerRow]}>
              <Text style={[styles.headerText, { width: 150 }]}>Date</Text>
              <View style={styles.rowDirection}>
                <View style={styles.whiteDivider} />
                <Text style={[styles.headerText, { width: 100 }]}>Type</Text>
              </View>
              <View style={styles.rowDirection}>
                <View style={styles.whiteDivider} />
                <Text style={[styles.headerText, { width: 100 }]}>
                  Invoice #
                </Text>
              </View>
              <View style={styles.rowDirection}>
                <View style={styles.whiteDivider} />
                <Text style={[styles.headerText, { width: 140 }]}>Details</Text>
              </View>
              <View style={styles.rowDirection}>
                <View style={styles.whiteDivider} />
                <Text style={[styles.headerText, { width: 120 }]}>
                  Amount Due
                </Text>
              </View>
              <View style={styles.rowDirection}>
                <View style={styles.whiteDivider} />
                <Text style={[styles.headerText, { width: 120 }]}>
                  Amount Paid
                </Text>
              </View>
            </View>
            {subscriptionData.map((item, index) => (
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
                <View style={styles.rowDirection}>
                  <View style={styles.divider} />
                  <Text style={[styles.cell, { width: 100 }]}>{item.type}</Text>
                </View>
                <View style={styles.rowDirection}>
                  <View style={styles.divider} />
                  <Text style={[styles.cell, { width: 100 }]}>
                    {item.invoiceNo}
                  </Text>
                </View>
                <View style={styles.rowDirection}>
                  <View style={styles.divider} />
                  <Text style={[styles.cell, { width: 140 }]}>
                    {item.details}
                  </Text>
                </View>
                <View style={styles.rowDirection}>
                  <View style={styles.divider} />
                  <Text style={[styles.cell, { width: 120 }]}>
                    {item.dueAmount}
                  </Text>
                </View>
                <View style={styles.rowDirection}>
                  <View style={styles.divider} />
                  <Text style={[styles.cell, { width: 120 }]}>
                    {item.paidAmount}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </ScrollView>
      </ScreenWrapper>
    </View>
  );
};

export default MySubscriptionScreen;

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
    textAlign: "left",
    paddingVertical: 10,
    paddingLeft: 10,
    fontSize: 12,
    backgroundColor: colors.primary,
  },
  row: {
    flexDirection: "row",
    height: 30,
    alignItems: "center",
  },
  cell: {
    textAlign: "left",
    fontSize: 12,
    paddingLeft: 10,
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
