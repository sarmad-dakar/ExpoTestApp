import { StyleSheet, Text, View } from "react-native";
import React from "react";
import GeneralHeader from "@/app/components/GeneralHeader";
import BerlingskeMedium from "@/app/components/TextWrapper/BerlingskeMedium";
import ScreenWrapper from "@/app/components/ScreenWrapper";

const TermsConditionScreen = () => {
  return (
    <View style={styles.container}>
      <GeneralHeader title="Terms & Conditions" back={true} />
      <ScreenWrapper>
        <BerlingskeMedium style={styles.heading}>
          What is Lorem Ipsum?
        </BerlingskeMedium>
        <Text>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. {"\n\n"} It has survived
          not only five centuries, but also the leap into electronic
          typesetting, remaining essentially unchanged. It was popularised in
          the 1960s with the release of Letraset sheets containing Lorem Ipsum
          passages, and more recently with desktop publishing software like
          Aldus PageMaker including versions of Lorem Ipsum.
        </Text>
        <BerlingskeMedium style={styles.heading}>
          What is Lorem Ipsum?
        </BerlingskeMedium>
        <Text>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. {"\n\n"} It has survived
          not only five centuries, but also the leap into electronic
          typesetting, remaining essentially unchanged. It was popularised in
          the 1960s with the release of Letraset sheets containing Lorem Ipsum
          passages, and more recently with desktop publishing software like
          Aldus PageMaker including versions of Lorem Ipsum.
        </Text>
      </ScreenWrapper>
    </View>
  );
};

export default TermsConditionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    fontWeight: "bold",
    fontSize: 22,
    marginTop: 20,
    marginBottom: 10,
  },
});
