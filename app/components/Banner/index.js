import {View, Text} from 'react-native';
import React from 'react';
import {styles} from './styles';

const Ring = () => {
  return (
    <View style={styles.ring1}>
      <View style={styles.ring2}>
        <View style={styles.ring3}></View>
      </View>
    </View>
  );
};

const Banner = () => {
  return (
    <View style={styles.container}>
      <Ring />
    </View>
  );
};

export default Banner;
