import {
  TextInput,
  Image,
  View,
  TouchableOpacity,
  Animated,
  Text,
  Pressable,
  Dimensions,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { styles } from "./styles";
import { icons } from "../../MyAssets";
import { colors } from "../../utils/theme";

const InputField = (props) => {
  const [showPassword, setShowPassword] = useState(
    props.secureTextEntry || false
  );
  const inputRef = useRef();
  const borderAnimation = useRef(new Animated.Value(0)).current;
  const [width, setWidth] = useState(Dimensions.get("window").width);
  const [height, setHeight] = useState(Dimensions.get("window").height);

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

  const tintColorAnimation = () => {
    Animated.timing(borderAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const tintOut = () => {
    Animated.timing(borderAnimation, {
      toValue: 0,
      duration: 600,
      useNativeDriver: false,
    }).start();
  };
  const handleInputPress = () => {
    if (props.reference) {
      props.reference.current.focus();
    } else {
      inputRef.current.focus();
    }
  };
  return (
    <View style={props.style?.outerView}>
      {props.label && <Text>{props.label} : </Text>}
      <Animated.View
        style={[
          styles.container,
          {
            borderColor: borderAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [colors.inputBorders, colors.primary], // 0 : 150, 0.5 : 75, 1 : 0
            }),
          },
          height < 420 && { height: 35, marginVertical: 5, borderRadius: 7 },
          props.style,
        ]}
      >
        <Pressable onPress={handleInputPress} style={styles.textContainer}>
          {props.icon && (
            <View style={styles.iconContainer}>
              <Image source={props.icon} style={styles.rightIcon} />
            </View>
          )}
          <TextInput
            onFocus={() => {
              tintColorAnimation();
            }}
            onBlur={() => {
              tintOut();
            }}
            ref={props?.reference ? props?.reference : inputRef}
            style={styles.input}
            placeholderTextColor={"#c1c1c1"}
            maxFontSizeMultiplier={1}
            {...props}
            secureTextEntry={showPassword}
          />
        </Pressable>

        {props.rightIcon && (
          <View style={styles.rightContainer}>
            <Image source={props.rightIcon} style={styles.rightIcon} />
          </View>
        )}

        {props.secureTextEntry && (
          <TouchableOpacity
            onPress={() => {
              setShowPassword(!showPassword);
            }}
            style={styles.rightContainer}
          >
            <Animated.Image
              source={!showPassword ? icons.eyeOpen : icons.eyeClose}
              style={[
                styles.rightIcon,
                {
                  tintColor: borderAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [colors.inputBorders, colors.primary], // 0 : 150, 0.5 : 75, 1 : 0
                  }),
                },
              ]}
            />
          </TouchableOpacity>
        )}
      </Animated.View>
      {props.error && <Text style={styles.error}>{props?.error}</Text>}
    </View>
  );
};

export default InputField;
