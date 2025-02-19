import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  NativeModules,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import MainButton from "@/app/components/MainButton";
import LogoHeader from "@/app/components/LogoHeader";
import InputField from "@/app/components/InputField";
import { icons, images } from "@/app/MyAssets";
import ScreenWrapper from "@/app/components/ScreenWrapper";
import PoweredBy from "@/app/components/PoweredBy";
import { themeColors } from "@/app/utils/theme";
import { vh, vw } from "@/app/utils/units";
import { router } from "expo-router";
import { loginApi } from "@/app/api/Auth";
import { useDispatch, useSelector } from "react-redux";
import {
  saveLoginDetails,
  saveMultipleUsers,
} from "@/app/store/slices/userSlice";
import { showErrorToast } from "@/app/utils/toastmsg";
import {
  switchUser,
  toggleBtnLoader,
  toggleGeneralLoader,
} from "@/app/store/slices/generalSlice";
import ArchivoExtraLight from "@/app/components/TextWrapper/ArchivoExtraLight";
import ArchivoLight from "@/app/components/TextWrapper/ArchivoLight";
import LoaderComponent from "@/app/components/Loader";

import { RootState } from "@/app/store";
import { generalApi, setBaseURL, testUrl } from "@/app/api";
import PaymentWebviewPopup from "@/app/components/PaymentWebView";
import ArchivoMedium from "@/app/components/TextWrapper/ArchivoMedium";
import Animated, {
  FadeIn,
  FadeOut,
  SlideOutDown,
} from "react-native-reanimated";
import BannerBackground from "@/app/components/BannerBackground";
// import Payments from "react-native-payments";
const { TrustPaymentsModule } = NativeModules;

const LoginScreen = () => {
  const [membershipNumber, setMemberShipNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ membership: "", password: "" });
  const [membershipError, setMemberShipError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const loader = useSelector((state: any) => state.general.generalLoader);
  const club = useSelector((state) => state.general.clubConfig);
  const btnLoader = useSelector((state: any) => state.general.btnLoader);
  const [showPoweredBy, setShowPoweredBy] = useState(true);
  const allMembers = useSelector(
    (state: RootState) => state.user.multipleUsers
  );
  const webviewRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    // dispatch(toggleGeneralLoader(false));
    // dispatch(toggleBtnLoader(true));
    setTimeout(() => {
      dispatch(toggleBtnLoader(false));
    }, 200);
  }, []);

  useEffect(() => {
    // Add listeners for keyboard events

    const hideSubscription = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        console.log("keyboard event,,,");
        setShowPoweredBy(true);
      } // Keyboard is closed
    );

    const OpenSubscription = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => {
        console.log("keyboard event,,,");
        setShowPoweredBy(false);
      } // Keyboard is closed
    );

    // Cleanup listeners on component unmount
    return () => {
      hideSubscription.remove();
      OpenSubscription.remove();
    };
  }, []);

  const handleSignInPress = async () => {
    // console.log("Apply implementation here..");
    // const result = await TrustPaymentsModule.processGooglePay();
    // console.log(result, "result of native module");
    // return;

    const allowedCardNetworks = [
      "AMEX",
      "DISCOVER",
      "INTERAC",
      "JCB",
      "MASTERCARD",
      "VISA",
    ];

    // const allowedCardAuthMethods = ["PAN_ONLY", "CRYPTOGRAM_3DS"];
    // try {
    //   const DETAILS = {
    //     id: "basic-example",
    //     displayItems: [
    //       {
    //         label: "Movie Ticket",
    //         amount: { currency: "USD", value: "15.00" },
    //       },
    //     ],
    //     total: {
    //       label: "Atta bhai",
    //       amount: { currency: "USD", value: "15.00" },
    //     },
    //   };

    //   const METHOD_DATA = [
    //     {
    //       supportedMethods: ["android-pay"],
    //       data: {
    //         supportedNetworks: ["visa", "mastercard", "amex"],
    //         currencyCode: "USD",
    //         environment: "TEST", // defaults to production
    //         // paymentMethodTokenizationParameters: {
    //         //   tokenizationType: "NETWORK_TOKEN",
    //         //   parameters: {
    //         //     publicKey:
    //         //       "pk_test_51OLSSkDzaeDL8jWuNrMWNkM5UMIOrVr1UpO1XgDP1URMxnLSJBoS3MIQBiLdPNcncXeVRDShf5IXg3cU1MHzCe8200sXGYV8gK",
    //         //   },
    //         // },

    //         paymentMethodTokenizationParameters: {
    //           tokenizationType: "GATEWAY_TOKEN",
    //           parameters: {
    //             gateway: "stripe", // Change if using Stripe or another gateway
    //           },
    //         },
    //       },
    //     },
    //   ];
    //   const paymentRequest = new PaymentRequest(METHOD_DATA, DETAILS);
    //   paymentRequest
    //     .show()
    //     .then((res) => {
    //       console.log(res);
    //     })
    //     .catch((err) => {
    //       console.log(JSON.stringify(err), "Error");
    //     });
    // } catch (error) {
    //   console.log(error, "Error caught");
    // }

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
        LoginName: membershipNumber.trim(),
        UserPassword: password,
      };

      const response = await loginApi(data);
      if (response.data.msgCode == "200") {
        dispatch(saveLoginDetails(response.data.data));
        dispatch(toggleBtnLoader(false));
        let data = {
          user: response?.data?.data,
          club: club,
        };
        dispatch(saveMultipleUsers(data));
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

  const handleSwitchClub = () => {
    setBaseURL(generalApi);
    dispatch(switchUser(null));

    dispatch(toggleBtnLoader(true));
    setTimeout(() => {
      router.replace("(navigations)/clublisting");
      dispatch(toggleBtnLoader(false));
    }, 100);
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
      <ImageBackground
        source={images.linesBackground}
        imageStyle={{ width: "100%", height: "100%", resizeMode: "cover" }}
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
          onPress={() => setShowPoweredBy(false)}
        />
        <InputField
          error={passwordError}
          onChangeText={setPassword}
          icon={icons.lock}
          placeholder="password"
          secureTextEntry={true}
          onPress={() => setShowPoweredBy(false)}
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
          <ArchivoMedium style={{ fontSize: vh * 1.6, color: "#272727" }}>
            Switch Club
          </ArchivoMedium>
        </TouchableOpacity>
        {/* <BannerBackground /> */}

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
        {showPoweredBy ? (
          <Animated.View
            exiting={SlideOutDown.duration(300)}
            entering={FadeIn.duration(100)}
            style={styles.poweredBy}
          >
            <PoweredBy />
          </Animated.View>
        ) : null}
      </ImageBackground>
      {btnLoader ? <LoaderComponent /> : null}
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
  poweredBy: {
    // position: "absolute",
    position: "absolute",
    bottom: vh * 1.5,
    alignSelf: "center",
  },
});
