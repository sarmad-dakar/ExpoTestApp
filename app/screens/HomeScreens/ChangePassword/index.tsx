import { StyleSheet, Text, View } from "react-native";
import React from "react";
import GeneralHeader from "@/app/components/GeneralHeader";
import ScreenWrapper from "@/app/components/ScreenWrapper";
import BerlingskeMedium from "@/app/components/TextWrapper/BerlingskeMedium";
import InputField from "@/app/components/InputField";
import { icons } from "@/app/MyAssets";
import MainButton from "@/app/components/MainButton";

const ChangePasswordScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <GeneralHeader title="Change Password" />
      <ScreenWrapper>
        <BerlingskeMedium style={styles.heading}>
          To change password please fill the below details.
        </BerlingskeMedium>
        <InputField
          placeholder="Old Password"
          icon={icons.lock}
          secureTextEntry={true}
        />
        <InputField
          placeholder="New Password"
          icon={icons.lock}
          secureTextEntry={true}
        />
        <InputField
          placeholder="Verify Password"
          icon={icons.lock}
          secureTextEntry={true}
        />
        <MainButton title="Change Password" style={styles.btn} />
      </ScreenWrapper>
    </View>
  );
};

export default ChangePasswordScreen;

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
