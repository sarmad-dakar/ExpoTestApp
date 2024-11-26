import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import ProfileHeader from "@/app/components/ProfileHeader";
import InputField from "@/app/components/InputField";
import { icons } from "@/app/MyAssets";
import ScreenWrapper from "@/app/components/ScreenWrapper";
import BerlingskeBold from "@/app/components/TextWrapper/BerlingskeBold";
import MainButton from "@/app/components/MainButton";
import { themeColors } from "@/app/utils/theme";
import AddCarNumberPopup, {
  AddCarNumberPopupRef,
} from "@/app/components/AddCarNumberPopup";
import AddChildrenPopup, {
  AddChildrenPopupRef,
} from "@/app/components/AddChildrenPopup";
import { useSelector } from "react-redux";
import { vh, vw } from "@/app/utils/units";
import { updateUserInfo } from "@/app/api/Auth";
import { useAppDispatch } from "../LandingScreen";
import { fetchMyProfile } from "@/app/store/slices/userSlice";
import AddPhonePopup, {
  AddPhonePopupRef,
} from "@/app/components/AddPhoneNumberPopup";
import ArchivoExtraLight from "@/app/components/TextWrapper/ArchivoExtraLight";
import { RootState } from "@/app/store";
import { toggleBtnLoader } from "@/app/store/slices/generalSlice";

interface children {
  name: string;
  dateOfBirth: string;
}

interface telephoneObj {
  type: string;
  number: string;
}

const telephoneIcons = {
  Mobile: icons.iphone,
  Home: icons.landline,
  Office: icons.callingPhone,
};

