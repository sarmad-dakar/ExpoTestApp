import { StyleSheet, Text, View, Alert } from "react-native";
import React, { useRef, useState } from "react";
import GeneralHeader from "@/app/components/GeneralHeader";
import InputField from "@/app/components/InputField";
import { icons } from "@/app/MyAssets";
import MainButton from "@/app/components/MainButton";
import BerlingskeBold from "@/app/components/TextWrapper/BerlingskeBold";
import SelectDropDown, { SelectDropdownRef } from "@/app/components/Dropdown";
import { postContactus } from "@/app/api/Auth";
import { router } from "expo-router";
import { showErrorToast, showSuccessToast } from "@/app/utils/toastmsg";
const ContactTypes = [
  { label: "Complaint", value: "complaint" },
  { label: "Help", value: "help" },
  { label: "Inquiry", value: "inquiry" },
  { label: "Suggestion", value: "suggestion" },
];

interface dropdownTypes {
  label?: string;
  value?: string;
  title?: string;
  key?: string;
}

const ContactScreen = () => {
  const [contactType, setContactType] = useState<dropdownTypes>();
  const [message, setMessage] = useState("");
  const dropdownRef = useRef<SelectDropdownRef>(null);

  const handleContact = async () => {
    // Validation
    if (!contactType || !contactType.label) {
      showErrorToast("Please Select a contact Type");
      return;
    }
    if (!message.trim()) {
      showErrorToast("Please enter your message");
      return;
    }

    let data = {
      Message: message,
      Type: contactType.label,
    };

    const response = await postContactus(data);
    router.back();
  };

  return (
    <View style={styles.container}>
      <GeneralHeader title="Contact Us" back={true} />
      <View style={{ flex: 1, paddingHorizontal: "4%", paddingTop: "10%" }}>
        <BerlingskeBold>Write Your Query</BerlingskeBold>
        <InputField
          dropdown={true}
          onPress={() => dropdownRef.current?.show()}
          icon={icons.calendar}
          rightIcon={icons.dropdown}
          value={contactType?.label || "Select Type"}
          textAlignVertical={"top"}
          inputStyle={{
            alignItems: "flex-start",
            borderRightWidth: 1,
            borderLeftWidth: 1,
            borderWidth: 1,
            paddingTop: "2%",
            borderColor: "#0004",
            borderRadius: 5,
          }}
        />
        <View style={{ height: 10 }} />
        <InputField
          icon={icons.calendar}
          placeholder="Write your message"
          longText={true}
          multiline={true}
          onChangeText={setMessage}
          textAlignVertical={"top"}
          inputStyle={{
            height: 150,
            alignItems: "flex-start",
            borderRightWidth: 1,
            borderLeftWidth: 1,
            borderWidth: 1,
            borderColor: "#0004",
            borderRadius: 5,
            paddingTop: 10,
          }}
        />
        <MainButton title="Submit" onPress={handleContact} />
      </View>
      <SelectDropDown
        reference={dropdownRef}
        onChangeValue={setContactType}
        values={ContactTypes}
      />
    </View>
  );
};

export default ContactScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
