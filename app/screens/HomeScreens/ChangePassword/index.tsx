import React, { useState } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
import GeneralHeader from "@/app/components/GeneralHeader";
import ScreenWrapper from "@/app/components/ScreenWrapper";
import BerlingskeMedium from "@/app/components/TextWrapper/BerlingskeMedium";
import InputField from "@/app/components/InputField";
import { icons } from "@/app/MyAssets";
import MainButton from "@/app/components/MainButton";
import { changePassword } from "@/app/api/Auth";
import { useSelector } from "react-redux";
import { showErrorToast, showSuccessToast } from "@/app/utils/toastmsg";
import { RootState } from "@/app/store";

const ChangePasswordScreen = () => {
  // State for input fields
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const loading = useSelector(
    (state: RootState) => state.general.generalLoader
  );
  // Handler for changing the password
  const handleChangePassword = async () => {
    // Validate the inputs
    if (!oldPassword || !newPassword || !verifyPassword) {
      showErrorToast("All fields are required.");
      return;
    }
    if (newPassword !== verifyPassword) {
      showErrorToast("New password and verify password must match.");

      return;
    }

    let data = {
      NewPassword: newPassword,
      OldPassword: oldPassword,
    };
    const response = await changePassword(data);
    if (response.data.msgCode == "500") {
      showErrorToast(response.data.data);
    }
    if (response.data.msgCode == "200") {
      showSuccessToast(response.data.data);
    }
    // Call an API or perform an action with oldPassword and newPassword
    // For example purposes, we show an alert

    // Reset fields
    setOldPassword("");
    setNewPassword("");
    setVerifyPassword("");
  };

  return (
    <View style={{ flex: 1 }}>
      <GeneralHeader title="Change Password" back={true} />
      <ScreenWrapper>
        <BerlingskeMedium style={styles.heading}>
          To change password please fill the below details.
        </BerlingskeMedium>
        <InputField
          placeholder="Old Password"
          icon={icons.lock}
          secureTextEntry={true}
          value={oldPassword}
          onChangeText={setOldPassword}
        />
        <InputField
          placeholder="New Password"
          icon={icons.lock}
          secureTextEntry={true}
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <InputField
          placeholder="Verify Password"
          icon={icons.lock}
          secureTextEntry={true}
          value={verifyPassword}
          onChangeText={setVerifyPassword}
        />
        <MainButton
          title="Change Password"
          style={styles.btn}
          onPress={handleChangePassword}
          loading={loading}
        />
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
    fontSize: 18,
  },
  btn: {
    marginTop: 40,
  },
});
