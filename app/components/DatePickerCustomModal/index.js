import {
  Platform,
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { themeColors } from "@/app/utils/theme";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@react-navigation/native";
const DatePickerCustomModal = ({
  selectedDate,
  onChangeDate,
  isVisible,
  onRequestClose,
}) => {
  const {colors} = useTheme()
  return (
    <View>
      {Platform.OS == "android" ? (
        <View>
          {isVisible ? (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="calendar"
              onChange={onChangeDate}
            />
          ) : null}
        </View>
      ) : null}

      {Platform.OS == "ios" ? (
        <Modal
          onRequestClose={onRequestClose}
          animationType="slide"
          transparent={true}
          visible={isVisible}
        >
          <View style={styles.container}>
            <Pressable
              style={{
                position: "absolute",
                height: "100%",
                backgroundColor: "#00000057",
                width: "100%",
              }}
              onPress={onRequestClose}
            />
            <LinearGradient
            // colors={["#0003" , colors.secondary]}
            colors={[colors.secondary,  "#FFE0EE", ]}

            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 2 }}
              style={{
                backgroundColor: colors.secondary,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                width: "100%",
                paddingBottom: 50,
              }}
            >
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="inline"
                accentColor={"black"}
                onChange={onChangeDate}
              />
            </LinearGradient>
          </View>
        </Modal>
      ) : null}
    </View>
  );
};

export default DatePickerCustomModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'red',
    justifyContent: "flex-end",
    alignItems: "center",
  },
});
