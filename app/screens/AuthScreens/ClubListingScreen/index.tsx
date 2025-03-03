import {
  Image,
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  ActivityIndicator,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { themeColors } from "@/app/utils/theme";
import { icons, images } from "@/app/MyAssets";
import { vh, vw } from "@/app/utils/units";

import { setBaseURL } from "@/app/api";
import { useAppDispatch } from "../../HomeScreens/LandingScreen";
import { getAllClubs, getGeneralAllClubs } from "@/app/api/Auth";
import {
  setAllClubs,
  setClubConfig,
  toggleBtnLoader,
} from "@/app/store/slices/generalSlice";
import { useSelector } from "react-redux";
import ArchivoMedium from "@/app/components/TextWrapper/ArchivoMedium";
import { LinearGradient } from "expo-linear-gradient";
import BerlingskeBold from "@/app/components/TextWrapper/BerlingskeBold";
import GeneralHeader from "@/app/components/GeneralHeader";
import axios from "axios";
import { sportsIcon } from "@/app/components/HomeHeader";
import Skeleton from "react-native-reanimated-skeleton";
import Animated, { FadeIn } from "react-native-reanimated";
import ImageView from "react-native-image-viewing";
import PoweredBy from "@/app/components/PoweredBy";
import ImageGalleryViewerPopup from "@/app/components/ImageGalleryViewer";
import { RootState } from "@/app/store";
import {
  removeLoginDetails,
  saveLoginDetails,
} from "@/app/store/slices/userSlice";
import LoaderComponent from "@/app/components/Loader";
import { router } from "expo-router";
import moment from "moment";

const index = () => {
  const [clubs, setClubs] = useState([1, 2]);
  const dispatch = useAppDispatch();
  const loader = useSelector((state: any) => state.general.generalLoader);
  const allClubsInRedux = useSelector((state: any) => state.general.allClubs);
  const nextFetchDate = useSelector(
    (state: any) => state.general.nextFetchDate
  );

  const multipleUsers = useSelector(
    (state: RootState) => state.user.multipleUsers
  );
  const [localLoader, setLocalLoader] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [showGalleryViewer, setGalleryViewer] = useState(false);
  const imageGalleryRef = useRef();
  useEffect(() => {
    fetchClubs();
  }, []);

  console.log(clubs, "all clubs");

  const fetchClubs = async () => {
    try {
      setLocalLoader(true);
      const isDatePassed = moment().isBefore(moment(nextFetchDate));
      if (allClubsInRedux && isDatePassed) {
        setLocalLoader(false);
        console.log(nextFetchDate, "nextFetchDate");
        setClubs(allClubsInRedux);
        return;
      }
      const response = await getGeneralAllClubs();

      console.log(response.data, "response of clubs");
      const allClubs = response?.data;
      dispatch(setAllClubs(allClubs));
      setClubs(allClubs); // Update state once all clubs are processed
      setLocalLoader(false);
    } catch (error) {}

    // const clubs = response.data;
    // setClubs(clubs);
    // getEachClubData(clubs, 0);
    // console.log(clubs, "response of clubs");
  };

  // const getEachClubData = async (allClubs, index, clubsData = []) => {
  //   if (index >= allClubs.length) {
  //     setClubs(clubsData); // Update state once all clubs are processed
  //     console.log(clubsData, "Finished processing all clubs.");
  //     dispatch(setAllClubs(clubsData));
  //     return;
  //   }

  //   const currentUrl = allClubs[index];

  //   try {
  //     const response = await axios.get(
  //       `${currentUrl}/api/v1/SportServices/sport/club/services`
  //     );
  //     const clubDetails = response.data;

  //     // Recursively process the next club
  //     await getEachClubData(allClubs, index + 1, [...clubsData, clubDetails]);
  //   } catch (error) {
  //     console.error(`Error fetching data for club at ${currentUrl}:`, error);
  //     await getEachClubData(allClubs, index + 1, [...clubsData, null]); // Keep track of failed requests
  //   }
  // };

  const handleClubPress = (item) => {
    try {
      // setLocalLoader(true);
      let isExist = multipleUsers?.find(
        (element) => element.club?.title == item.title
      );
      setBaseURL(`${item.apiURL}`);
      // dispatch(toggleBtnLoader(true));
      dispatch(setClubConfig(item));
      console.log(isExist, "existing user");
      if (isExist?.user) {
        dispatch(saveLoginDetails(isExist?.user));
        setTimeout(() => {
          setLocalLoader(false);
          router.replace("/(tabs)/homestack/");
        }, 100);
      } else {
        dispatch(removeLoginDetails());

        setTimeout(() => {
          setLocalLoader(false);
          router.replace("/login");
        }, 100);
      }

      // setTimeout(() => {
      //   setLocalLoader(false);
      //   router.replace("/login");
      // }, 2000);
    } catch (error) {
      setLocalLoader(false);
    }
  };

  const sortGallery = (data) => {
    let tempArr = [];
    data.gallery.map((item) => {
      tempArr.push({ uri: item });
    });
    setGalleryImages(tempArr);
  };

  const isAlreadyLoggedIn = (obj) => {
    if (multipleUsers?.length) {
      let isExist = multipleUsers?.find(
        (item) => item.club?.title == obj.title
      );
      if (isExist) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const renderClub = ({ item }) => (
    <View style={styles.clubCard}>
      <Pressable
        onPress={() => {
          if (item?.title) {
            handleClubPress(item);
          }
        }}
        style={{
          height: "60%",
          position: "absolute",
          width: "100%",
          zIndex: 100,
        }}
      ></Pressable>
      {item?.title ? (
        <Animated.View
          entering={FadeIn.duration(350)}
          style={{
            flex: 1,
          }}
        >
          <ImageBackground
            style={{
              flex: 1,
              alignItems: "flex-end",
              justifyContent: "flex-end",
            }}
            imageStyle={{ width: "100%", height: "100%", resizeMode: "cover" }}
            source={{ uri: item?.clubImage }}
          >
            <View style={styles.bottomBlurCard}>
              <View style={styles.circle}>
                <Image
                  source={images.jugaar}
                  style={{
                    height: "100%",
                    width: "100%",
                    resizeMode: "contain",
                  }}
                />
              </View>

              <LinearGradient
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingHorizontal: "5%",
                  zIndex: 10,
                }}
                colors={["#5A564E", "#5A564E", "#2F2F2D"]}
                start={{ x: 1, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.col1}>
                  <BerlingskeBold style={styles.cardTitle}>
                    {item?.title}
                  </BerlingskeBold>
                  {item?.shortDescription ? (
                    <ArchivoMedium style={styles.description} numberOfLines={1}>
                      {item?.shortDescription}
                    </ArchivoMedium>
                  ) : null}

                  <View
                    style={{
                      height: vh * 5,
                      width: "100%",
                      zIndex: 100,
                      marginTop: 5,
                    }}
                  >
                    <FlatList
                      horizontal
                      data={item?.sportServices}
                      style={{ flex: 1 }}
                      nestedScrollEnabled={true} // Enable nested scrolling
                      contentContainerStyle={{
                        paddingRight: 5,
                        alignItems: "center",
                      }}
                      renderItem={({ item: element }) => {
                        return (
                          <TouchableOpacity
                            disabled={element?.gallery?.length ? false : true}
                            onPress={() => {
                              if (element.gallery?.length) {
                                imageGalleryRef.current?.show(
                                  element?.gallery,
                                  element?.title
                                );
                                sortGallery(element);
                                // setGalleryViewer(true);
                              }
                            }}
                            style={styles.sportIcon}
                          >
                            <Image
                              source={sportsIcon[element?.title.toLowerCase()]}
                              style={{
                                width: "70%",
                                height: "70%",
                                resizeMode: "contain",
                                tintColor: "black",
                              }}
                            />
                          </TouchableOpacity>
                        );
                      }}
                    />
                  </View>
                </View>
                <View style={{ width: "35%", alignItems: "flex-end" }}>
                  <Pressable
                    onPress={() => handleClubPress(item)}
                    style={styles.loginBtn}
                  >
                    <Image source={icons.enterLogin} style={[styles.btnIcon]} />
                  </Pressable>
                </View>
              </LinearGradient>
            </View>
          </ImageBackground>
        </Animated.View>
      ) : (
        <View
          style={{
            flex: 1,
            width: "100%",
            justifyContent: "flex-end",
            paddingHorizontal: "5%",
            paddingBottom: "2%",
          }}
        >
          <View
            style={{
              width: "106%",
              height: "55%",
              top: 0,
              position: "absolute",
              alignSelf: "flex-start",
            }}
          >
            <Image
              source={icons.imagePlaceholder}
              style={{
                height: "100%",
                width: "100%",
                resizeMode: "contain",
                alignSelf: "center",
                tintColor: "#0001",
              }}
            />
          </View>
          <View
            style={{
              height: "45%",
              justifyContent: "center",
            }}
          >
            {!__DEV__ ? (
              <View>
                <Skeleton
                  containerStyle={{ alignItems: "flex-start" }}
                  isLoading={true}
                  boneColor="#d0d0d0"
                  highlightColor="#ffffff"
                >
                  <View style={{ height: 15, width: "30%" }}></View>
                  <View
                    style={{ height: 15, width: "50%", marginVertical: 3 }}
                  ></View>
                </Skeleton>
                <Skeleton
                  containerStyle={{
                    alignItems: "flex-start",
                    flexDirection: "row",
                    marginTop: 5,
                  }}
                  isLoading={true}
                  boneColor="#d0d0d0"
                  highlightColor="#ffffff"
                >
                  <View
                    style={{
                      height: vh * 5,
                      width: vh * 5,
                      borderRadius: 100,
                      marginRight: 10,
                    }}
                  ></View>
                  <View
                    style={{
                      height: vh * 5,
                      width: vh * 5,
                      borderRadius: 100,
                      marginRight: 10,
                    }}
                  ></View>
                  <View
                    style={{
                      height: vh * 5,
                      width: vh * 5,
                      borderRadius: 100,
                      marginRight: 10,
                    }}
                  ></View>
                  <View
                    style={{
                      height: vh * 5,
                      width: vh * 5,
                      borderRadius: 100,
                      marginRight: 10,
                    }}
                  ></View>
                </Skeleton>
              </View>
            ) : null}
          </View>
        </View>
      )}
      {/* <Image source={{ uri: item.logo }} style={styles.clubImage} />
      <Text style={styles.clubName}>{item.title}</Text> */}
    </View>
  );

  return (
    <ImageBackground
      source={images.linesBackground}
      imageStyle={{ width: "100%", height: "100%", resizeMode: "cover" }}
      style={styles.container}
    >
      <GeneralHeader disable={true} title="Sports Clubs" color={"#2A2F28"} />
      <ImageGalleryViewerPopup reference={imageGalleryRef} />
      <ImageView
        images={galleryImages}
        imageIndex={0}
        visible={showGalleryViewer}
        presentationStyle="overFullScreen"
        onRequestClose={() => setGalleryViewer(false)}
        FooterComponent={({ imageIndex }) => {
          return (
            <View style={{ alignSelf: "center", bottom: 40 }}>
              <Text style={{ color: "white" }}>
                {imageIndex + 1} / {galleryImages.length}
              </Text>
            </View>
          );
        }}
      />
      <View style={{ flex: 0.9, paddingHorizontal: "5%" }}>
        <FlatList
          data={clubs}
          renderItem={renderClub}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => {
            return (
              <View>
                {localLoader ? (
                  <ActivityIndicator
                    size={"small"}
                    color={themeColors.primary}
                  />
                ) : (
                  <ArchivoMedium style={{ alignSelf: "center" }}>
                    No Clubs Found
                  </ArchivoMedium>
                )}
              </View>
            );
          }}
        />
      </View>
      <View style={styles.poweredBy}>
        <PoweredBy />
      </View>
    </ImageBackground>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.white,
    // paddingHorizontal: vw * 4,
  },
  logo: {
    height: vh * 10,
    width: vh * 10,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: vh * 2,
    marginTop: vh * 5,
  },
  listContainer: {
    paddingBottom: vh * 2,
    paddingHorizontal: vw * 2,
    marginTop: 20,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: vh * 2,
  },
  clubCard: {
    // width: vw * 42,
    height: vh * 35,
    marginBottom: 20,
    backgroundColor: themeColors.lightGray,
    borderRadius: vh * 2.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    overflow: "hidden",
    zIndex: 100,
  },
  clubImage: {
    height: vh * 12,
    width: vh * 12,
    resizeMode: "contain",
    marginBottom: vh * 1,
  },
  clubName: {
    fontSize: vh * 1.5,
    fontWeight: "bold",
    color: themeColors.darkText,
    textAlign: "center",
    marginBottom: vh * 0.5,
  },
  clubDescription: {
    fontSize: vh * 1.5,
    color: themeColors.gray,
    textAlign: "center",
  },
  title: {
    fontSize: vh * 2.4,
    marginBottom: vh * 4,
    alignSelf: "center",
    textAlign: "center",
  },
  bottomBlurCard: {
    height: "40%",
    width: "100%",
    backgroundColor: "#0000008c",
    alignSelf: "flex-end",
  },
  col1: {
    width: "65%",
  },
  cardTitle: {
    color: "white",
    fontSize: vh * 2.2,
  },
  description: {
    color: "white",
    fontSize: vh * 1.5,
  },
  sportIcon: {
    height: vh * 4.5,
    width: vh * 4.5,
    borderRadius: 100,
    backgroundColor: "#CCFF05",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  loginBtn: {
    width: vh * 5,
    height: vh * 5,
    borderRadius: 10,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  btnIcon: {
    height: "55%",
    width: "55%",
    resizeMode: "contain",
  },
  circle: {
    height: 140,
    width: "120%",
    // backgroundColor: "#5A564E",
    position: "absolute",
    top: -vh * 1.2,
    zIndex: -1,
    alignSelf: "center",
    // borderRadius: vh * 100,
  },
  poweredBy: {
    position: "absolute",
    bottom: vh * 1.5,
    alignSelf: "center",
  },
});
