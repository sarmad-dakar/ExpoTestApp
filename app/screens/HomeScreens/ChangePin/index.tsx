import React, { useState } from "react";
import { StyleSheet, View, Alert } from "react-native";
import GeneralHeader from "@/app/components/GeneralHeader";
import ScreenWrapper from "@/app/components/ScreenWrapper";
import BerlingskeMedium from "@/app/components/TextWrapper/BerlingskeMedium";
import InputField from "@/app/components/InputField";
import { icons } from "@/app/MyAssets";
import MainButton from "@/app/components/MainButton";
import { changePin } from "@/app/api/Auth";
import { showErrorToast, showSuccessToast } from "@/app/utils/toastmsg";

const ChangePinScreen = () => {
  // State for input fields
  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [verifyPin, setVerifyPin] = useState("");

  // Handler for changing the PIN
  const handleChangePin = async () => {
    // Validate the inputs
    if (!oldPin || !newPin || !verifyPin) {
      showErrorToast("All fields are required.");
      return;
    }
    if (newPin !== verifyPin) {
      showErrorToast("New PIN and verify PIN must match.");
      return;
    }
    let data = {
      NewPassword: newPin,
      OldPassword: oldPin,
    };
    const response = await changePin(data);
    if (response.data.msgCode == "500") {
      showErrorToast(response.data.data);
    }
    if (response.data.msgCode == "200") {
      showSuccessToast(response.data.data);
    }

    // Call an API or perform an action with oldPin and newPin

    // Reset fields
    setOldPin("");
    setNewPin("");
    setVerifyPin("");
  };

  return (
    <View style={{ flex: 1 }}>
      <GeneralHeader title="Change Pin" back={true} />
      <ScreenWrapper>
        <BerlingskeMedium style={styles.heading}>
          To change your PIN, please fill in the details below.
        </BerlingskeMedium>
        <InputField
          placeholder="Old Pin"
          icon={icons.lock}
          secureTextEntry={true}
          keyboardType="numeric"
          value={oldPin}
          onChangeText={setOldPin}
        />
        <InputField
          placeholder="New Pin"
          icon={icons.lock}
          secureTextEntry={true}
          keyboardType="numeric"
          value={newPin}
          onChangeText={setNewPin}
        />
        <InputField
          placeholder="Verify Pin"
          icon={icons.lock}
          secureTextEntry={true}
          keyboardType="numeric"
          value={verifyPin}
          onChangeText={setVerifyPin}
        />
        <MainButton
          title="Change Pin"
          style={styles.btn}
          onPress={handleChangePin}
        />
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
    fontSize: 18,
  },
  btn: {
    marginTop: 40,
  },
});
