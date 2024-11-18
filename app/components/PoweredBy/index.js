import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { images } from "@/app/MyAssets";

const PoweredBy = () => {
  return (
    <View style={styles.container}>
      {/* <Image source={images.dakarLogo} style={styles.dakarLogo} />
      <View
        style={{
          width: 3,
          height: "100%",
          backgroundColor: "#CECECE",
          marginHorizontal: 20,
        }}
      />
      <Text>POWERED BY DAKARSOFTWARE</Text> */}
      <Image source={images.dakarFooterLogo} style={styles.dakarLogo} />
    </View>
  );
};

export default PoweredBy;

const styles = StyleSheet.create({
  container: {
    height: 50,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: "50%",
    alignSelf: "center",
  },
  dakarLogo: {
    height: 200,
    width: 200,
    resizeMode: "contain",
  },
});
