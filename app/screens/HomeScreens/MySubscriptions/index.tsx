import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import GeneralHeader from "@/app/components/GeneralHeader";
import SearchField from "@/app/components/SearchField";
import ScreenWrapper from "@/app/components/ScreenWrapper";
import { colors } from "@/app/utils/theme";
import { GetAccountData, GetSubscriptionData } from "@/app/api/Bookings";
import { useDispatch, useSelector } from "react-redux";
import { fetchMySubscription } from "@/app/store/slices/bookingSlice";

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
    (state) => state.booking.subscriptionData
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
        <SearchField />

        {/* Scrollable Content */}
        <ScrollView horizontal>
          {/* Data Rows - Vertical Scroll */}
          <ScrollView style={{ marginTop: 0 }}>
            <View style={[styles.headerRow, { width: windowWidth }]}>
              <Text style={[styles.headerText, { width: 150 }]}>Date</Text>
              <Text style={[styles.headerText, { width: 100 }]}>Type</Text>
              <Text style={[styles.headerText, { width: 100 }]}>Invoice #</Text>
              <Text style={[styles.headerText, { width: 140 }]}>Details</Text>
              <Text style={[styles.headerText, { width: 120 }]}>
                Amount Due
              </Text>
              <Text style={[styles.headerText, { width: 120 }]}>
                Amount Paid
              </Text>
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
                <Text style={[styles.cell, { width: 100 }]}>{item.type}</Text>
                <Text style={[styles.cell, { width: 100 }]}>
                  {item.invoiceNo}
                </Text>
                <Text style={[styles.cell, { width: 140 }]}>
                  {item.details}
                </Text>
                <Text style={[styles.cell, { width: 120 }]}>
                  {item.dueAmount}
                </Text>
                <Text style={[styles.cell, { width: 120 }]}>
                  {item.paidAmount}
                </Text>
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
    textAlign: "center",
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#fff",
    fontSize: 12,
    backgroundColor: colors.primary,
  },
  row: {
    flexDirection: "row",
    height: 30,
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  cell: {
    textAlign: "center",
    fontSize: 12,
  },
});
