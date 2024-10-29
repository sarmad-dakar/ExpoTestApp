import { StyleSheet, Text, View } from "react-native";
import React from "react";
import GeneralHeader from "@/app/components/GeneralHeader";
import BerlingskeBold from "@/app/components/TextWrapper/BerlingskeBold";
import { useLocalSearchParams } from "expo-router";

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

const AccountRecieptScreen = () => {
  const recieptData = JSON.parse(useLocalSearchParams().recieptData);

  return (
    <View style={{ flex: 1 }}>
      <GeneralHeader title="Booking Details" />
      <DetailComponent
        label="Transaction #"
        value={recieptData?.transactionNumber}
      />
      <DetailComponent label="Section" value={recieptData?.section || "-"} />
      <DetailComponent label="Category" value={recieptData?.category} />
      <DetailComponent label="Remarks" value={recieptData?.remarks} />
      <DetailComponent label="Amount" value={recieptData?.amount} />
    </View>
  );
};

export default AccountRecieptScreen;

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
});
