import { StyleSheet, Animated, View, Easing } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ScreenWrapper from "@/app/components/ScreenWrapper";

import { bannerIcon } from "@/app/MyAssets";
import HomeHeader from "@/app/components/HomeHeader";

import ConfirmationPopup, {
  ConfirmationPopupRef,
} from "@/app/components/ConfirmationPopup";
import { router } from "expo-router";

import { useDispatch, useSelector } from "react-redux";
import { fetchMyProfile, fetchuserProfile } from "@/app/store/slices/userSlice";
import { RootState } from "@/app/store";
import type { AppDispatch } from "@/app/store/index"; // Path to your store.ts
import { CancelBooking, FetchCalendarData } from "@/app/api/Bookings";
import moment from "moment";
import { vh, vw } from "@/app/utils/units";
import BookingCalendarVersion2 from "@/app/components/BookingCalendar/BookingCalendarVersion2";
import { fetchCurrentSports } from "@/app/store/slices/bookingSlice";
import { useFocusEffect } from "expo-router";
import { fetchRemainingBalance } from "@/app/store/slices/accountSlice";
import BookingDetailsPopup from "@/app/components/BookingDetailsPopup";
import BookingConfirmationPopup, {
  BookingConfirmationPopupRef,
} from "@/app/components/BookingConfirmationPopup";
import { toggleBtnLoader } from "@/app/store/slices/generalSlice";
import { useTheme } from "@react-navigation/native";
import LoaderComponent from "@/app/components/Loader";
import { EventRegister } from "react-native-event-listeners";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { liveUrl, testUrl } from "@/app/api";

// Define types for calendar data and booking sessions
interface CalendarData {
  bookingSessions: Array<any>; // You may want to replace `any` with the correct session structure
  timeSlots: Array<string>;
}

interface Sport {
  sportServiceSetting: {
    title: string;
    hasACSetting: boolean;
    hasHalfTimeSetting: boolean;
  };
  bookingSetting: {
    maximumPlayers: number;
    minimumPlayers: number;
  };
  // add other fields as needed
}

export const useAppDispatch: () => AppDispatch = useDispatch;

