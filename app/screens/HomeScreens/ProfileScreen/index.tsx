import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
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
  const [currentChildren, setCurrentChildren] = useState<children[]>([]);
  const [currentCars, setCurrentCars] = useState<string[]>([]);
  const user = useSelector((state: any) => state.user.profile);
  const profile = useSelector((state: any) => state.user.user);

  useEffect(() => {
    if (user.children) {
      setCurrentChildren(user.children);
    }
    if (user.carInfo) {
      setCurrentCars(user.carInfo);
    }
  }, []);

  const onAddChildren = (children: children) => {
    setCurrentChildren([...currentChildren, children]);
  };
  const onAddCar = (car: string) => {
    setCurrentCars([...currentCars, car]);
  };

  console.log(profile, "user profile");
  return (
    <View style={styles.mainContainer}>
      <ProfileHeader title="My Profile" image={profile.profilePic} />
      <AddCarNumberPopup onSavePress={onAddCar} reference={carNumberPopupRef} />
      <AddChildrenPopup
        onSavePress={onAddChildren}
        reference={AddChildrenPopupRef}
      />
      <ScreenWrapper>
        <ScrollView style={styles.container}>
          <InputField
            placeholder="Name"
            icon={icons.dummyUser}
            rightIcon={icons.edit}
            value={user.name}
          />
          <InputField
            placeholder="Surname"
            icon={icons.dummyUser}
            rightIcon={icons.edit}
            value={user.surName}
          />
          <InputField
            placeholder="Date of Birth"
            icon={icons.dummyUser}
            rightIcon={icons.edit}
            value={user.dateOfBirth}
          />
          <InputField
            placeholder="Email"
            icon={icons.email}
            rightIcon={icons.edit}
            value={user.email}
          />
          <InputField
            placeholder="Mailing Name"
            icon={icons.idCard}
            rightIcon={icons.edit}
            value={user.mailingName}
          />
          <InputField
            placeholder="ID Number"
            icon={icons.idCard}
            rightIcon={icons.edit}
            value={user.idNo}
          />
          {user.telephones.map((item: telephoneObj) => {
            return (
              <InputField
                icon={telephoneIcons[item.type as keyof typeof telephoneIcons]}
                value={item.number}
              />
            );
          })}
          <InputField
            placeholder="Country"
            icon={icons.global}
            rightIcon={icons.edit}
            value={user.country}
          />

          <InputField
            placeholder="Town"
            icon={icons.locationPin}
            rightIcon={icons.edit}
            value={user.town}
          />
          <InputField
            placeholder="Postal Code"
            icon={icons.email}
            rightIcon={icons.edit}
            value={user.postCode}
          />

          <View style={styles.rowDirection}>
            <BerlingskeBold>Children (under 18)</BerlingskeBold>

            <MainButton
              style={styles.btn}
              title="ADD CHILDREN"
              onPress={() => AddChildrenPopupRef.current?.show()}
            />
          </View>
          {currentChildren.map((item) => {
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
                <Image source={icons.cross} style={styles.icon} />
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

          {currentCars.map((item) => {
            return (
              <View style={styles.listContainer}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={icons.vehicle}
                    style={[styles.icon, { marginRight: 10 }]}
                  />

                  <Text>{item}</Text>
                </View>
                <Image source={icons.cross} style={styles.icon} />
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
});
