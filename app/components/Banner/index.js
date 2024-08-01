import { View, Text, Image } from "react-native";
import React from "react";
import { styles } from "./styles";
import BerlingskeRegular from "../../components/TextWrapper/BerlingskeRegular";
import { colors } from "@/app/utils/theme";
import { images } from "@/app/MyAssets";
const Ring = () => {
  return (
    <View style={styles.ring1}>
      <View style={styles.ring2}>
        <View style={styles.ring3}>
          <View style={styles.ring4}>
            <Image source={images.AppLogov2} style={styles.image} />
          </View>
        </View>
      </View>
    </View>
  );
};

const Banner = () => {
  return (
    <View style={styles.container}>
      <BerlingskeRegular style={{ color: colors.secondary, width: 170 }}>
        Welcome{" "}
        <BerlingskeRegular style={{ color: "white" }}>
          To The Marsa Sports Club
        </BerlingskeRegular>
      </BerlingskeRegular>
      <Text style={{ color: "white" }}>Book Your Sport Slot With Us.</Text>
      <Ring />
    </View>
  );
};

export default Banner;
