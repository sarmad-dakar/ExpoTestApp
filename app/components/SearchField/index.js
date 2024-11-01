import { StyleSheet, Text, View, TextInput, Image } from "react-native";
import React from "react";
import { icons } from "@/app/MyAssets";

const SearchField = (props) => {
  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={(event) => props.onChangeText(event)}
        style={styles.inputContainer}
        placeholder="Search Members"
      />
      <View
        style={{ width: "15%", justifyContent: "center", alignItems: "center" }}
      >
        <Image source={icons.search} style={styles.icon} />
      </View>
    </View>
  );
};

export default SearchField;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#CBCBCB",
    height: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    borderRadius: 100,
    paddingLeft: 20,
    backgroundColor: "#FAFAFA",
    marginVertical: 10,
  },
  inputContainer: {
    width: "85%",
    // backgroundColor: "green",
  },
  icon: {
    height: 20,
    width: 20,
    resizeMode: "contain",
    tintColor: "#C9C9C9",
  },
});