const LandingScreen = () => {
  const confirmationPopup = useRef<ConfirmationPopupRef>(null);
  const bookingDetailsPopup = useRef<BookingConfirmationPopupRef>(null);

  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const sports = useSelector((state: RootState) => state?.account?.sportsData);
  // Define state with appropriate types
  const [calendarData, setCalendarData] = useState<CalendarData | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [SelectedSport, setSelectedSport] = useState<Sport>();
  const [calendarFetchCount, setCalendarFetchCount] = useState(1);
  const [selectedBookingKey, setSelectedBookingKey] = useState("");
  const [getSignalRData, setSignalRData] = React.useState(false);
  const [connection, setConnection] = useState(null);
  const bookingConfirmationRef = useRef<ConfirmationPopupRef>(null);

  const loader = useSelector((state: RootState) => state.general?.btnLoader);

  const token = useSelector((state) => state.user.token);
  const club = useSelector((state) => state.general.clubConfig);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const scale2Anim = useRef(new Animated.Value(1)).current;
  const translate2X = useRef(new Animated.Value(0)).current;
  const translate2Y = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // handleNavigation();
    getProfile();
    dispatch(fetchRemainingBalance());
    getSports();
    dispatch(toggleBtnLoader(true));
  }, []);

  useEffect(() => {
    let refreshEvent = EventRegister.addEventListener("tokenRefresh", () => {
      setCalendarFetchCount((prev) => prev + 1);
    });
    let switchCaseEvent = EventRegister.addEventListener("switchCase", () => {
      console.log("FetchRemaining");
      dispatch(fetchRemainingBalance());
    });
    return () => {
      EventRegister.removeEventListener(refreshEvent);
      EventRegister.removeEventListener(switchCaseEvent);
    };
  }, []);

  useEffect(() => {
    if (calendarFetchCount > 1) {
      getCalendarData(selectedDate, SelectedSport);
    }
  }, [calendarFetchCount]);

  useFocusEffect(
    useCallback(() => {
      getProfile();
      getSports();
      return () => {
        console.log("This route is now unfocused.");
      };
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      if (selectedDate && SelectedSport) {
        getCalendarData(selectedDate, SelectedSport);
      }

      return () => {
        console.log("This route is now unfocused.");
      };
    }, [selectedDate, SelectedSport])
  );

  useEffect(() => {
    // Zoom In and Out Animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1, // Slightly zoom in
          duration: 5000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1, // Zoom out to normal
          duration: 5000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Circular Motion Animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateX, {
          toValue: 20,
          duration: 5000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 10,
          duration: 5000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: 0,
          duration: 5000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 5000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    // Zoom In and Out Animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale2Anim, {
          toValue: 1.12, // Slightly zoom in
          duration: 5000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scale2Anim, {
          toValue: 1, // Zoom out to normal
          duration: 5000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Circular Motion Animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(translate2X, {
          toValue: 20,
          duration: 5000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(translate2Y, {
          toValue: 10,
          duration: 5000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(translate2X, {
          toValue: 0,
          duration: 5000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(translate2Y, {
          toValue: 0,
          duration: 5000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    if (getSignalRData) {
      updateCalendardataFromSocket(getSignalRData);
    }
  }, [getSignalRData]);
  useEffect(() => {
    try {
      if (club) {
        const apiurl = club?.apiURL;

        const newConnection = new HubConnectionBuilder()
          .withUrl(`${apiurl}hub/Booking/status/update`)
          .withAutomaticReconnect()
          .build();

        // re-establish the connection if connection dropped
        newConnection.onclose(() =>
          setTimeout(startSignalRConnection(newConnection), 5000)
        );
        setConnection(newConnection);
      }
    } catch (error) {
      console.log("something went wrong");
    }
    // setConnection(newConnection);
  }, [club]);

  useEffect(() => {
    if (connection) {
      startSignalRConnection(connection);
    }
  }, [connection]);

  const startSignalRConnection = (connectionP) => {
    try {
      if (connectionP) {
        connectionP
          .start()
          .then((result) => {
            console.log("SignalR Connected!");
            connectionP.on("BookedSessionMessage", (message) => {
              console.log(JSON.stringify(message));
              // updateCalendardataFromSocket(message);
              setSignalRData(message);
            });
          })
          .catch((e) => {
            //console.log('SignalR Connection failed: ', e)
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateCalendardataFromSocket = (message) => {
    let bookingData = calendarData?.bookingSessions;
    console.log("are we here ? ");
    console.log(
      message.service.trim().toLowerCase(),
      SelectedSport?.sportServiceSetting?.title?.toLowerCase()
    );
    if (message != "") {
      if (
        message.service.trim().toLowerCase() ==
        SelectedSport?.sportServiceSetting?.title?.toLowerCase()
      ) {
        if (message.key.includes("*")) {
          let splitKey = message.key.split("*");
          let courtNo = parseInt(splitKey[1]) - 1;
          let sessionNo = parseInt(splitKey[2]) - 1;
          if (
            courtNo != undefined &&
            courtNo >= 0 &&
            sessionNo != undefined &&
            sessionNo >= 0
          ) {
            if (bookingData.length > 0 && bookingData != undefined) {
              let isExist =
                bookingData[courtNo]?.session?.filter(
                  (x) => x.key == message.key
                ).length > 0
                  ? true
                  : false;
              if (isExist) {
                if (
                  bookingData[courtNo]?.session[sessionNo] &&
                  bookingData[courtNo] != undefined &&
                  bookingData[courtNo].session[sessionNo] != undefined
                ) {
                  let tempBooking = bookingData[courtNo];
                  let changeTempBooking = tempBooking?.session[sessionNo];

                  if (message.isBooking) {
                    changeTempBooking.icon = `assets/images/sports-content/${SelectedSport.sportTheme.folder.toLowerCase()}/sport_schedule_ball_hidden.png`;
                    changeTempBooking.isAvailable = 0;
                    changeTempBooking.bcolor = "";
                    changeTempBooking.rows = message.isHalfSession ? 2 : 0;
                  } else {
                    changeTempBooking.rows = 0;
                    changeTempBooking.bcolor = "";
                    changeTempBooking.icon = "";
                    changeTempBooking.isAvailable = 1;
                    changeTempBooking.players = "";
                  }

                  bookingData[courtNo] = tempBooking;
                  console.log(bookingData);
                  setCalendarData({
                    ...calendarData,
                    bookingSessions: bookingData,
                  });
                }
              }
            }
          }
        }
      }
    }
  };
  const getSports = async (): Promise<void> => {
    dispatch(fetchCurrentSports());
  };

  useEffect(() => {
    if (sports?.length) {
      console.log("bagair Sports wala useeffect");

      setSelectedSport(sports[0]);
    }
  }, []);

  // useEffect(() => {
  //   if (selectedDate && SelectedSport) {
  //    getCalendarData(selectedDate, SelectedSport);
  //   }
  // }, [selectedDate, SelectedSport]);

  useEffect(() => {
    if (sports?.length) {
      console.log("Sports wala useeffect");
      if (!SelectedSport) {
        setSelectedSport(sports[0]);
      }
    } else {
      setSelectedSport(null);
    }
  }, [sports]);

  // Define return type for async function
  const getProfile = async (): Promise<void> => {
    dispatch(fetchMyProfile());
    dispatch(fetchuserProfile());
  };

  // Define the type of 'date' as Date and return type as Promise<void>
  const getCalendarData = async (date: Date, sport?: Sport): Promise<void> => {
    try {
      dispatch(toggleBtnLoader(true));
      console.log(sport, "sport222");
      const formattedDate = moment(date).format("DD-MM-YYYY");
      let data = {
        date: formattedDate,
        sport: sport?.sportServiceSetting.title.toLowerCase(),
      };
      console.log(data);
      const response = await FetchCalendarData(data);
      if (response && response.data && response.data.data) {
        setCalendarData(response.data.data);
      }
      setTimeout(() => {
        dispatch(toggleBtnLoader(false));
      }, 200);
    } catch (error) {
      dispatch(toggleBtnLoader(false));
    }
  };

  const onSearchPress = () => {
    getCalendarData(selectedDate, SelectedSport);
  };

  const onAcceptBooking = (data: any) => {
    confirmationPopup.current?.hide();
    router.push({
      //@ts-ignore
      pathname: "/homestack/bookingdetail",
      params: {
        bookingData: JSON.stringify({ ...data, selectedSport: SelectedSport }),
      }, // Use if you have any URL params to send (optional)
      state: {}, // Pass the large object here
    });
    // router.navigate("/homestack/bookingdetail" );
  };

  const onNotificationPress = () => {
    //@ts-ignore
    router.navigate("/homestack/notifications");
  };

  //@ts-ignore
  const onBookingPress = (court, session) => {
    //@ts-ignore
    console.log(session, "session");
    if (session.players) {
      setSelectedBookingKey(session.key);
      return bookingDetailsPopup.current?.show(
        session.key,
        SelectedSport?.sportServiceSetting.title
      );
    }
    console.log(session, "Session of booking");
    confirmationPopup.current?.show(court, session, selectedDate);
  };

  const onCancelBookingPress = () => {
    bookingDetailsPopup.current?.hide();
    setTimeout(() => {
      bookingConfirmationRef.current?.show();
    }, 500);
  };

  const onConfirmedCancel = async (pin: string) => {
    const data = {
      key: selectedBookingKey,
      pin: pin,
      section: SelectedSport?.sportServiceSetting.title,
    };
    const response = await CancelBooking(data);
    dispatch(fetchRemainingBalance());
    if (response.data.msgCode == "200") {
      console.log("fetch again");
      getCalendarData(selectedDate, SelectedSport);
    }

    console.log(sports, "response of cancel");
  };

  React.useEffect(() => {
    const checkTokenAndNavigate = async () => {
      if (!token) {
        router.replace("/login");
      } else {
      }
    };

    checkTokenAndNavigate();
  }, [token]);

  const bannerImages = {
    cricket: bannerIcon.cricket,
    general: bannerIcon.general,
    paddle: bannerIcon.paddle,
    padel: bannerIcon.paddle,
    pickleBall: bannerIcon.pickleBall,
    squash: bannerIcon.squash,
    tennis: bannerIcon.tennis,
  };

  const getBannerImages = (sportTitle) => {
    if (bannerImages[sportTitle]) {
      return bannerImages[sportTitle];
    } else {
      return bannerImages.general;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          backgroundColor: "#EAEBEA",
          width: vh * 90,
          height: vh * 90,
          right: -vw * 65,
          position: "absolute",
          zIndex: 0,
          borderRadius: vh * 100,
          top: -vh * 44,
        }}
      >
        <Animated.Image
          source={getBannerImages(
            SelectedSport?.sportServiceSetting.title?.toLowerCase()
          )}
          style={{
            width: vh * 30,
            height: vh * 30,
            resizeMode: "contain",
            position: "absolute",
            bottom: 20,
            left: "32%",
            opacity: 0.5,
            transform: [{ scale: scaleAnim }, { translateX }, { translateY }],
            // right: 0,
          }}
        />

        <Animated.Image
          source={getBannerImages(
            SelectedSport?.sportServiceSetting.title?.toLowerCase()
          )}
          style={{
            width: vh * 30,
            height: vh * 30,
            resizeMode: "contain",
            position: "absolute",
            bottom: 20,
            left: "32%",
            opacity: 0.5,
            transform: [
              { scale: scale2Anim },
              { translateX: translate2X },
              { translateY: translate2Y },
            ],
            // right: 0,
          }}
        />
      </View>
      <HomeHeader
        onNotificationPress={onNotificationPress}
        allSports={sports}
        setSelectedDate={setSelectedDate}
        selectedDate={selectedDate}
        onSearchPress={onSearchPress}
        getCalendarData={getCalendarData}
        setSelectedSport={setSelectedSport}
        selectedSport={SelectedSport}
      />

      <ScreenWrapper transparent={true} noPadding={true}>
        {calendarData ? (
          <BookingCalendarVersion2
            onBookingPress={onBookingPress}
            data={calendarData}
            date={selectedDate}
            selectedSport={SelectedSport?.sportServiceSetting?.title}
          />
        ) : null}
      </ScreenWrapper>

      <ConfirmationPopup
        reference={confirmationPopup}
        selectedSport={SelectedSport?.sportServiceSetting?.title}
        onAccept={onAcceptBooking}
      />

      <BookingConfirmationPopup
        reference={bookingConfirmationRef}
        onAccept={onConfirmedCancel}
        cancel={true}
      />
      <BookingDetailsPopup
        onCancelBookingPress={onCancelBookingPress}
        reference={bookingDetailsPopup}
      />
      {loader ? <LoaderComponent /> : null}
    </View>
  );
};

export default LandingScreen;

const styles = StyleSheet.create({
  loader: {
    height: vh * 100,
    width: vw * 100,
    backgroundColor: "#0000004a",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
});
