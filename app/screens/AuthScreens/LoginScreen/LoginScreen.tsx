import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import MainButton from "@/app/components/MainButton";
import LogoHeader from "@/app/components/LogoHeader";
import InputField from "@/app/components/InputField";
import { icons } from "@/app/MyAssets";
import ScreenWrapper from "@/app/components/ScreenWrapper";
import PoweredBy from "@/app/components/PoweredBy";
import { colors } from "@/app/utils/theme";
import { vh } from "@/app/utils/units";
import { router } from "expo-router";

const LoginScreen = () => {
  const [membershipNumber, setMemberShipNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleSignInPress = () => {
    console.log(membershipNumber);
    console.log(password);
    router.replace("/(tabs)");
  };
  return (
    <ScreenWrapper>
      <View
        style={[
          styles.container,
          Platform.OS == "web" && { paddingHorizontal: "30%" },
        ]}
      >
        <LogoHeader />

        <View style={{ marginTop: vh * 2 }} />
        <InputField
          onChangeText={setMemberShipNumber}
          icon={icons.idCard}
          placeholder="Membership Number*"
        />
        <InputField
          onChangeText={setPassword}
          icon={icons.lock}
          placeholder="password"
          secureTextEntry={true}
        />
        <TouchableOpacity onPress={() => router.replace("/forgotpassword")}>
          <Text style={styles.forgotPass}>Forgot Password ?</Text>
        </TouchableOpacity>
        <MainButton title="Sign in" onPress={handleSignInPress} />
        <Text style={styles.terms}>
          By signing in, you are agreeing to the online Terms and Conditions of
          the Marsa Sports Club booking regulations.
        </Text>
        <Text style={styles.termsHeading}>
          Terms & Conditions | Privacy Policy
        </Text>
        <PoweredBy />
      </View>
    </ScreenWrapper>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  forgotPass: {
    alignSelf: "center",
    color: "black",
    marginVertical: vh * 1.5,
    fontSize: vh * 1.8,
  },
  container: {
    flex: 1,
    paddingTop: vh * 2.5,
  },
  terms: {
    color: colors.green,
    textAlign: "center",
    marginTop: vh * 9,
    fontSize: vh * 1.8,
    width: "100%",
    alignSelf: "center",
    fontWeight: "300",
  },
  termsHeading: {
    alignSelf: "center",
    marginTop: 30,
    fontSize: vh * 2,
    fontWeight: "300",
  },
});
