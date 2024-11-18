import {
  Image,
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
import BerlingskeMedium from "@/app/components/TextWrapper/BerlingskeMedium";
import { router } from "expo-router";
import { forgotPassword } from "@/app/api/Auth";
import { showErrorToast, showInfoToast } from "@/app/utils/toastmsg";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import ArchivoLight from "@/app/components/TextWrapper/ArchivoLight";
import ArchivoExtraLight from "@/app/components/TextWrapper/ArchivoExtraLight";

const ForgotPasswordScreen = () => {
  const [step, setStep] = useState(1);
  const [membershipNumber, setMemberShipNumber] = useState("");
  const loading = useSelector(
    (state: RootState) => state?.general?.generalLoader
  );
  const onForgotPress = async () => {
    if (!membershipNumber) {
      showErrorToast("Membership number is required");
      return;
    }
    const result = await forgotPassword(membershipNumber);
    if (result.data?.msgCode == "200") {
      showInfoToast(result.data.data);
      setTimeout(() => {
        router.navigate("/login");
      }, 2000);
    }
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
        {step == 1 ? (
          <View>
            <BerlingskeMedium
              style={{ alignSelf: "center", fontSize: 25, marginTop: vh * 4 }}
            >
              Recover Your Password
            </BerlingskeMedium>
            <View style={{ marginTop: vh * 2 }} />
            <InputField
              icon={icons.idCard}
              placeholder="Membership Number*"
              onChangeText={setMemberShipNumber}
            />
            <MainButton
              title="Send Email"
              loading={loading}
              onPress={() => onForgotPress()}
            />
            <TouchableOpacity onPress={() => router.replace("/login")}>
              <ArchivoLight style={styles.login}>Go Back to Login</ArchivoLight>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.successContainer}>
            <BerlingskeMedium
              style={{
                textAlign: "center",
                fontSize: 25,
                marginTop: vh * 2,
                marginBottom: vh * 2,
              }}
            >
              "Congratulations" Password Send to your Email Address
            </BerlingskeMedium>
            <Image source={icons.email} style={styles.icon} />
            <TouchableOpacity onPress={() => router.replace("/login")}>
              <Text style={styles.login}>Go Back to Login</Text>
            </TouchableOpacity>
          </View>
        )}
        <ArchivoExtraLight style={styles.terms}>
          By signing in, you are agreeing to the online Terms and Conditions of
          the Marsa Sports Club booking regulations.
        </ArchivoExtraLight>
        <ArchivoLight style={styles.termsHeading}>
          Terms & Conditions | Privacy Policy
        </ArchivoLight>
        <PoweredBy />
      </View>
    </ScreenWrapper>
  );
};

export default ForgotPasswordScreen;

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
  icon: {
    height: vh * 20,
    width: vh * 20,
    resizeMode: "contain",
  },
  successContainer: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  login: {
    color: "black",
    marginTop: vh * 2,
    fontSize: 14,
    alignSelf: "center",
  },
});
