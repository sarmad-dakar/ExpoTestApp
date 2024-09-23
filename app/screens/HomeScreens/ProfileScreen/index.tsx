import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useRef, useState } from "react";
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

const ProfileScreen = () => {
  const carNumberPopupRef = useRef<AddCarNumberPopupRef>(null);
  const AddChildrenPopupRef = useRef<AddChildrenPopupRef>(null);
  const [currentChildren, setCurrentChildren] = useState<string[]>([]);
  const [currentCars, setCurrentCars] = useState<string[]>([]);

  const onAddChildren = (children: string) => {
    setCurrentChildren([...currentChildren, children]);
  };
  const onAddCar = (car: string) => {
    setCurrentCars([...currentCars, car]);
  };

  return (
    <View style={styles.mainContainer}>
      <ProfileHeader title="My Profile" />
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
          />
          <InputField
            placeholder="Surname"
            icon={icons.dummyUser}
            rightIcon={icons.edit}
          />
          <InputField
            placeholder="Date of Birth"
            icon={icons.dummyUser}
            rightIcon={icons.edit}
          />
          <InputField
            placeholder="Email"
            icon={icons.email}
            rightIcon={icons.edit}
          />
          <InputField
            placeholder="Mailing Name"
            icon={icons.idCard}
            rightIcon={icons.edit}
          />
          <InputField
            placeholder="ID Number"
            icon={icons.idCard}
            rightIcon={icons.edit}
          />
          <InputField
            placeholder="Mobile Number"
            icon={icons.iphone}
            rightIcon={icons.edit}
          />
          <InputField
            placeholder="Home Number"
            icon={icons.landline}
            rightIcon={icons.edit}
          />
          <InputField
            placeholder="Office Number"
            icon={icons.locationPin}
            rightIcon={icons.edit}
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
                <Text>{item}</Text>
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
                <Text>{item}</Text>
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
    fontSize: 17,
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
