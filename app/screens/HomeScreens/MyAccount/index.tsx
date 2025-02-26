import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import GeneralHeader from "@/app/components/GeneralHeader";
import SearchField from "@/app/components/SearchField";
import ScreenWrapper from "@/app/components/ScreenWrapper";
import { themeColors } from "@/app/utils/theme";
import { FetchMyBookings, GetAccountData } from "@/app/api/Bookings";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyAccount } from "@/app/store/slices/accountSlice";
import { router, useFocusEffect } from "expo-router";
import { useAppDispatch } from "../LandingScreen";
import { RootState } from "@/app/store";
import { vh, vw } from "@/app/utils/units";
import ArchivoRegular from "@/app/components/TextWrapper/ArchivoRegular";
import { useTheme } from "@react-navigation/native";
import LoaderComponent from "@/app/components/Loader";
import ArchivoExtraLight from "@/app/components/TextWrapper/ArchivoExtraLight";
import { icons } from "@/app/MyAssets";
import ArchivoMedium from "@/app/components/TextWrapper/ArchivoMedium";
import ArchivoLight from "@/app/components/TextWrapper/ArchivoLight";
import Animated, { ZoomInRight } from "react-native-reanimated";

interface AccountData {
  date: string;
  transactionNumber: string;
  section: string;
  category: string;
  remarks: string;
  amount: string;
}

