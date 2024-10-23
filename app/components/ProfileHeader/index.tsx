import {
  Image,
  ImageProps,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { icons, images } from "@/app/MyAssets";
import { colors } from "@/app/utils/theme";
import { vh } from "@/app/utils/units";
import BerlingskeMedium from "../TextWrapper/BerlingskeMedium";
import * as ImagePicker from "expo-image-picker";
import { updateProfilePic } from "@/app/api/Auth";
import { useAppDispatch } from "@/app/screens/HomeScreens/LandingScreen";
import { fetchuserProfile } from "@/app/store/slices/userSlice";

type headerProps = {
  title: string;
  image: string;
};

const ProfileHeader = ({ title, image }: headerProps) => {
  const [profilePic, setProfilePic] = useState({ uri: "" });
  const dispatch = useAppDispatch();

  useEffect(() => {
    setProfilePic({ uri: image });
  }, [image]);

  const onCameraPress = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedPhoto = result.assets[0];
      let data = {
        uri: selectedPhoto.uri,
        type: selectedPhoto.mimeType,
        name: selectedPhoto.fileName,
        fieldName: "file",
      };
      const formData = new FormData();
      formData.append("file", data);

      let response = await updateProfilePic(formData);
      console.log(response.data, "response of update profile");
      if (response.data.msgCode == "200") {
        dispatch(fetchuserProfile());
        setProfilePic(selectedPhoto);
      }
    }
  };

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
        <Image source={profilePic || images.dummyAvatar} style={styles.image} />
        <TouchableOpacity
          onPress={onCameraPress}
          style={styles.cameraContainer}
        >
          <Image source={icons.camera} style={styles.cameraLogo} />
        </TouchableOpacity>
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
