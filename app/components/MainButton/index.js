import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "../../utils/theme";

const MainButton = (props) => {
  const [width, setWidth] = useState(Dimensions.get("window").width);
  const [height, setHeight] = useState(Dimensions.get("window").height);

  const handleOrientationChange = () => {
    const { width, height } = Dimensions.get("window");
    console.log(height, "height");
    setWidth(width);
    setHeight(height);
  };
  console.log(height, "height");
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
      ]}
    >
      {props.loading ? (
        <ActivityIndicator size={"small"} color={"white"} />
      ) : (
        <Text
          style={[
            styles.buttonText,
            {
              borderRadius: 5,
            },
            height < 420 && { fontSize: 12 },
          ]}
        >
          {props.title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default MainButton;

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: "100%",
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    marginVertical: 14,
    alignSelf: "center",
  },
  buttonText: {
    color: "black",
    fontSize: 15,
    fontWeight: "bold",
  },
});
