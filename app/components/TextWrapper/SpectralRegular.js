import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import TextWrapper from '.';

const SpectralRegular = props => {
  return (
    <TextWrapper {...props} style={[styles.font, props?.style]}>
      {props.children}
    </TextWrapper>
  );
};

export default SpectralRegular;

const styles = StyleSheet.create({
  font: {
    fontFamily: 'SpectralSC-Regular',
  },
});
