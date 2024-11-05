import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import GeneralHeader from "@/app/components/GeneralHeader";
import BerlingskeBold from "@/app/components/TextWrapper/BerlingskeBold";
import { icons } from "@/app/MyAssets";
import { useLocalSearchParams } from "expo-router";
import { GetAlreadyBookedDetails } from "@/app/api/Bookings";
import { colors } from "@/app/utils/theme";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";

const DetailComponent = ({ label, value }: any) => {
  return (
    <View style={styles.container}>
      <BerlingskeBold style={styles.label}>
        {label} {value ? ":" : ","}{" "}
      </BerlingskeBold>
      <Text>{value}</Text>
    </View>
  );
};

const sportsIcon = {
  tennis: icons.tennis,
  squash: icons.squash,
  padel: icons.padel,
  snooker: icons.snooker,
  cricket: icons.cricket,
};

const AlreadyBookedDetails = () => {
  const bookingData = JSON.parse(useLocalSearchParams()?.bookingData);
  const [bookingDetails, setBookingDetails] = useState();
  const loading = useSelector(
    (state: RootState) => state.general.generalLoader
  );
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    let data = {
      id: bookingData.id,
      sport: bookingData.sport,
    };
    const response = await GetAlreadyBookedDetails(data);
    setBookingDetails(response.data.data);
  };
  return (
    <View style={{ flex: 1 }}>
      <GeneralHeader
        sport={{
          name: bookingData.sport,
          icon: sportsIcon[bookingData.sport],
        }}
        title="Booking Details"
        back={true}
      />
      {loading ? (
        <View style={{ alignSelf: "center", marginTop: 100 }}>
          <ActivityIndicator size={"large"} color={colors.secondary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
          {/* Booking Info */}
          <View style={[styles.rowDirection]}>
            <Image source={icons.clock} style={styles.logo} />
            <BerlingskeBold>Session</BerlingskeBold>
          </View>

          {bookingDetails && (
            <>
              <DetailComponent
                label="Booking"
                value={bookingDetails.bookingTitle}
              />
              <DetailComponent
                label="Booking Member"
                value={`${bookingDetails.bookingMember.bookingMemberName} (${bookingDetails.bookingMember.bookingMemberCode}) ${bookingDetails.bookingMember.bookingMemberStatus}`}
              />
              <DetailComponent
                label="Booking Type"
                value={bookingDetails.bookingType}
              />
              <DetailComponent
                label="Court Number"
                value={bookingDetails.bookingCourt}
              />
              <DetailComponent
                label="Court Date"
                value={bookingDetails.bookingSessionDate}
              />
              <DetailComponent
                label="Court Time"
                value={bookingDetails.bookingSessionTimeFrom}
              />

              {/* Players Info */}
              <View style={[styles.rowDirection, { marginTop: 20 }]}>
                <Image source={icons.group} style={styles.logo} />
                <BerlingskeBold>Players Info</BerlingskeBold>
              </View>
              <View style={[styles.rowDirection, { flexWrap: "wrap" }]}>
                {bookingDetails.players.map((player: any, index: number) => (
                  <View style={[styles.rowDirection, { margin: 5 }]}>
                    <Image
                      source={icons.defaultUser}
                      style={{
                        width: 15,
                        height: 15,
                        resizeMode: "contain",
                        marginRight: 10,
                      }}
                    />
                    <Text style={{ fontSize: 13 }} key={index}>
                      {player.bookingMemberName}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Payment Info */}
              <View style={[styles.rowDirection, { marginTop: 20 }]}>
                <Image source={icons.payments} style={styles.logo} />
                <BerlingskeBold>Booking & Payments</BerlingskeBold>
              </View>

              <DetailComponent
                label="Booked By"
                value={`${bookingDetails.bookingMember.bookingMemberName}`}
              />
              <DetailComponent
                label="Booked Date"
                value={bookingDetails.bookingDate}
              />
              <DetailComponent
                label="Booked Time"
                value={bookingDetails.bookingTime}
              />

              <View style={styles.tableContainer}>
                <View style={styles.tableHeader}>
                  <Text style={styles.tableHeaderText}>Name</Text>
                  <Text style={styles.tableHeaderText}>Booking Rate</Text>
                  <Text style={styles.tableHeaderText}>Receipt</Text>
                  <Text style={styles.tableHeaderText}>Payment Method</Text>
                </View>
                {bookingDetails.paymentPlayers.map(
                  (payment: any, index: number) => (
                    <View key={index} style={styles.tableRow}>
                      <Text style={styles.tableCell}>{payment.payerName}</Text>
                      <Text style={styles.tableCell}>
                        ${payment.bookingRate}
                      </Text>
                      <Text style={styles.tableCell}>
                        {payment.bookingReceipt}
                      </Text>
                      <Text style={styles.tableCell}>
                        {payment.paymentMethod}
                      </Text>
                    </View>
                  )
                )}
              </View>
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default AlreadyBookedDetails;

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderColor: "#0004",
    flexDirection: "row",
    alignItems: "center",
    height: 30,
  },
  label: {
    fontSize: 16,
    color: "black",
  },
  rowDirection: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    height: 25,
    width: 25,
    resizeMode: "contain",
    marginRight: 15,
    marginVertical: 10,
  },
  tableContainer: {
    marginVertical: 20,
    borderWidth: 1,
    borderColor: "#0004",
    borderRadius: 5,
  },
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary, // "#f0f0f0"
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 14,
    color: "white",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderColor: "#0002",
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
  },
});
