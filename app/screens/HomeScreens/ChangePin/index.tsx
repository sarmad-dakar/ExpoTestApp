import { StyleSheet, Text, View } from "react-native";
import React from "react";
import GeneralHeader from "@/app/components/GeneralHeader";
import ScreenWrapper from "@/app/components/ScreenWrapper";
import BerlingskeMedium from "@/app/components/TextWrapper/BerlingskeMedium";
import InputField from "@/app/components/InputField";
import { icons } from "@/app/MyAssets";
import MainButton from "@/app/components/MainButton";

const ChangePinScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <GeneralHeader title="Change Pin" />
      <ScreenWrapper>
        <BerlingskeMedium style={styles.heading}>
          To change password please fill the below details.
        </BerlingskeMedium>
        <InputField
          placeholder="Old Pin"
          icon={icons.lock}
          secureTextEntry={true}
        />
        <InputField
          placeholder="New Pin"
          icon={icons.lock}
          secureTextEntry={true}
        />
        <InputField
          placeholder="Verify Pin"
          icon={icons.lock}
          secureTextEntry={true}
        />
        <MainButton title="Change Pin" style={styles.btn} />
      </ScreenWrapper>
    </View>
  );
};

export default ChangePinScreen;

const styles = StyleSheet.create({
  heading: {
    textAlign: "center",
    width: "80%",
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 20,
    fontSize: 24,
  },
  btn: {
    marginTop: 40,
  },
});
