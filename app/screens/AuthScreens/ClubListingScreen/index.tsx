import {
  Image,
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { themeColors } from "@/app/utils/theme";
import { images } from "@/app/MyAssets";
import { vh, vw } from "@/app/utils/units";
import PoweredBy from "@/app/components/PoweredBy";
import BerlingskeMedium from "@/app/components/TextWrapper/BerlingskeMedium";
import { router } from "expo-router";
import { setBaseURL } from "@/app/api";
import { useAppDispatch } from "../../HomeScreens/LandingScreen";
import { getAllClubs } from "@/app/api/Auth";
import { setClubConfig } from "@/app/store/slices/generalSlice";

const clubs = [
  {
    id: "1",
    name: "Dakar Club",
    description: "The best club in town.",
    image: images.dakarLogo,
    url: "sarmad",
  },
  {
    id: "2",
    name: "Safari Club",
    description: "Experience the wild nightlife.",
    image: images.dakarLogo, // Replace with a unique image for each club
    url: "hammza",
  },
  {
    id: "3",
    name: "Oasis Club",
    description: "A serene place to relax.",
    image: images.dakarLogo,
    url: "hammza",
  },
  {
    id: "4",
    name: "Neon Club",
    description: "Glow up your night!",
    image: images.dakarLogo,
    url: "hammza",
  },
];

const index = () => {
  const [clubs, setClubs] = useState([]);
  const dispatch = useAppDispatch();
  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    const response = await getAllClubs();
    setClubs(response.data);
    console.log(response, "response of clubs");
  };

  const handleClubPress = (item) => {
    setBaseURL(`${item.apiURL}`);
    dispatch(setClubConfig(item));

    setTimeout(() => {
      router.push("/onboarding");
    }, 1000);
  };

  const renderClub = ({ item }) => (
    <Pressable
      onPress={() => {
        handleClubPress(item);
      }}
      style={styles.clubCard}
    >
      <Image source={{ uri: item.logo }} style={styles.clubImage} />
      <Text style={styles.clubName}>{item.title}</Text>
      <Text style={styles.clubDescription}>{item.shortTitle}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Image source={images.dakarLogo} style={styles.logo} />
      <BerlingskeMedium style={styles.title}>
        Please Select Your Club to proceed
      </BerlingskeMedium>
      <View style={{ flex: 0.8, paddingHorizontal: 5 }}>
        <FlatList
          data={clubs}
          renderItem={renderClub}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <PoweredBy />
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.white,
    paddingHorizontal: vw * 4,
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
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: vh * 2,
  },
  clubCard: {
    width: vw * 42,
    backgroundColor: themeColors.lightGray,
    borderRadius: vh * 1,
    alignItems: "center",
    padding: vh * 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  clubImage: {
    height: vh * 8,
    width: vh * 8,
    resizeMode: "contain",
    marginBottom: vh * 1,
  },
  clubName: {
    fontSize: vh * 2,
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
});