const ProfileScreen = () => {
  const carNumberPopupRef = useRef<AddCarNumberPopupRef>(null);
  const AddChildrenPopupRef = useRef<AddChildrenPopupRef>(null);
  const AddPhoneRef = useRef<AddPhonePopupRef>(null);

  const [currentChildren, setCurrentChildren] = useState<children[]>([]);
  const [currentCars, setCurrentCars] = useState<string[]>([]);
  const user = useSelector((state: any) => state.user.profile);
  const profile = useSelector((state: any) => state.user.user);

  const [editableUser, setEditableUser] = useState<any>(user);
  const [isEdited, setIsEdited] = useState(false); // Track if fields have been edited
  const [enableSave, setEnableSave] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user?.children) {
      setCurrentChildren(user.children);
    }
    if (user?.carInfo) {
      setCurrentCars(user.carInfo);
    }
    setEditableUser(user);
  }, [user]);

  const onAddChildren = (children: children) => {
    setIsEdited(true);
    setEnableSave(false);

    setCurrentChildren([...currentChildren, children]);
  };
  const onAddCar = (car: string) => {
    setIsEdited(true);
    setEnableSave(false);

    setCurrentCars([...currentCars, car]);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditableUser({ ...editableUser, [field]: value });
    setIsEdited(true); // Mark as edited
    setEnableSave(true);
  };

  const handleCancel = () => {
    setEditableUser(user); // Revert to Redux state
    if (user?.children) {
      setCurrentChildren(user.children);
    }
    if (user?.carInfo) {
      setCurrentCars(user.carInfo);
    }
    setIsEdited(false); // Hide Save and Cancel buttons
    setEnableSave(false);
  };

  // Handle Save
  const handleSave = async () => {
    try {
      setIsEdited(false);
      setEnableSave(false);
      dispatch(toggleBtnLoader(true));
      let data = JSON.parse(JSON.stringify(editableUser));
      data.children = currentChildren;
      data.carInfo = currentCars;

      const response = await updateUserInfo(data);
      console.log(response.data, "Response of update");
      dispatch(toggleBtnLoader(false));

      dispatch(fetchMyProfile());
    } catch (error) {
      dispatch(toggleBtnLoader(false));
    }
  };

  const handleRemoveCars = (item: any) => {
    const removedCars = currentCars.filter((data: any) => item !== data);
    setCurrentCars(removedCars);
    setEnableSave(true); // Mark as edited
  };

  const handleRemoveChildren = (item: any) => {
    const removedChildren = currentChildren.filter(
      (data: any) => item.name !== data.name
    );
    setCurrentChildren(removedChildren);
    setEnableSave(true); // Mark as edited
  };

  const onAddPhone = (data: any) => {
    console.log(data);
    let newData = JSON.parse(JSON.stringify(editableUser));
    newData.telephones.push(data);
    setEditableUser(newData);
    setEnableSave(true); // Mark as edited
  };

  const onRemovePhone = (data: any) => {
    let newData = JSON.parse(JSON.stringify(editableUser));
    const removedPhones = newData.telephones.filter(
      (item: any) => item.number !== data.number
    );
    newData.telephones = removedPhones;
    setEditableUser(newData);
    setEnableSave(true); // Mark as edited
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0} // Adjust the offset as needed
    >
      <View style={styles.mainContainer}>
        <ProfileHeader
          onEditPress={() => setIsEdited(true)}
          title="My Profile"
          image={profile?.profilePic}
          enableSave={enableSave}
          onSavepress={handleSave}
        />
        <AddCarNumberPopup
          onSavePress={onAddCar}
          reference={carNumberPopupRef}
        />
        <AddChildrenPopup
          onSavePress={onAddChildren}
          reference={AddChildrenPopupRef}
        />
        <AddPhonePopup reference={AddPhoneRef} onSavePress={onAddPhone} />
        <ScreenWrapper>
          <ScrollView style={styles.container}>
            <InputField
              placeholder="Name"
              icon={icons.dummyUser}
              rightIcon={isEdited && icons.edit}
              value={editableUser?.name}
              editable={isEdited}
              onChangeText={(value: string) => handleInputChange("name", value)}
            />
            <InputField
              placeholder="Surname"
              icon={icons.dummyUser}
              rightIcon={isEdited && icons.edit}
              value={editableUser?.surName}
              editable={isEdited}
              onChangeText={(value: string) =>
                handleInputChange("surName", value)
              }
            />
            <InputField
              placeholder="Date of Birth"
              icon={icons.dummyUser}
              rightIcon={isEdited && icons.edit}
              value={editableUser?.dateOfBirth}
              editable={isEdited}
              onChangeText={(value: string) =>
                handleInputChange("dateOfBirth", value)
              }
            />
            <InputField
              placeholder="Email"
              icon={icons.email}
              rightIcon={isEdited && icons.edit}
              value={editableUser?.email}
              editable={isEdited}
              onChangeText={(value: string) =>
                handleInputChange("email", value)
              }
            />
            <InputField
              placeholder="Mailing Name"
              icon={icons.idCard}
              rightIcon={isEdited && icons.edit}
              editable={isEdited}
              value={editableUser?.mailingName}
              onChangeText={(value: string) =>
                handleInputChange("mailingName", value)
              }
            />
            <InputField
              placeholder="ID Number"
              icon={icons.idCard}
              rightIcon={isEdited && icons.edit}
              editable={isEdited}
              value={editableUser?.idNo}
              onChangeText={(value: string) => handleInputChange("idNo", value)}
            />

            <InputField
              placeholder="Country"
              icon={icons.global}
              rightIcon={isEdited && icons.edit}
              editable={isEdited}
              value={editableUser?.country}
              onChangeText={(value: string) =>
                handleInputChange("country", value)
              }
            />

            <InputField
              placeholder="Town"
              icon={icons.locationPin}
              rightIcon={isEdited && icons.edit}
              editable={isEdited}
              value={editableUser?.town}
              onChangeText={(value: string) => handleInputChange("town", value)}
            />
            <InputField
              placeholder="Postal Code"
              icon={icons.email}
              rightIcon={isEdited && icons.edit}
              value={editableUser?.postCode}
              editable={isEdited}
              onChangeText={(value: string) =>
                handleInputChange("postCode", value)
              }
            />

            {editableUser?.telephones?.map((item: telephoneObj) => {
              return (
                <InputField
                  icon={
                    telephoneIcons[item.type as keyof typeof telephoneIcons]
                  }
                  value={item.number}
                  editable={isEdited}
                  rightIcon={isEdited && icons.cross}
                  onRightIconPress={() => onRemovePhone(item)}
                />
              );
            })}

            {isEdited ? (
              <MainButton
                style={styles.btn}
                title="Add Phone"
                onPress={() => AddPhoneRef.current?.show()}
              />
            ) : null}
            <View style={styles.rowDirection}>
              <BerlingskeBold style={styles.heading}>
                Children (under 18)
              </BerlingskeBold>

              {isEdited ? (
                <MainButton
                  style={styles.btn}
                  title="ADD CHILDREN"
                  onPress={() => AddChildrenPopupRef.current?.show()}
                />
              ) : null}
            </View>
            {currentChildren?.map((item) => {
              return (
                <View style={styles.listContainer}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                      source={icons.baby}
                      style={[styles.icon, { marginRight: 10 }]}
                    />

                    <Text style={styles.btnText}>
                      {item.name} || {item.dateOfBirth}
                    </Text>
                  </View>
                  {isEdited ? (
                    <TouchableOpacity
                      onPress={() => handleRemoveChildren(item)}
                    >
                      <Image source={icons.cross} style={styles.icon} />
                    </TouchableOpacity>
                  ) : null}
                </View>
              );
            })}

            <View style={styles.rowDirection}>
              <BerlingskeBold style={styles.heading}>
                Car Numbers
              </BerlingskeBold>
              {isEdited ? (
                <MainButton
                  style={styles.btn}
                  title="ADD CAR NUMBER"
                  onPress={() => carNumberPopupRef.current?.show()}
                />
              ) : null}
            </View>

            {currentCars?.map((item) => {
              return (
                <View style={styles.listContainer}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                      source={icons.vehicle}
                      style={[styles.icon, { marginRight: 10 }]}
                    />

                    <Text style={styles.btnText}>{item}</Text>
                  </View>
                  {isEdited ? (
                    <TouchableOpacity onPress={() => handleRemoveCars(item)}>
                      <Image source={icons.cross} style={styles.icon} />
                    </TouchableOpacity>
                  ) : null}
                </View>
              );
            })}

            <View style={styles.divider} />
            <ArchivoExtraLight style={styles.description}>
              I hereby give my consent to the Marsa Sports Club to process,
              retain record and use my personal data, which is being given
              herewith for the purpose of the administration of the Membership
              register as a Member of the Club. This data will be kept up to
              official resignation by the member. This consent is given in
              compliance with General Data Protection Regulation (GDPR)
              Regulation EU 2016/679. For more information you are requested to
              logon to our website: www.marsasportclub.com to access the Club’s
              Private policy.
            </ArchivoExtraLight>
          </ScrollView>
          {/* Display Save and Cancel buttons if edited */}
          {/* {isEdited ? (
            <View style={styles.actionButtons}>
              <MainButton
                title="Cancel"
                onPress={handleCancel}
                style={styles.cancelButton}
              />
              <MainButton
                title="Save"
                onPress={handleSave}
                style={styles.saveButton}
              />
            </View>
          ) : null} */}
        </ScreenWrapper>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: "2%",
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  rowDirection: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  btn: {
    width: "40%",
    height: vh * 3.7,
  },
  divider: {
    height: 1,
    backgroundColor: themeColors.gray,
    marginTop: 10,
  },
  description: {
    textAlign: "center",
    marginTop: 10,
    fontSize: vh * 1.5,
    color: themeColors.primary,
    marginBottom: 50,
  },
  listContainer: {
    height: 40,
    backgroundColor: themeColors.lightGray,
    justifyContent: "space-between",
    borderRadius: 50,
    marginTop: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    height: 16,
    width: 16,
    resizeMode: "contain",
  },
  saveButton: {
    backgroundColor: themeColors.secondary,
    width: "47%",
  },
  cancelButton: {
    backgroundColor: themeColors.red,
    width: "47%",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 0,
    width: vw * 100,
    height: 130,
    backgroundColor: "white",
    paddingHorizontal: "4%",
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: themeColors.lightGray,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  heading: {
    fontSize: vh * 2.4,
    marginTop: 10,
  },
  btnText: {
    fontSize: 13,
  },
});
