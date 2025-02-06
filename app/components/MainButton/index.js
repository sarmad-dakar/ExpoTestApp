import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { themeColors } from "../../utils/theme";
import { icons } from "@/app/MyAssets";
import { useTheme } from "@react-navigation/native";
import { vh } from "@/app/utils/units";

const MainButton = (props) => {
  const [width, setWidth] = useState(Dimensions.get("window").width);
  const [height, setHeight] = useState(Dimensions.get("window").height);
  const styles = MyStyles();
  const handleOrientationChange = () => {
    const { width, height } = Dimensions.get("window");
    setWidth(width);
    setHeight(height);
  };
  useEffect(() => {
    // Add dimension change listener
    const unSub = Dimensions.addEventListener(
      "change",
      handleOrientationChange
    );

    // Remove the listener when the component unmounts
    return () => {
      unSub.remove();
    };
  }, []);

  return (
    <TouchableOpacity
      class="Sarmad"
      onPress={props.onPress}
      activeOpacity={0.7}
      disabled={props.disabled || props.loading || false}
      {...props}
      style={[
        styles.container,
        height < 420 && { height: 35, borderRadius: 7 },
        props.style,
        props.disabled && { backgroundColor: themeColors.gray },
      ]}
    >
      {props.icon && <Image source={props.icon} style={styles.icon} />}
      {props.loading ? (
        <ActivityIndicator size={"small"} color={"black"} />
      ) : (
        <Text
          style={[
            styles.buttonText,
            {
              borderRadius: 5,
              fontSize: props.style?.height ? props.style?.height / 3 : 14,
            },
          ]}
        >
          {props.title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default MainButton;

const MyStyles = () => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      height: vh * 4.3,
      width: "100%",
      backgroundColor: colors.secondary,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 100,
      marginVertical: 14,
      alignSelf: "center",
      flexDirection: "row",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,

      elevation: 3,
    },
    buttonText: {
      color: "black",
      fontSize: 14,
      fontWeight: "bold",
      textTransform: "uppercase",
    },
    icon: {
      height: 15,
      width: 15,
      resizeMode: "contain",
      tintColor: "black",
      marginRight: 5,
    },
  });
  return styles;
};
