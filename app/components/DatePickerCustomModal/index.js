import {Platform, StyleSheet, Text, View, Modal, Pressable} from 'react-native';
import React, {useState} from 'react';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
const DatePickerCustomModal = ({
  selectedDate,
  onChangeDate,
  isVisible,
  onRequestClose,
}) => {
  return (
    <View>
      {Platform.OS == 'android' ? (
        <View>
          {isVisible ? (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="calendar"
              onChange={(event, date) => onChangeDate(date)}
            />
          ) : null}
        </View>
      ) : null}

      {Platform.OS == 'ios' ? (
        <Modal
          onRequestClose={onRequestClose}
          animationType="slide"
          transparent={true}
          visible={isVisible}>
          <View style={styles.container}>
            <Pressable 
            style={{
              position : "absolute",
              height : "100%",
              backgroundColor : "#00000057",
              width : "100%"
            }}
            onPress={onRequestClose}
            />
            <View style={{backgroundColor : "white" , 
          borderTopLeftRadius : 20 , borderTopRightRadius : 20,
          width : "100%",
          paddingBottom : 50
          }}>
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="inline"
              onChange={(event, date) => onChangeDate(date)}
            />
            </View>
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
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
