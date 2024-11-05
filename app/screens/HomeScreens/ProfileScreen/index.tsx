import {
  Image,
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
import { colors } from "@/app/utils/theme";
import AddCarNumberPopup, {
  AddCarNumberPopupRef,
} from "@/app/components/AddCarNumberPopup";
import AddChildrenPopup, {
  AddChildrenPopupRef,
} from "@/app/components/AddChildrenPopup";
import { useSelector } from "react-redux";
import { vw } from "@/app/utils/units";
import { updateUserInfo } from "@/app/api/Auth";
import { useAppDispatch } from "../LandingScreen";
import { fetchMyProfile } from "@/app/store/slices/userSlice";
import AddPhonePopup, {
  AddPhonePopupRef,
} from "@/app/components/AddPhoneNumberPopup";

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
    setCurrentChildren([...currentChildren, children]);
  };
  const onAddCar = (car: string) => {
    setCurrentCars([...currentCars, car]);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditableUser({ ...editableUser, [field]: value });
    setIsEdited(true); // Mark as edited
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
  };

  // Handle Save
  const handleSave = async () => {
    // API call or dispatch action to save the updated user profile
    setIsEdited(false); // Hide Save and Cancel buttons after save
    let data = JSON.parse(JSON.stringify(editableUser));
    data.children = currentChildren;
    data.carInfo = currentCars;

    const response = await updateUserInfo(data);
    console.log(response.data, "Response of update");
    dispatch(fetchMyProfile());
  };

  const handleRemoveCars = (item: any) => {
    const removedCars = currentCars.filter((data: any) => item !== data);
    setCurrentCars(removedCars);
    setIsEdited(true); // Mark as edited
  };

  const handleRemoveChildren = (item: any) => {
    const removedChildren = currentChildren.filter(
      (data: any) => item.name !== data.name
    );
    setCurrentChildren(removedChildren);
    setIsEdited(true); // Mark as edited
  };

  const onAddPhone = (data: any) => {
    console.log(data);
    let newData = JSON.parse(JSON.stringify(editableUser));
    newData.telephones.push(data);
    setEditableUser(newData);
    setIsEdited(true); // Mark as edited
  };

  const onRemovePhone = (data: any) => {
    let newData = JSON.parse(JSON.stringify(editableUser));
    const removedPhones = newData.telephones.filter(
      (item: any) => item.number !== data.number
    );
    newData.telephones = removedPhones;
    setEditableUser(newData);
    setIsEdited(true); // Mark as edited
  };

  return (
    <View style={styles.mainContainer}>
      <ProfileHeader title="My Profile" image={profile?.profilePic} />
      <AddCarNumberPopup onSavePress={onAddCar} reference={carNumberPopupRef} />
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
            rightIcon={icons.edit}
            value={editableUser?.name}
            onChangeText={(value: string) => handleInputChange("name", value)}
          />
          <InputField
            placeholder="Surname"
            icon={icons.dummyUser}
            rightIcon={icons.edit}
            value={editableUser?.surName}
            onChangeText={(value: string) =>
              handleInputChange("surName", value)
            }
          />
          <InputField
            placeholder="Date of Birth"
            icon={icons.dummyUser}
            rightIcon={icons.edit}
            value={editableUser?.dateOfBirth}
            onChangeText={(value: string) =>
              handleInputChange("dateOfBirth", value)
            }
          />
          <InputField
            placeholder="Email"
            icon={icons.email}
            rightIcon={icons.edit}
            value={editableUser?.email}
            onChangeText={(value: string) => handleInputChange("email", value)}
          />
          <InputField
            placeholder="Mailing Name"
            icon={icons.idCard}
            rightIcon={icons.edit}
            value={editableUser?.mailingName}
            onChangeText={(value: string) =>
              handleInputChange("mailingName", value)
            }
          />
          <InputField
            placeholder="ID Number"
            icon={icons.idCard}
            rightIcon={icons.edit}
            value={editableUser?.idNo}
            onChangeText={(value: string) => handleInputChange("idNo", value)}
          />

          <InputField
            placeholder="Country"
            icon={icons.global}
            rightIcon={icons.edit}
            value={editableUser?.country}
            onChangeText={(value: string) =>
              handleInputChange("country", value)
            }
          />

          <InputField
            placeholder="Town"
            icon={icons.locationPin}
            rightIcon={icons.edit}
            value={editableUser?.town}
            onChangeText={(value: string) => handleInputChange("town", value)}
          />
          <InputField
            placeholder="Postal Code"
            icon={icons.email}
            rightIcon={icons.edit}
            value={editableUser?.postCode}
            onChangeText={(value: string) =>
              handleInputChange("postCode", value)
            }
          />

          {editableUser?.telephones?.map((item: telephoneObj) => {
            return (
              <InputField
                icon={telephoneIcons[item.type as keyof typeof telephoneIcons]}
                value={item.number}
                rightIcon={icons.cross}
                onRightIconPress={() => onRemovePhone(item)}
              />
            );
          })}

          <MainButton
            style={styles.btn}
            title="Add Phone"
            onPress={() => AddPhoneRef.current?.show()}
          />
          <View style={styles.rowDirection}>
            <BerlingskeBold>Children (under 18)</BerlingskeBold>

            <MainButton
              style={styles.btn}
              title="ADD CHILDREN"
              onPress={() => AddChildrenPopupRef.current?.show()}
            />
          </View>
          {currentChildren?.map((item) => {
            return (
              <View style={styles.listContainer}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={icons.baby}
                    style={[styles.icon, { marginRight: 10 }]}
                  />

                  <Text>
                    {item.name} || {item.dateOfBirth}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => handleRemoveChildren(item)}>
                  <Image source={icons.cross} style={styles.icon} />
                </TouchableOpacity>
              </View>
            );
          })}

          <View style={styles.rowDirection}>
            <BerlingskeBold>Car Numbers</BerlingskeBold>
            <MainButton
              style={styles.btn}
              title="ADD CAR NUMBER"
              onPress={() => carNumberPopupRef.current?.show()}
            />
          </View>

          {currentCars?.map((item) => {
            return (
              <View style={styles.listContainer}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={icons.vehicle}
                    style={[styles.icon, { marginRight: 10 }]}
                  />

                  <Text>{item}</Text>
                </View>
                <TouchableOpacity onPress={() => handleRemoveCars(item)}>
                  <Image source={icons.cross} style={styles.icon} />
                </TouchableOpacity>
              </View>
            );
          })}

          <View style={styles.divider} />
          <Text style={styles.description}>
            I hereby give my consent to the Marsa Sports Club to process, retain
            record and use my personal data, which is being given herewith for
            the purpose of the administration of the Membership register as a
            Member of the Club. This data will be kept up to official
            resignation by the member. This consent is given in compliance with
            General Data Protection Regulation (GDPR) Regulation EU 2016/679.
            For more information you are requested to logon to our website:
            www.marsasportclub.com to access the Club’s Private policy.
          </Text>
        </ScrollView>
        {/* Display Save and Cancel buttons if edited */}
        {isEdited ? (
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
        ) : null}
      </ScreenWrapper>
    </View>
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
    height: 25,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray,
    marginTop: 10,
  },
  description: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 14,
    color: colors.primary,
    marginBottom: 50,
  },
  listContainer: {
    height: 40,
    backgroundColor: colors.lightGray,
    justifyContent: "space-between",
    borderRadius: 50,
    marginTop: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    height: 20,
    width: 20,
    resizeMode: "contain",
  },
  saveButton: {
    backgroundColor: colors.secondary,
    width: "47%",
  },
  cancelButton: {
    backgroundColor: colors.gray,
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
  },
});
