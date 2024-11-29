import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import MainButton from "@/app/components/MainButton";
import LogoHeader from "@/app/components/LogoHeader";
import InputField from "@/app/components/InputField";
import { icons } from "@/app/MyAssets";
import ScreenWrapper from "@/app/components/ScreenWrapper";
import PoweredBy from "@/app/components/PoweredBy";
import { themeColors } from "@/app/utils/theme";
import { vh, vw } from "@/app/utils/units";
import { router } from "expo-router";
import { loginApi } from "@/app/api/Auth";
import { useDispatch, useSelector } from "react-redux";
import { saveLoginDetails } from "@/app/store/slices/userSlice";
import { showErrorToast } from "@/app/utils/toastmsg";
import {
  switchUser,
  toggleBtnLoader,
  toggleGeneralLoader,
} from "@/app/store/slices/generalSlice";
import ArchivoExtraLight from "@/app/components/TextWrapper/ArchivoExtraLight";
import ArchivoLight from "@/app/components/TextWrapper/ArchivoLight";
import { RootState } from "@/app/store";
import { generalApi, setBaseURL, testUrl } from "@/app/api";
import PaymentWebviewPopup from "@/app/components/PaymentWebView";
const LoginScreen = () => {
  const [membershipNumber, setMemberShipNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ membership: "", password: "" });
  const [membershipError, setMemberShipError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const loader = useSelector((state: any) => state.general.generalLoader);
  const club = useSelector((state) => state.general.clubConfig);
  const btnLoader = useSelector((state: any) => state.general.btnLoader);
  const webviewRef = useRef();
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
        dispatch(toggleBtnLoader(false));

        // router.replace("/(tabs)");
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

  const handleSwitchClub = () => {
    setBaseURL(testUrl);
    dispatch(switchUser(null));

    dispatch(toggleBtnLoader(true));
    setTimeout(() => {
      dispatch(toggleBtnLoader(false));
    }, 2000);
  };

  const showBar = () => {
    if (club?.termsURL && club?.privacyURL) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <ScreenWrapper hideShadow={true}>
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

        <TouchableOpacity
          style={styles.switchContainer}
          onPress={handleSwitchClub}
        >
          <ArchivoLight>Switch Club</ArchivoLight>
        </TouchableOpacity>

        <ArchivoExtraLight style={styles.terms}>
          By signing in, you are agreeing to the online Terms and Conditions of
          the Marsa Sports Club booking regulations.
        </ArchivoExtraLight>
        <View
          style={[
            styles.termsContainer,
            showBar() && { justifyContent: "space-between" },
          ]}
        >
          {club?.termsURL ? (
            <TouchableOpacity
              hitSlop={{
                top: 20,
                bottom: 20,
                left: 20,
                right: 20,
              }} // Adjust hitSlop as needed
              onPress={() => webviewRef?.current?.show(club?.termsURL)}
            >
              <ArchivoLight style={styles.termsHeading}>
                Terms & Conditions
              </ArchivoLight>
            </TouchableOpacity>
          ) : null}
          {showBar() ? <Text>|</Text> : null}
          {club?.privacyURL ? (
            <TouchableOpacity
              style={{}}
              onPress={() => webviewRef?.current?.show(club?.privacyURL)}
            >
              <ArchivoLight> Privacy Policy</ArchivoLight>
            </TouchableOpacity>
          ) : null}
        </View>
        <PoweredBy />
      </View>
      {btnLoader ? (
        <View style={styles.loader}>
          <ActivityIndicator size={"small"} color={themeColors.primary} />
        </View>
      ) : null}
      <PaymentWebviewPopup reference={webviewRef} />
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
    color: themeColors.darkText,
    textAlign: "center",
    marginTop: vh * 5,
    fontSize: vh * 1.8,
    width: "100%",
    alignSelf: "center",
    fontWeight: "300",
  },
  termsHeading: {
    // fontSize: vh * 2,
    // fontWeight: "300",
  },
  termsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    paddingHorizontal: "12%",
    zIndex: 100,
    // backgroundColor : "red"
  },
  switchContainer: {
    alignSelf: "center",
    marginTop: vh * 4,
  },
  loader: {
    height: vh * 100,
    width: vw * 100,
    backgroundColor: "#0000004a",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
});
