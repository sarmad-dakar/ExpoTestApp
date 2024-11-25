import {
  ActivityIndicator,
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
import BerlingskeMedium from "../TextWrapper/BerlingskeMedium";
import * as ImagePicker from "expo-image-picker";
import { updateProfilePic } from "@/app/api/Auth";
import { useAppDispatch } from "@/app/screens/HomeScreens/LandingScreen";
import { fetchuserProfile } from "@/app/store/slices/userSlice";
import { router } from "expo-router";
import moment from "moment";
import ArchivoRegular from "../TextWrapper/ArchivoRegular";
import { useSelector } from "react-redux";
import ArchivoExtraLight from "../TextWrapper/ArchivoExtraLight";
import { vh } from "@/app/utils/units";
import { RootState } from "@/app/store";

type headerProps = {
  title: string;
  image: string;
  onEditPress: () => void;
  enableSave: boolean;
  onSavepress: () => void;
};

const ProfileHeader = ({
  title,
  image,
  onEditPress,
  enableSave,
  onSavepress,
}: headerProps) => {
  const [profilePic, setProfilePic] = useState({ uri: "" });
  const dispatch = useAppDispatch();
  const user = useSelector((state: any) => state.user.profile);
  const loading = useSelector((state: RootState) => state.general.btnLoader);

  console.log(user, "user");

  useEffect(() => {
    if (image) {
      setProfilePic({ uri: image });
    }
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
      console.log(selectedPhoto, " selected photo ");

      let data = {
        uri: selectedPhoto.uri,
        type: selectedPhoto.mimeType,
        name: selectedPhoto.fileName,
        // fieldName: "file",
      };
      if (!data?.name) {
        var newName = data.uri?.split("/");
        var lastname = newName[newName?.length - 1];
        data.name = lastname;
      }
      console.log(data);
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
  console.log(loading, "loading");

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ alignItems: "center", width: 60 }}
        >
          <Image source={icons.back} style={[styles.logo]} />
        </TouchableOpacity>

        <BerlingskeMedium style={styles.selectedSport}>
          {title}
        </BerlingskeMedium>

        <View style={{ width: 60 }}></View>
      </View>

      <View style={styles.footerContainer}>
        <View style={styles.profileConatiner}>
          <Image
            source={profilePic || images.dummyAvatar}
            style={styles.image}
          />
          <TouchableOpacity
            onPress={onCameraPress}
            style={styles.cameraContainer}
          >
            <Image source={icons.camera} style={styles.cameraLogo} />
          </TouchableOpacity>
        </View>
        <View style={{ marginLeft: "5%" }}>
          <ArchivoRegular style={styles.name}>
            {user?.name} {user?.surName}
          </ArchivoRegular>
          <ArchivoExtraLight style={styles.email}>
            {user?.email}
          </ArchivoExtraLight>
        </View>
        {enableSave ? (
          <TouchableOpacity
            style={{
              zIndex: 100,
              height: 40,
              width: 40,
              backgroundColor: colors.white,
              borderRadius: 100,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={onSavepress}
          >
            <Image source={icons.floppy} style={styles.floppyIcon} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            disabled={loading}
            style={{ zIndex: 100 }}
            onPress={onEditPress}
          >
            {loading ? (
              <ActivityIndicator size={"small"} color={colors.white} />
            ) : (
              <Image source={icons.edit} style={styles.icon} />
            )}
          </TouchableOpacity>
        )}
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
    paddingTop: 55,
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
    // alignSelf: "center",
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
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    // paddingHorizontal: "6%",
  },
  rowDirection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: "10%",
  },
  name: {
    color: colors.white,
    textAlign: "center",
    fontSize: vh * 1.7,
  },
  email: {
    color: colors.white,
    fontSize: vh * 1.5,
    marginTop: -vh * 0.5,
  },
  icon: {
    width: vh * 2.5,
    height: vh * 2.5,
    resizeMode: "contain",
    tintColor: colors.white,
  },
  floppyIcon: {
    height: "50%",
    width: "50%",
    resizeMode: "contain",
  },
});
