import { Image, ImageProps, StyleSheet, Text, View } from "react-native";
import React from "react";
import { icons, images } from "@/app/MyAssets";
import { colors } from "@/app/utils/theme";
import { vh } from "@/app/utils/units";
import BerlingskeMedium from "../TextWrapper/BerlingskeMedium";

type headerProps = {
  title: string;
  image: ImageProps;
};

const ProfileHeader = ({ title, image }: headerProps) => {
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ alignItems: "center", width: 60 }}>
          <Image source={icons.back} style={[styles.logo]} />
        </View>
        <BerlingskeMedium style={styles.selectedSport}>
          {title}
        </BerlingskeMedium>
        <View style={{ width: 60 }}></View>
      </View>

      <View style={styles.profileConatiner}>
        <Image
          source={image ? { uri: image } : images.dummyAvatar}
          style={styles.image}
        />
        <View style={styles.cameraContainer}>
          <Image source={icons.camera} style={styles.cameraLogo} />
        </View>
      </View>
    </View>
  );
};

export default ProfileHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    // height: vh * 20,
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
    // justifyContent: "space-between",
    // flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 35,
    paddingBottom: 15,
  },
  logo: {
    height: 20,
    width: 20,
    resizeMode: "contain",
    tintColor: colors.white,
  },
  selectedSport: {
    color: "white",
  },
  profileConatiner: {
    height: 80,
    width: 80,
    borderRadius: 100,
    alignSelf: "center",
    marginTop: 10,
    // overflow: "hidden",
  },
  image: {
    height: "100%",
    width: "100%",
    resizeMode: "cover",
    borderRadius: 100,
  },
  cameraContainer: {
    height: 35,
    width: 35,
    borderRadius: 100,
    backgroundColor: "white",
    position: "absolute",
    zIndex: 100,
    right: -10,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraLogo: {
    width: "60%",
    height: "60%",
    resizeMode: "contain",
  },
});