const MyAccountScreen = () => {
  // const [accountData, setAccountData] = useState<AccountData[]>([]);
  const accountData = useSelector((state: any) => state.account.accountData);
  const windowWidth = Dimensions.get("window").width;
  const dispatch = useAppDispatch();
  const loading = useSelector(
    (state: RootState) => state.general.generalLoader
  );
  const [sections, setSections] = useState([]);
  const [selectedTab, setSelectedTab] = useState("All");
  const [dataForList, setDataForList] = useState([]);
  console.log(sections, "section");

  const styles = MyStyles();
  // useEffect(() => {
  //   dispatch(fetchMyAccount());
  // }, []);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchMyAccount());

      return () => {
        console.log("This route is now unfocused.");
      };
    }, [])
  );

  useEffect(() => {
    if (accountData.length) {
      sortAccountData(accountData);
    }
  }, [accountData]);

  function capitalizeFirstLetter(word) {
    if (!word) return ""; // Handle empty or undefined input
    return word[0].toUpperCase() + word.slice(1).toLowerCase();
  }

  const sortAccountData = (data) => {
    let unique = ["All"];
    data.forEach((item) => {
      if (item?.section) {
        if (!unique.includes(item?.section)) {
          unique.push(item?.section);
        }
      }
    });

    setDataForList(data);
    setSections(unique);
  };

  const onTabSelection = (item) => {
    if (item == "All") {
      return setDataForList(accountData);
    }

    const sortedList = accountData.filter(
      (element) => element?.section == item
    );
    setDataForList(sortedList);
  };

  const onDetailPress = (item: any) => {
    // router.navigate("navigationstack/accountdetails");
    let data = {
      id: item?.bookingKey,
      sport: item?.section.toUpperCase(),
    };
    router.push({
      //@ts-ignore
      pathname: "/navigationstack/accountdetails",
      params: {
        bookingData: JSON.stringify(data),
      }, // Use if you have any URL params to send (optional)
    });
  };

  const onRecieptPress = (item: any) => {
    router.push({
      //@ts-ignore
      pathname: "/navigationstack/accountreciept",
      params: {
        recieptData: JSON.stringify(item),
      }, // Use if you have any URL params to send (optional)
    });
  };

  const AccountCard = ({ item, index }) => {
    const [enablePopup, setEnablePopup] = useState(false);

    return (
      <Pressable
        onPress={() => setEnablePopup(false)}
        style={styles.accountCard}
      >
        {enablePopup && (
          <Animated.View
            entering={ZoomInRight.duration(300)}
            style={styles.listView}
          >
            <TouchableOpacity
              hitSlop={{
                top: 10,
                bottom: 10,
                left: 10,
                right: 10,
              }} // Adjust hitSlop as needed
              onPress={() => {
                setEnablePopup(false);
                onDetailPress(item);
              }}
              style={styles.listBtn}
            >
              <Text style={styles.listText}>View Details</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        <View
          style={[styles.rowDirection, { justifyContent: "space-between" }]}
        >
          <ArchivoMedium style={styles.bold}>
            Transaction# : {item.transactionNumber}
          </ArchivoMedium>
          <View style={[styles.rowDirection]}>
            <Image source={icons.euro} style={styles.euro} />
            <ArchivoMedium style={{ fontSize: vh * 1.8 }}>
              {parseFloat(item?.amount).toFixed(2)}
            </ArchivoMedium>

            <TouchableOpacity
              disabled={item?.bookingKey ? false : true}
              onPress={() => setEnablePopup(!enablePopup)}
              style={[styles.iconContainer]}
            >
              <Image
                style={[
                  styles.more,
                  !item?.bookingKey && { tintColor: "#0005" },
                ]}
                source={icons.more}
              />
            </TouchableOpacity>
          </View>
        </View>
        {item?.receipt ? (
          <ArchivoMedium
            style={{ fontSize: vh * 1.3, color: "#0008", marginTop: "-1%" }}
          >
            Receipt# {item?.receipt}
          </ArchivoMedium>
        ) : null}
        <View
          style={[styles.rowDirection, { justifyContent: "space-between" }]}
        >
          <View>
            <ArchivoMedium style={styles.bold}>Category</ArchivoMedium>
            <ArchivoExtraLight style={{ fontSize: vh * 1.5, marginTop: "-3%" }}>
              {item?.category}
            </ArchivoExtraLight>
          </View>
          <View style={{}}>
            <ArchivoMedium style={styles.bold}>Date</ArchivoMedium>
            <ArchivoExtraLight style={{ fontSize: vh * 1.5, marginTop: "-3%" }}>
              {item.date}
            </ArchivoExtraLight>
          </View>
        </View>

        <View>
          <ArchivoExtraLight style={styles.footerText}>
            <ArchivoMedium style={styles.bold}>Remarks :</ArchivoMedium>{" "}
            {item?.remarks}
          </ArchivoExtraLight>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <GeneralHeader back={true} title="My Account" />
      {/* Fixed Header */}
      {/* {loading ? <LoaderComponent /> : null} */}
      <ScreenWrapper>
        <View style={styles.tabContainer}>
          <FlatList
            data={sections}
            horizontal
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setSelectedTab(item);
                    onTabSelection(item);
                  }}
                  style={styles.tabButton}
                >
                  <ArchivoRegular
                    style={[
                      styles.tabText,
                      selectedTab === item && styles.activeTabText,
                    ]}
                  >
                    {capitalizeFirstLetter(item)}
                  </ArchivoRegular>
                  {selectedTab === item && (
                    <View style={styles.activeTabIndicator} />
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {/* Scrollable Content */}
        <View style={{ flex: 0.95, paddingTop: 10 }}>
          <FlatList
            data={dataForList}
            ListEmptyComponent={() => (
              <View style={{ marginTop: 20 }}>
                <ActivityIndicator size={"large"} color={themeColors.primary} />
              </View>
            )}
            renderItem={({ item, index }) => {
              return <AccountCard item={item} index={index} />;
            }}
          />
        </View>
      </ScreenWrapper>
    </View>
  );
};

export default MyAccountScreen;

const MyStyles = () => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.white,
    },
    headerRow: {
      flexDirection: "row",
      backgroundColor: colors.primary,
    },
    headerText: {
      color: "#fff",
      fontWeight: "bold",
      textAlign: "left",
      paddingVertical: 10,
      paddingLeft: 10,
      // borderWidth: 0.5,
      // borderColor: "#fff",
      fontSize: vh * 1.5,
      backgroundColor: colors.primary,
    },
    row: {
      flexDirection: "row",
      height: 40,
      alignItems: "center",
      // borderBottomWidth: 1,
      // borderColor: "#ccc",
    },
    cell: {
      textAlign: "left",
      fontSize: vh * 1.4,
      paddingLeft: 10,
      color: themeColors.darkText,
    },
    rowDirection: {
      flexDirection: "row",
      alignItems: "center",
    },
    divider: {
      height: 10,
      width: 1,
      backgroundColor: "gray",
    },
    whiteDivider: {
      height: 10,
      width: 1,
      backgroundColor: "white",
    },
    accountCard: {
      borderWidth: 1,
      padding: 10,
      marginTop: 20,
      borderRadius: 15,
      borderColor: "#0004",
      backgroundColor: "white",
    },
    heading: {
      marginBottom: 10,
      fontSize: vh * 1.8,
      color: themeColors.primary,
    },
    footerText: {
      color: "#0008",
      fontSize: vh * 1.4,
      lineHeight: vh * 2,
      marginTop: vh * 0.5,
    },
    bold: {
      fontSize: vh * 1.7,
      color: themeColors.primary,
    },
    more: {
      height: "100%",
      width: "100%",
      resizeMode: "contain",
    },
    iconContainer: {
      height: vh * 3,
      width: vh * 3,
    },
    listView: {
      // height: 90,
      // paddingVertical: 10,
      width: 120,
      backgroundColor: "#BEBEBE",
      position: "absolute",
      right: 20,
      top: 40,
      zIndex: 2,
    },
    listText: {
      fontSize: 12,
    },
    listBtn: {
      flex: 1,
      height: 35,
      justifyContent: "center",
      alignItems: "center",
    },
    euro: {
      height: vh * 1.5,
      width: vh * 1.5,
      resizeMode: "contain",
      marginRight: 2,
    },
    tabContainer: {
      flexDirection: "row",
      // justifyContent: "space-around",
      borderBottomWidth: 1,
      paddingLeft: 10,
      borderBottomColor: "#ccc",
      backgroundColor: colors.primary,
      marginTop: 14,
      borderRadius: 6,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,

      elevation: 5,
    },
    activeTabText: {
      color: colors.secondary,
    },
    activeTabIndicator: {
      marginTop: 4,
      height: 2,
      width: "100%",
      backgroundColor: colors.secondary,
      position: "absolute",
      bottom: 0,
    },
    tabText: {
      color: themeColors.white,
      fontSize: vh * 1.8,
    },
    tabButton: {
      alignItems: "center",
      paddingVertical: 10,

      marginRight: 20,
    },
  });
  return styles;
};
