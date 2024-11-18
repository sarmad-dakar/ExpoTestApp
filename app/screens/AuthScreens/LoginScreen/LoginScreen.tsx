import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import MainButton from "@/app/components/MainButton";
import LogoHeader from "@/app/components/LogoHeader";
import InputField from "@/app/components/InputField";
import { icons } from "@/app/MyAssets";
import ScreenWrapper from "@/app/components/ScreenWrapper";
import PoweredBy from "@/app/components/PoweredBy";
import { colors } from "@/app/utils/theme";
import { vh } from "@/app/utils/units";
import { router } from "expo-router";
import { loginApi } from "@/app/api/Auth";
import { useDispatch, useSelector } from "react-redux";
import { saveLoginDetails } from "@/app/store/slices/userSlice";
import { showErrorToast } from "@/app/utils/toastmsg";
import {
  toggleBtnLoader,
  toggleGeneralLoader,
} from "@/app/store/slices/generalSlice";
import ArchivoExtraLight from "@/app/components/TextWrapper/ArchivoExtraLight";
import ArchivoLight from "@/app/components/TextWrapper/ArchivoLight";
const LoginScreen = () => {
  const [membershipNumber, setMemberShipNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ membership: "", password: "" });
  const [membershipError, setMemberShipError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const loader = useSelector((state: any) => state.general.generalLoader);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(toggleGeneralLoader(false));
  }, []);

  const handleSignInPress = async () => {
    setMemberShipError("");
    setPasswordError("");
    if (!membershipNumber) {
      setMemberShipError("This Field is required");
    }
    if (!password) {
      setPasswordError("This Field is required");
    }
    if (membershipNumber && password) {
      let data = {
        LoginName: membershipNumber,
        UserPassword: password,
      };

      const response = await loginApi(data);
      if (response.data.msgCode == "200") {
        dispatch(saveLoginDetails(response.data.data));
        router.replace("/(tabs)");
      } else {
        showErrorToast(response.data.msgDescription);
      }
    }
  };

  useEffect(() => {
    if (membershipNumber) {
      setMemberShipError("");
    }
    if (password) {
      setPasswordError("");
    }
  }, [membershipNumber, password]);
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
          error={membershipError}
          placeholder="Membership Number*"
        />
        <InputField
          error={passwordError}
          onChangeText={setPassword}
          icon={icons.lock}
          placeholder="password"
          secureTextEntry={true}
        />
        <TouchableOpacity onPress={() => router.replace("/forgotpassword")}>
          <ArchivoLight style={styles.forgotPass}>
            Forgot Password ?
          </ArchivoLight>
        </TouchableOpacity>
        <MainButton
          loading={loader}
          title="Sign in"
          onPress={handleSignInPress}
        />
        <ArchivoExtraLight style={styles.terms}>
          By signing in, you are agreeing to the online Terms and Conditions of
          the Marsa Sports Club booking regulations.
        </ArchivoExtraLight>
        <View style={styles.termsContainer}>
          <TouchableOpacity onPress={() => router.push("/termscondition")}>
            <ArchivoLight style={styles.termsHeading}>
              Terms & Conditions
            </ArchivoLight>
          </TouchableOpacity>
          <Text>|</Text>
          <TouchableOpacity onPress={() => router.push("/termscondition")}>
            <ArchivoLight> Privacy Policy</ArchivoLight>
          </TouchableOpacity>
        </View>
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
    fontSize: vh * 2,
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
    // fontSize: vh * 2,
    fontWeight: "300",
  },
  termsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
    paddingHorizontal: "15%",
    // backgroundColor : "red"
  },
});
